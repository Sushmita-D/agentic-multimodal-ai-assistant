from fastapi import FastAPI, UploadFile, File, Form
from ingestion.pdf_processor import extract_text
from llm.gemini import ask_gemini
from rag.chunker import chunk_text
from rag.embedder import create_embeddings
from rag.retriever import retrieve
from agents.qa_agent import answer_question
from agents.summary_agent import summarize_document
from agents.quiz_agent import generate_quiz
from graph.workflow import graph
from document_store import (
    create_document,
    save_chunk,
    get_document_chunks
)

import os

app = FastAPI()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):


    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    document_id = create_document(
        file.filename,
        "pdf"
    )

    document_text = extract_text(file_path)

    document_chunks = chunk_text(document_text)

    document_embeddings = create_embeddings(
        document_chunks
    )

    for i, chunk in enumerate(document_chunks):
        save_chunk(
            document_id,
            i + 1,
            chunk,
            document_embeddings[i]
        )

    print("TEXT START")
    print(document_text[:500])
    print("TEXT END")
    print("Chunks:", len(document_chunks))
    print("Embeddings Shape:", document_embeddings.shape)
    print("LENGTH =", len(document_text))

    return {
        "message": "PDF uploaded successfully",
        "document_id": document_id,
        "filename": file.filename,
        "characters": len(document_text),
        "chunks": len(document_chunks)
    }


@app.post("/agent")
async def agent(
    document_id: int = Form(...),
    question: str = Form(...)
):

    document_chunks, document_embeddings = get_document_chunks(
        document_id
    )

    state = {
        "question": question,
        "task": "",
        "document_chunks": document_chunks,
        "document_embeddings": document_embeddings,
        "result": ""
    }

    result = graph.invoke(state)

    return {
        "document_id": document_id,
        "task": result["task"],
        "response": result["result"]
    }
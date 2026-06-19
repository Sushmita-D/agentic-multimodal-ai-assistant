from fastapi import FastAPI, UploadFile, File, Form
from ingestion.pdf_processor import extract_text
from llm.gemini import ask_gemini
from rag.chunker import chunk_text
from rag.embedder import create_embeddings
from rag.retriever import retrieve
from document_store import save_chunk
from agents.qa_agent import answer_question
from agents.summary_agent import summarize_document
from agents.quiz_agent import generate_quiz
from graph.workflow import graph

app = FastAPI()
document_text = ""
document_chunks = []
document_embeddings = None


@app.post("/upload")

async def upload_pdf(file: UploadFile = File(...)):

    global document_text
    global document_chunks
    global document_embeddings

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    document_text = extract_text(file_path)

    document_chunks = chunk_text(document_text)
    document_embeddings = create_embeddings(
    document_chunks
    )
    for i, chunk in enumerate(document_chunks):
        save_chunk(
        file.filename,
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
        "characters": len(document_text)
    }


@app.post("/agent")
async def agent(question: str = Form(...)):

    state = {
        "question": question,
        "task": "",
        "document_text": document_text,
        "document_chunks": document_chunks,
        "document_embeddings": document_embeddings,
        "result": ""
    }

    result = graph.invoke(state)

    return {
        "task": result["task"],
        "response": result["result"]
    }
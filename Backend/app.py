from fastapi import FastAPI, UploadFile, File, Form
from ingestion.image_processor import extract_image_text
from ingestion.pdf_processor import extract_text
from rag.chunker import chunk_text
from rag.embedder import create_embeddings
from graph.workflow import graph
from ingestion.audio_processor import extract_audio_text
from ingestion.video_processor import extract_video_text
from fastapi.responses import FileResponse
from generators.documents.export_manager import export_manager
from agents.notes_agent import generate_notes
from agents.summary_agent import summarize_document
from agents.quiz_agent import generate_quiz
from agents.flashcard_agent import generate_flashcards
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
async def upload_document(file: UploadFile = File(...)):


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

    extension = os.path.splitext(file.filename)[1].lower()

    if extension == ".pdf":

        document_text = extract_text(file_path)

    elif extension in [
        ".mp3",
        ".wav",
        ".ogg",
        ".m4a"
    ]:

        document_text = extract_audio_text(file_path)

    elif extension in [
        ".mp4",
        ".mov",
        ".avi",
        ".mkv"
    ]:

        document_text = extract_video_text(file_path)
    elif extension in [".jpg", ".jpeg", ".png", ".webp"]:
        document_text = extract_image_text(file_path)
    else:

        return {
        "error": "Unsupported file type"
        }

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
        "message": "File uploaded successfully",
        "document_id": document_id,
        "filename": file.filename,
        "file_type": extension,
        "characters": len(document_text),
        "chunks": len(document_chunks)
    }


@app.post("/agent")
async def agent(
    document_id: int = Form(...),
    question: str = Form(...)
):

    # We still load chunks because Summary, Notes, Quiz,
    # and Flashcards need the full document.
    document_chunks, _ = get_document_chunks(
        document_id
    )

    state = {
        "document_id": document_id,
        "question": question,
        "task": "",
        "document_chunks": document_chunks,
        "result": ""
    }

    result = graph.invoke(state)

    return {
        "document_id": document_id,
        "task": result["task"],
        "response": result["result"]
    }
@app.post("/export")
async def export_document(
    document_id: int = Form(...),
    content_type: str = Form(...),
    format: str = Form(...)
):

    document_chunks, document_embeddings = get_document_chunks(
        document_id
    )

    document_text = "\n\n".join(document_chunks)

    if content_type == "notes":

        content = generate_notes(
        document_text
    )

    elif content_type == "summary":

        content = summarize_document(
        document_text
    )

    elif content_type == "quiz":

        content = generate_quiz(
        document_text
    )

    elif content_type == "flashcards":

        content = generate_flashcards(
        document_text
    )

    else:

        raise ValueError(
        "Unsupported content type"
    )

    file_path = await export_manager.export(
    format=format,
    title="Study Materials",
    content=content
    )

    return FileResponse(
        file_path,
        filename=f"Study_Notes.{format}"
    )    
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
from conversation_store import (
    save_message,
    load_history
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

    extension = os.path.splitext(file.filename)[1].lower()

    document_id = create_document(
        file.filename,
        extension.replace(".", "")
    )

    total_characters = 0
    total_chunks = 0
    chunk_number = 1

    # ---------------- PDF ----------------

    if extension == ".pdf":

        pages = extract_text(file_path)

        for page in pages:

            page_number = page["page"]
            page_text = page["text"]

            total_characters += len(page_text)

            page_chunks = chunk_text(page_text)

            page_embeddings = create_embeddings(
                page_chunks
            )

            for i, chunk in enumerate(page_chunks):

                save_chunk(
                    document_id,
                    chunk_number,
                    page_number,
                    chunk,
                    page_embeddings[i]
                )

                chunk_number += 1
                total_chunks += 1

    # ---------------- Audio ----------------

    elif extension in [
        ".mp3",
        ".wav",
        ".ogg",
        ".m4a"
    ]:

        document_text = extract_audio_text(file_path)

        total_characters = len(document_text)

        chunks = chunk_text(document_text)

        embeddings = create_embeddings(chunks)

        for i, chunk in enumerate(chunks):

            save_chunk(
                document_id,
                chunk_number,
                1,
                chunk,
                embeddings[i]
            )

            chunk_number += 1
            total_chunks += 1

    # ---------------- Video ----------------

    elif extension in [
        ".mp4",
        ".mov",
        ".avi",
        ".mkv"
    ]:

        document_text = extract_video_text(file_path)

        total_characters = len(document_text)

        chunks = chunk_text(document_text)

        embeddings = create_embeddings(chunks)

        for i, chunk in enumerate(chunks):

            save_chunk(
                document_id,
                chunk_number,
                1,
                chunk,
                embeddings[i]
            )

            chunk_number += 1
            total_chunks += 1

    # ---------------- Image ----------------

    elif extension in [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ]:

        document_text = extract_image_text(file_path)

        total_characters = len(document_text)

        chunks = chunk_text(document_text)

        embeddings = create_embeddings(chunks)

        for i, chunk in enumerate(chunks):

            save_chunk(
                document_id,
                chunk_number,
                1,
                chunk,
                embeddings[i]
            )

            chunk_number += 1
            total_chunks += 1

    else:

        return {
            "error": "Unsupported file type"
        }

    return {
        "message": "File uploaded successfully",
        "document_id": document_id,
        "filename": file.filename,
        "file_type": extension,
        "characters": total_characters,
        "chunks": total_chunks
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

    history = load_history(document_id)

    state = {
    "document_id": document_id,
    "question": question,
    "history": history,
    "task": "",
    "document_chunks": document_chunks,
    "result": ""
    }

    result = graph.invoke(state)
    save_message(
    document_id,
    "user",
    question
    )

    save_message(
    document_id,
    "assistant",
    result["result"]
    )
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
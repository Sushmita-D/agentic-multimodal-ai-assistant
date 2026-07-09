from fastapi import FastAPI, UploadFile, File, Form
from ingestion.image_processor import extract_image_text
from ingestion.pdf_processor import extract_text
from rag.chunker import chunk_text
from rag.embedder import create_embeddings
from graph.workflow import graph
from fastapi.middleware.cors import CORSMiddleware
from ingestion.audio_processor import extract_audio_text
from ingestion.video_processor import extract_video_text
from fastapi.responses import FileResponse
from generators.documents.export_manager import export_manager
from agents.notes_agent import generate_notes
from agents.summary_agent import summarize_document
from agents.quiz_agent import generate_quiz
from document_service import get_all_documents
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    print("1. Upload started")

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    print("2. File saved")

    extension = os.path.splitext(file.filename)[1].lower()

    print("3. Creating document...")

    document_id = create_document(
        file.filename,
        extension.replace(".", "")
    )

    print("4. Document created")

    total_characters = 0
    total_chunks = 0
    chunk_number = 1

    # ---------------- PDF ----------------

    if extension == ".pdf":

        print("5. Extracting PDF")

        pages = extract_text(file_path)

        print("6. PDF extracted")

        for page in pages:

            print(f"7. Processing page {page['page']}")

            page_number = page["page"]
            page_text = page["text"].strip()

            if len(page_text) < 30:
                continue

            total_characters += len(page_text)

            print("8. Chunking")

            page_chunks = chunk_text(page_text)

            print("9. Creating embeddings")

            page_embeddings = create_embeddings(page_chunks)

            print("10. Embeddings created")

            for i, chunk in enumerate(page_chunks):

                print(f"Saving chunk {i+1}")

                save_chunk(
                    document_id,
                    chunk_number,
                    page_number,
                    chunk,
                    page_embeddings[i]
                )

                chunk_number += 1
                total_chunks += 1

            print("11. Chunks saved")

            print("12. Upload completed")

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
@app.get("/documents")
async def documents():

    rows = get_all_documents()

    result = []

    for row in rows:

        result.append(
    {
        "id": row[0],
        "filename": row[1],
        "file_type": row[2],
        "uploaded_at": str(row[3])
    }
)

    return result
@app.get("/history/{document_id}")
async def get_history(document_id: int):

    history = load_history(document_id)

    return {
        "document_id": document_id,
        "history": history
    }
    from database import get_connection

@app.get("/db-test")
def db_test():
    try:
        print("Connecting...")

        conn = get_connection()

        print("Connected!")

        cur = conn.cursor()

        cur.execute("SELECT NOW();")

        result = cur.fetchone()

        cur.close()
        conn.close()

        return {
            "status": "success",
            "time": str(result[0])
        }

    except Exception as e:
        print("DATABASE ERROR:", str(e))
        return {
            "status": "error",
            "message": str(e)
        } 
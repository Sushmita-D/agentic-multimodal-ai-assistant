import numpy as np
from database import get_connection
from rag.embedder import model


def create_document(filename, file_type):
    """
    Creates a new document entry and returns its ID.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO documents (filename, file_type)
        VALUES (%s, %s)
        RETURNING id;
        """,
        (filename, file_type)
    )

    document_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    return document_id


def save_chunk(
    document_id,
    chunk_number,
    page_number,
    chunk_text,
    embedding
):
    """
    Saves a document chunk with its page number and embedding.
    """

    conn = get_connection()
    cursor = conn.cursor()

    vector = "[" + ",".join(map(str, embedding.tolist())) + "]"

    cursor.execute(
        """
        INSERT INTO document_chunks
        (
            document_id,
            chunk_number,
            page_number,
            chunk_text,
            embedding
        )
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            document_id,
            chunk_number,
            page_number,
            chunk_text,
            vector
        )
    )

    conn.commit()

    cursor.close()
    conn.close()


def retrieve_chunks(
    document_id: int,
    question: str,
    top_k: int = 5
):
    """
    Retrieves the most relevant chunks using pgVector.
    """

    conn = get_connection()
    cursor = conn.cursor()

    query_embedding = model.encode(question)

    vector = "[" + ",".join(
        map(str, query_embedding.tolist())
    ) + "]"

    cursor.execute(
        """
        SELECT
            chunk_number,
            page_number,
            chunk_text,
            1 - (embedding <=> %s::vector) AS similarity
        FROM document_chunks
        WHERE document_id = %s
        ORDER BY embedding <=> %s::vector
        LIMIT %s;
        """,
        (
            vector,
            document_id,
            vector,
            top_k
        )
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    results = []

    print("\n========== PGVECTOR RESULTS ==========\n")

    for chunk_number, page_number, chunk, score in rows:

        print(f"Chunk : {chunk_number}")
        print(f"Page  : {page_number}")
        print(f"Score : {score:.4f}")
        print(chunk[:150])
        print("-" * 60)

        results.append(
            {
                "chunk_number": chunk_number,
                "page_number": page_number,
                "chunk": chunk,
                "score": score
            }
        )

    return results


def get_document_chunks(document_id):
    """
    Loads all chunks and embeddings for a document.
    """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            chunk_text,
            embedding
        FROM document_chunks
        WHERE document_id = %s
        ORDER BY chunk_number;
        """,
        (document_id,)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    chunks = []
    embeddings = []

    for chunk, embedding in rows:
        chunks.append(chunk)
        embeddings.append(embedding)

    return chunks, np.array(embeddings)
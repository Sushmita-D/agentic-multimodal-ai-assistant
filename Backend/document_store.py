import psycopg2
from database import get_connection
from rag.embedder import model
import numpy as np

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


def retrieve_chunks(
    document_id: int,
    question: str,
    top_k: int = 5
):

    conn = get_connection()
    cursor = conn.cursor()

    query_embedding = model.encode(question)

    vector = "[" + ",".join(
        map(str, query_embedding.tolist())
    ) + "]"

    cursor.execute(
        """
        SELECT
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

    print("\n========== PGVECTOR RESULTS ==========\n")

    results = []

    for chunk, score in rows:

        print(f"Score : {score:.4f}")
        print(chunk[:150])
        print("-" * 60)

        results.append(
            {
                "chunk": chunk,
                "score": score
            }
        )

    return results
def save_chunk(document_id, chunk_number, chunk_text, embedding):

    conn = get_connection()
    cursor = conn.cursor()

    vector = "[" + ",".join(map(str, embedding.tolist())) + "]"

    cursor.execute(
        """
        INSERT INTO document_chunks
        (
            document_id,
            chunk_number,
            chunk_text,
            embedding
        )
        VALUES (%s,%s,%s,%s)
        """,
        (
            document_id,
            chunk_number,
            chunk_text,
            vector
        )
    )

    conn.commit()

    cursor.close()
    conn.close()


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

    for row in rows:
        chunks.append(row[0])
        embeddings.append(row[1])

    return chunks, np.array(embeddings)
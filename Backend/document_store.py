import numpy as np
from database import get_connection 


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
        embedding,
        search_vector
    )
    VALUES
    (
        %s,
        %s,
        %s,
        %s,
        %s,
        to_tsvector('english', %s)
    )
    """,
    (
        document_id,
        chunk_number,
        page_number,
        chunk_text,
        vector,
        chunk_text
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

    for chunk, embedding in rows:
        chunks.append(chunk)
        embeddings.append(embedding)

    return chunks, np.array(embeddings)
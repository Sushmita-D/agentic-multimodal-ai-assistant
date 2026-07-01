from database import get_connection
from rag.embedder import model


def retrieve(
    document_id: int,
    question: str,
    top_k: int = 5
):
    """
    Retrieve the most relevant chunks using pgVector.
    """

    query_embedding = model.encode(question)

    query_vector = "[" + ",".join(
        map(str, query_embedding.tolist())
    ) + "]"

    conn = get_connection()
    cursor = conn.cursor()

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
        query_vector,   # similarity calculation
        document_id,    # WHERE
        query_vector,   # ORDER BY
        top_k           # LIMIT
    )
)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    results = []

    print("\n========== PGVECTOR RESULTS ==========\n")

    for chunk_number, page_number, chunk, score in rows:

        print(f"Chunk      : {chunk_number}")
        print(f"Page       : {page_number}")
        print(f"Similarity : {score:.4f}")
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
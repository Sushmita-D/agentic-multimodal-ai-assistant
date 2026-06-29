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

    # Convert question into an embedding
    query_embedding = model.encode(question)

    # Convert embedding into pgVector format
    query_vector = "[" + ",".join(
        map(str, query_embedding.tolist())
    ) + "]"
    
    # Connect to PostgreSQL
    conn = get_connection()
    cursor = conn.cursor()
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
            query_vector,
            document_id,
            query_vector,
            top_k
        )
    ) 
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    results = []

    print("\n========== PGVECTOR RESULTS ==========\n")

    for chunk, score in rows:

        print(f"Similarity : {score:.4f}")
        print(chunk[:150])
        print("-" * 60)

        results.append(
            {
                "chunk": chunk,
                "score": score
            }
        )

    return results
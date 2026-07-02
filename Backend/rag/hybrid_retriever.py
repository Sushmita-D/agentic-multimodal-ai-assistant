from database import get_connection
from rag.pgvector_retriever import retrieve

def keyword_search(
    document_id,
    question,
    top_k=5
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            chunk_number,
            page_number,
            chunk_text,
            ts_rank(
                search_vector,
                plainto_tsquery('english', %s)
            ) AS score
        FROM document_chunks
        WHERE
            document_id = %s
            AND search_vector @@ plainto_tsquery('english', %s)
        ORDER BY score DESC
        LIMIT %s;
        """,
        (
            question,
            document_id,
            question,
            top_k
        )
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    results = []

    for chunk_number, page_number, chunk, score in rows:

        results.append(
            {
                "chunk_number": chunk_number,
                "page_number": page_number,
                "chunk": chunk,
                "score": score
            }
        )

    print("\n========== POSTGRES FULL-TEXT SEARCH ==========\n")
    print("Matches:", len(results))

    return results

def hybrid_search(
    document_id: int,
    question: str,
    top_k: int = 5
):
    """
    Combine Keyword Search + Vector Search.
    """

    keyword_results = keyword_search(
        document_id,
        question,
        top_k
    )

    vector_results = retrieve(
        document_id,
        question,
        top_k
    )

    combined = {}

    for item in keyword_results:
        combined[item["chunk_number"]] = item

    for item in vector_results:
        key = item["chunk_number"]

        if (
            key not in combined
            or item["score"] > combined[key]["score"]
        ):
            combined[key] = item

    combined = list(combined.values())

    print("\n========== HYBRID SEARCH ==========\n")
    print(f"Keyword Results : {len(keyword_results)}")
    print(f"Vector Results  : {len(vector_results)}")
    print(f"Final Results   : {len(combined)}")
    
    combined.sort(
    key=lambda item: item["score"],
    reverse=True
)

    return combined[:top_k]
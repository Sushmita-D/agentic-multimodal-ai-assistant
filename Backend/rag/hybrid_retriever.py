from database import get_connection
from rag.pgvector_retriever import retrieve


from database import get_connection
import re

def keyword_search(document_id, question, top_k=5):

    conn = get_connection()
    cursor = conn.cursor()

    # Extract keywords
    words = re.findall(r"\w+", question.lower())

    stop_words = {
        "what", "is", "are", "the", "a", "an",
        "define", "explain", "tell", "me", "about"
    }

    keywords = [
        word
        for word in words
        if word not in stop_words
    ]

    if not keywords:
        return []

    conditions = " OR ".join(
        ["LOWER(chunk_text) LIKE %s"] * len(keywords)
    )

    sql = f"""
    SELECT
        chunk_number,
        page_number,
        chunk_text
    FROM document_chunks
    WHERE document_id=%s
      AND ({conditions})
    LIMIT %s;
    """

    params = [document_id]

    for word in keywords:
        params.append(f"%{word}%")

    params.append(top_k)

    cursor.execute(sql, params)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    results = []

    for chunk_number, page_number, chunk in rows:

        results.append(
            {
                "chunk_number": chunk_number,
                "page_number": page_number,
                "chunk": chunk,
                "score": 1.0
            }
        )

    print("\n===== KEYWORD SEARCH =====")
    print("Keywords:", keywords)
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

    combined = []
    seen = set()

    # Add keyword search results first
    for item in keyword_results:

        key = item["chunk_number"]

        if key not in seen:
            combined.append(item)
            seen.add(key)

    # Add vector search results
    for item in vector_results:

        key = item["chunk_number"]

        if key not in seen:
            combined.append(item)
            seen.add(key)

    print("\n========== HYBRID SEARCH ==========\n")
    print(f"Keyword Results : {len(keyword_results)}")
    print(f"Vector Results  : {len(vector_results)}")
    print(f"Final Results   : {len(combined)}")

    return combined[:top_k]
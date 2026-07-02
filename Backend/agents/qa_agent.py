from rag.hybrid_retriever import hybrid_search
from llm.manager import llm_manager


def answer_question(question, document_id, history):

    retrieved_chunks = hybrid_search(
        document_id,
        question
    )

    context = "\n\n".join(
        item["chunk"]
        for item in retrieved_chunks
    )
    conversation = ""

    for item in history:

        conversation += (
        f"{item['role'].capitalize()}: "
        f"{item['message']}\n"
        )

    print("\n========== QA REQUEST ==========")
    print(f"History messages: {len(history)}")
    print(f"Retrieved chunks: {len(retrieved_chunks)}")
    print(f"Context length: {len(context)} characters")
    print("================================\n")

    full_context = f"""
    Previous Conversation
    ---------------------

    {conversation}

    Document Context
    ----------------

    {context}
    """

    answer = llm_manager.generate(
    full_context,
    question
    )

    citations = "\n\nSources\n"
    citations += "-------------------------\n"

    for item in retrieved_chunks:

        citations += (
            f"Page {item['page_number']} | "
            f"Chunk {item['chunk_number']} | "
            f"Similarity {item['score']:.2f}\n"
        )

    return answer + citations
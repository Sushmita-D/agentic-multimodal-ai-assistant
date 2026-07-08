from rag.hybrid_retriever import hybrid_search
from llm.manager import llm_manager


def answer_question(question, document_id, history):
    
    retrieved_chunks = hybrid_search(
        document_id,
        question
    )
    if not retrieved_chunks:
        return "I couldn't find relevant information in this document."

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

    pages = sorted(
    set(item["page_number"] for item in retrieved_chunks)
    )

    sources = "\n\n📖 Sources: "

    sources += ", ".join(
        f"Page {page}"
        for page in pages
    )

    return answer + sources
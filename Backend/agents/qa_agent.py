from rag.hybrid_retriever import hybrid_search
from llm.manager import llm_manager


def answer_question(question, document_id):

    retrieved_chunks = hybrid_search(
        document_id,
        question
    )

    context = "\n\n".join(
        item["chunk"]
        for item in retrieved_chunks
    )

    print("\n========== CONTEXT SENT TO LLM ==========\n")
    print(context)
    print("\n=========================================\n")

    answer = llm_manager.generate(
        context,
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
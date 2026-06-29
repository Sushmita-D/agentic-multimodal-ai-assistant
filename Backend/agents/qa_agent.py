from rag.pgvector_retriever import retrieve
from llm.manager import llm_manager


def answer_question(question, document_id):

    retrieved_chunks = retrieve(
        document_id,
        question
    )

    context = "\n\n".join(
        item["chunk"]
        for item in retrieved_chunks
    )

    answer = llm_manager.generate(
        context,
        question
    )

    return answer
from rag.retriever import retrieve
from llm.manager import llm_manager


def answer_question(
    question,
    document_chunks,
    document_embeddings
):

    retrieved_chunks = retrieve(
        question,
        document_chunks,
        document_embeddings
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
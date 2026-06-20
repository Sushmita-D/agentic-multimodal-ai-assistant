from rag.retriever import retrieve
from llm.manager import llm_manager

def answer_question(
    question,
    document_chunks,
    document_embeddings
):

    relevant_chunks = retrieve(
        question,
        document_chunks,
        document_embeddings
    )

    context = "\n".join(relevant_chunks)

    answer = llm_manager.generate(
        context,
        question
    )

    return answer
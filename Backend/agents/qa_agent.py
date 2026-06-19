from rag.retriever import retrieve
from llm.gemini import ask_gemini

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

    answer = ask_gemini(
        context,
        question
    )

    return answer
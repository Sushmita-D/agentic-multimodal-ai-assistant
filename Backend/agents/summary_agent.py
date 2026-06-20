from llm.manager import llm_manager

def summarize_document(document_text):

    question = """
    Summarize this document.
    Include:
    - Main Topics
    - Key Points
    - Important Concepts
    """

    summary = llm_manager.generate(
        document_text,
        question
    )

    return summary
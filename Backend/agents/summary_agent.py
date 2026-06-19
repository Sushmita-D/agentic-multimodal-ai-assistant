from llm.gemini import ask_gemini

def summarize_document(document_text):

    question = """
    Summarize this document.
    Include:
    - Main Topics
    - Key Points
    - Important Concepts
    """

    summary = ask_gemini(
        document_text,
        question
    )

    return summary
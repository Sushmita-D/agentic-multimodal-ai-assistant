from llm.gemini import ask_gemini

def generate_quiz(document_text):

    question = """
    Create a quiz from this document.

    Include:
    - 10 Multiple Choice Questions
    - 4 Options per Question
    - Correct Answer
    """

    quiz = ask_gemini(
        document_text,
        question
    )

    return quiz
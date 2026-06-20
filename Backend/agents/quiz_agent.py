from llm.manager import llm_manager

def generate_quiz(document_text):

    question = """
    Create a quiz from this document.

    Include:
    - 10 Multiple Choice Questions
    - 4 Options per Question
    - Correct Answer
    """

    quiz = llm_manager.generate(
        document_text,
        question
    )

    return quiz
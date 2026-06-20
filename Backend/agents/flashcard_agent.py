from llm.manager import llm_manager


def generate_flashcards(document_text):

    question = """
Create study flashcards from this document.

Instructions:
- Create 10 flashcards.
- Each flashcard must have:
  Q:
  A:
- Keep answers concise.
- Use only the document.
- Do not invent information.
"""

    return llm_manager.generate(
        document_text,
        question
    )
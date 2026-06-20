from llm.manager import llm_manager


def generate_notes(document_text):

    question = """
Create well-structured study notes from this document.

Instructions:
- Use headings and subheadings.
- Use bullet points.
- Highlight key concepts.
- Include definitions if available.
- Do not add information that is not present in the document.
"""

    return llm_manager.generate(
        document_text,
        question
    )
from llm.manager import llm_manager


def generate_teaching_script(document_text):

    question = """
You are an expert teacher.

Your task is to convert the document into a teaching script.

Instructions:

- Explain naturally like a teacher.
- Use simple language.
- Introduce every topic.
- Explain concepts one by one.
- Add transitions between topics.
- Keep the explanation engaging.
- Do NOT invent facts.
- Use ONLY information from the document.

Return only the teaching script.
"""

    return llm_manager.generate(
        document_text,
        question
    )
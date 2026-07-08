import json

from llm.manager import llm_manager


def generate_flashcards(document_text):

    question = """
You are an AI Flashcard Generator.

Generate EXACTLY 10 flashcards from the document.

Return ONLY valid JSON.

Format:

[
  {
    "question": "...",
    "answer": "..."
  }
]

Rules:

- Generate EXACTLY 10 flashcards.
- Cover the most important concepts from the document.
- One concept per flashcard.
- Keep answers concise (1-3 sentences).
- Do NOT include markdown.
- Do NOT include ```json.
- Do NOT include explanations.
- Do NOT include headings.
- Do NOT include numbering.
- The first character MUST be [
- The last character MUST be ]
- Output ONLY valid JSON.
"""

    print("\n========== GENERATING FLASHCARDS ==========\n")
    print("Document Length:", len(document_text))

    print("Calling LLM...")

    response = llm_manager.generate(
        document_text,
        question
    )

    print("LLM Finished\n")

    print("========== RAW FLASHCARD RESPONSE ==========")
    print(response)
    print("===========================================\n")

    if not response:
        print("LLM returned an empty response.")
        return []

    # Clean common formatting added by LLMs
    response = response.strip()
    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    try:
        flashcards = json.loads(response)

        print(f"Successfully parsed {len(flashcards)} flashcards.")

        return flashcards

    except json.JSONDecodeError as e:

        print("\n========== FLASHCARD JSON ERROR ==========")
        print("JSON Error:", e)
        print("Response:")
        print(response)
        print("==========================================\n")

        return []
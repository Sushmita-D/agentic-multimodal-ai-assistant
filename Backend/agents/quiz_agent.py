import json

from llm.manager import llm_manager


def generate_quiz(document_text):

    question = """
You are an AI Quiz Generator.

Generate between 15 and 20 multiple choice questions depending on the amount of content in the document.

Return ONLY valid JSON.

Format:

[
  {
    "question": "...",
    "options": [
      "...",
      "...",
      "...",
      "..."
    ],
    "answer": "..."
  }
]

Rules:

- Generate 15–20 questions.
- Cover the entire document.
- Exactly 4 options for each question.
- Only one correct answer.
- Make distractors realistic.
- Do NOT include markdown.
- Do NOT include ```json.
- Do NOT include explanations.
- Do NOT include numbering.
- The first character MUST be [
- The last character MUST be ]
- Output ONLY valid JSON.
"""

    response = llm_manager.generate(
        document_text,
        question
    )

    print("\n========== RAW QUIZ RESPONSE ==========")
    print(response)
    print("=======================================\n")

    try:

        # Remove Markdown code fences if present
        response = response.strip()
        response = response.replace("```json", "")
        response = response.replace("```", "")
        response = response.strip()

        return json.loads(response)

    except json.JSONDecodeError as e:

        print("Invalid Quiz JSON returned by LLM")
        print("JSON Error:", e)
        print("Response:")
        print(response)

        return []
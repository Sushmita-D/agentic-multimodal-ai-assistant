from ollama import chat

from llm.base import BaseLLM
from llm.config import OLLAMA_MODEL


class OllamaProvider(BaseLLM):

    def generate(self, context: str, question: str) -> str:

        prompt = f"""
You are a document analysis assistant.

Use ONLY the information in the document.

If the document appears to be a resume,
state that clearly.

Document:
{context}

Question:
{question}

Answer:
"""

        response = chat(
            model=OLLAMA_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response["message"]["content"]
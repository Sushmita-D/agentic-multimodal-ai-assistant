print("Ollama provider imported")

from ollama import chat

from llm.base import BaseLLM
from llm.config import OLLAMA_MODEL


class OllamaProvider(BaseLLM):

    def generate(self, context: str, question: str) -> str:

        print("Step 1 - Entered generate()")

        prompt = f"""
You are a document analysis assistant.

Document:
{context}

Question:
{question}

Answer:
"""

        print("Step 2 - Prompt created")

        response = chat(
            model=OLLAMA_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        print("Step 3 - Got response from Ollama")

        return response["message"]["content"]
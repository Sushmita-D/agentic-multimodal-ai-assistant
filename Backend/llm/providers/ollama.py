print("Ollama provider imported")

from ollama import Client

from llm.base import BaseLLM
from llm.config import (
    OLLAMA_MODEL,
    OLLAMA_HOST
)


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

        client = Client(host=OLLAMA_HOST)

        response = client.chat(
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
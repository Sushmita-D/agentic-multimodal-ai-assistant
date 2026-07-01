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
You are an Enterprise Retrieval-Augmented Generation (RAG) Assistant.

Rules:
1. Answer ONLY using the Document Context below.
2. If the answer exists in the context, explain it clearly.
3. NEVER say "The document does not contain..." unless the answer is genuinely absent.
4. Do not use outside knowledge if the context already contains the answer.
5. Be concise and accurate.
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
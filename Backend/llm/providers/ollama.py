import logging

logger = logging.getLogger(__name__)

logger.info("Ollama provider initialized")

from ollama import Client

from llm.base import BaseLLM
from llm.config import (
    OLLAMA_MODEL,
    OLLAMA_HOST
)


class OllamaProvider(BaseLLM):

    def generate(self, context: str, question: str) -> str:

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

        try:

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

            return response["message"]["content"]

        except Exception as e:

            print("Ollama Error:", e)

            return "Unable to connect to Ollama. Please try again later."
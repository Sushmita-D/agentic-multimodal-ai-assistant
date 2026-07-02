import os

import google.generativeai as genai
from dotenv import load_dotenv

from llm.base import BaseLLM

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


class GeminiProvider(BaseLLM):

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
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.2,
                    "max_output_tokens": 1024,
                }
            )

            return response.text

        except Exception as e:
            return f"Gemini Error: {str(e)}"
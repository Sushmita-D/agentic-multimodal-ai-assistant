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

        response = model.generate_content(prompt)

        return response.text
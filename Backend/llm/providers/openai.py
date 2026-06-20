import os

from openai import OpenAI
from dotenv import load_dotenv

from llm.base import BaseLLM
from llm.config import OPENAI_MODEL

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


class OpenAIProvider(BaseLLM):

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

        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content
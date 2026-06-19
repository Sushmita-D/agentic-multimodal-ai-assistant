from google import genaih

from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def ask_gemini(context, question):

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
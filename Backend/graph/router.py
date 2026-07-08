from langgraph.func import task

from llm.manager import llm_manager

def detect_task(user_prompt, history):

    conversation = ""

    for item in history:
        conversation += (
            f"{item['role'].capitalize()}: "
            f"{item['message']}\n"
        )

    router_prompt = f"""
You are an AI Router.

Your job is to classify the user's request into EXACTLY ONE task.

Available Tasks:
- qa
- summary
- quiz
- notes
- flashcards

Rules:

1. If the current request is a follow-up question about a previous answer,
choose qa.

2. If the user asks any question about the document,
choose qa.

3. If the user asks for a summary or overview of the entire document,
choose summary.

4. If the user asks to generate a quiz, MCQs, test, or exam questions,
choose quiz.

5. If the user asks to generate notes or study notes,
choose notes.

6. If the user asks to generate flashcards, study cards, or revision cards,
choose flashcards.

Conversation History:
---------------------
{conversation}

Current User Request:
---------------------
{user_prompt}

Reply with ONLY ONE WORD:

qa
summary
quiz
notes
flashcards
"""

    task = llm_manager.generate("", router_prompt)

    task = task.strip().lower()

    allowed = [
        "qa",
        "summary",
        "quiz",
        "notes",
        "flashcards"
        ]

    if task not in allowed:
        print(f"Invalid task from LLM: {task}")
        return "qa"

    return task
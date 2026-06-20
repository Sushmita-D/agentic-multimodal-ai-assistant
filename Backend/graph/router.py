from llm.manager import llm_manager

def detect_task(user_prompt):

    router_prompt = f"""
You are an AI Router.

Choose ONLY one task.

Tasks:
qa
summary
quiz
notes
flashcards

Rules:

If user asks a question about the document -> qa

If user asks to summarize
or explain briefly -> summary

If user asks to generate questions,
MCQs,
test,
exam,
quiz -> quiz

If user asks to generate notes,
study notes,
make notes,
prepare notes -> notes

If user asks to generate flashcards,
study cards,
revision cards,
Q&A cards -> flashcards

Reply ONLY with

qa

or

summary

or

quiz

or

notes  

or 

flashcards

User Request:

{user_prompt}
"""

    task = llm_manager.generate("", router_prompt)

    return task.strip().lower()
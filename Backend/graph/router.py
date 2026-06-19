from llm.gemini import ask_gemini

def detect_task(user_prompt):

    router_prompt = f"""
You are an AI Router.

Choose ONLY one task.

Tasks:
qa
summary
quiz

Rules:

If user asks a question about the document -> qa

If user asks to summarize
or explain briefly -> summary

If user asks to generate questions,
MCQs,
test,
exam,
quiz -> quiz

Reply ONLY with

qa

or

summary

or

quiz

User Request:

{user_prompt}
"""

    task = ask_gemini("", router_prompt)

    return task.strip().lower()
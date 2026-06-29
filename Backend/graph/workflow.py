from typing import TypedDict, List, Any

from langgraph.graph import StateGraph, END

from graph.router import detect_task
from agents.qa_agent import answer_question
from agents.summary_agent import summarize_document
from agents.quiz_agent import generate_quiz
from agents.notes_agent import generate_notes
from agents.flashcard_agent import generate_flashcards


class AgentState(TypedDict):
    question: str
    task: str
    document_id: int
    document_chunks: List[str]
    result: str


# -------------------------
# Router Node
# -------------------------

def router_node(state: AgentState):

    task = detect_task(state["question"])

    state["task"] = task

    return state


# -------------------------
# QA Agent
# -------------------------

def qa_node(state: AgentState):

    answer = answer_question(
    state["question"],
    state["document_id"]
)

    state["result"] = answer

    return state


# -------------------------
# Summary Agent
# -------------------------

def summary_node(state: AgentState):

    document_text = "\n\n".join(state["document_chunks"])

    summary = summarize_document(
        document_text
    )

    state["result"] = summary

    return state


# -------------------------
# Quiz Agent
# -------------------------

def quiz_node(state: AgentState):

    document_text = "\n\n".join(state["document_chunks"])

    quiz = generate_quiz(
        document_text
)

    state["result"] = quiz

    return state

# -------------------------
# Notes Agent
# -------------------------

def notes_node(state: AgentState):

    document_text = "\n\n".join(state["document_chunks"])

    notes = generate_notes(
        document_text
    )

    state["result"] = notes

    return state

# -------------------------
# flashcards Agent
# -------------------------

def flashcard_node(state: AgentState):

    document_text = "\n\n".join(state["document_chunks"])

    flashcards = generate_flashcards(
        document_text
    )

    state["result"] = flashcards

    return state


# -------------------------
# Build Graph
# -------------------------

builder = StateGraph(AgentState)

builder.add_node("router", router_node)
builder.add_node("qa", qa_node)
builder.add_node("summary", summary_node)
builder.add_node("quiz", quiz_node)
builder.add_node("notes", notes_node)
builder.add_node("flashcards", flashcard_node)
builder.set_entry_point("router")

builder.add_conditional_edges(
    "router",
    lambda state: state["task"],
    {
        "qa": "qa",
        "summary": "summary",
        "quiz": "quiz",
        "notes": "notes",
        "flashcards": "flashcards"
    }
)

builder.add_edge("qa", END)
builder.add_edge("summary", END)
builder.add_edge("quiz", END)
builder.add_edge("notes", END)
builder.add_edge("flashcards", END)
graph = builder.compile()
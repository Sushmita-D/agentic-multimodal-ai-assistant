from typing import TypedDict, List, Any

from langgraph.graph import StateGraph, END

from graph.router import detect_task
from agents.qa_agent import answer_question
from agents.summary_agent import summarize_document
from agents.quiz_agent import generate_quiz


class AgentState(TypedDict):
    question: str
    task: str
    document_text: str
    document_chunks: List[str]
    document_embeddings: Any
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
        state["document_chunks"],
        state["document_embeddings"]
    )

    state["result"] = answer

    return state


# -------------------------
# Summary Agent
# -------------------------

def summary_node(state: AgentState):

    summary = summarize_document(
        state["document_text"]
    )

    state["result"] = summary

    return state


# -------------------------
# Quiz Agent
# -------------------------

def quiz_node(state: AgentState):

    quiz = generate_quiz(
        state["document_text"]
    )

    state["result"] = quiz

    return state


# -------------------------
# Build Graph
# -------------------------

builder = StateGraph(AgentState)

builder.add_node("router", router_node)
builder.add_node("qa", qa_node)
builder.add_node("summary", summary_node)
builder.add_node("quiz", quiz_node)

builder.set_entry_point("router")

builder.add_conditional_edges(
    "router",
    lambda state: state["task"],
    {
        "qa": "qa",
        "summary": "summary",
        "quiz": "quiz"
    }
)

builder.add_edge("qa", END)
builder.add_edge("summary", END)
builder.add_edge("quiz", END)

graph = builder.compile()
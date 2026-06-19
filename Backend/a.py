from graph.workflow import graph

state = {

    "question": "Generate a quiz from this document",

    "task": "",

    "document_text": open(
        "Sushmita_d (28).txt",
        encoding="utf8"
    ).read(),

    "document_chunks": [],

    "document_embeddings": None,

    "result": ""
}

result = graph.invoke(state)

print(result["result"])
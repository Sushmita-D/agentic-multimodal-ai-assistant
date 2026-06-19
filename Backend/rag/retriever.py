import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

def retrieve(query, chunks, embeddings, top_k=5):

    query_embedding = model.encode([query])

    similarities = np.dot(
        embeddings,
        query_embedding.T
    ).flatten()

    top_indices = similarities.argsort()[-top_k:][::-1]

    return [chunks[i] for i in top_indices]
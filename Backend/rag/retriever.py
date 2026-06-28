from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def retrieve(query, chunks, embeddings, top_k=10):

    query_embedding = model.encode([query])

    similarities = cosine_similarity(
        query_embedding,
        embeddings
    )[0]

    top_indices = similarities.argsort()[-top_k:][::-1]

    results = []

    print("\n========== RETRIEVAL RESULTS ==========\n")

    for index in top_indices:

        score = float(similarities[index])

        print(f"Score : {score:.4f}")
        print(chunks[index][:150])
        print("-" * 60)

        results.append(
            {
                "chunk": chunks[index],
                "score": score
            }
        )

    return results
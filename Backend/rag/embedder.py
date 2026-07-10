from sentence_transformers import SentenceTransformer
import time

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(
    chunks,
    batch_size=32,
    show_progress_bar=False
):
    print("Embedding started")

    start = time.time()

    embeddings = model.encode(
        chunks,
        batch_size=batch_size,
        show_progress_bar=show_progress_bar
    )

    print(f"Embedding finished in {time.time() - start:.2f} sec")

    return embeddings
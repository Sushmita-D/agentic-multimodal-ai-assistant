print("1 Upload started")

print("2 File saved")

print("3 Creating document")

print("4 PDF extraction")

print("5 Chunking")

print("6 Creating embeddings")

print("7 Saving chunks")

print("8 Upload completed")
from sentence_transformers import SentenceTransformer
import time

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(chunks):
    print("Embedding started")
    start = time.time()

    embeddings = model.encode(chunks)

    print(f"Embedding finished in {time.time()-start:.2f} sec")

    return embeddings
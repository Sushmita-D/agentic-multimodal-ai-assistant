from sentence_transformers import SentenceTransformer

print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")

print("Embedding model loaded.")
def create_embeddings(chunks):

    print("Creating embeddings...")

    embeddings = model.encode(chunks)

    print("Embeddings created.")

    return embeddings
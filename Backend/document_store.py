from database import conn, cursor
import json

def save_chunk(filename, chunk_number, chunk_text, embedding):

    cursor.execute(
        """
        INSERT INTO documents
        (filename, chunk_number, chunk_text, embedding)
        VALUES (%s,%s,%s,%s)
        """,
        (
            filename,
            chunk_number,
            chunk_text,
            json.dumps(embedding.tolist())
        )
    )

    conn.commit()
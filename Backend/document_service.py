from database import get_connection

def get_all_documents():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            filename,
            file_type,
            uploaded_at 
        FROM documents
        ORDER BY uploaded_at DESC;
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows
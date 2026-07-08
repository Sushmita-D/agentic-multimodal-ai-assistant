import json

from database import get_connection


def save_message(
    document_id: int,
    role: str,
    message
):
    conn = get_connection()
    cursor = conn.cursor()

    # Convert list/dict to JSON string
    if not isinstance(message, str):
        message = json.dumps(message, ensure_ascii=False)

    cursor.execute(
        """
        INSERT INTO conversations
        (
            document_id,
            role,
            message
        )
        VALUES (%s,%s,%s)
        """,
        (
            document_id,
            role,
            message
        )
    )

    conn.commit()

    cursor.close()
    conn.close()


def load_history(document_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            role,
            message
        FROM conversations
        WHERE document_id=%s
        ORDER BY created_at;
        """,
        (document_id,)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    history = []

    for role, message in rows:

        history.append(
            {
                "role": role,
                "message": message
            }
        )

    return history


def clear_history(document_id: int):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM conversations
        WHERE document_id=%s;
        """,
        (document_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()
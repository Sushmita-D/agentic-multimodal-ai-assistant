import psycopg2


def get_connection():

    return psycopg2.connect(
        host="localhost",
        port="5431",
        database="rag_db",
        user="postgres",
        password="Postgres123@"
    )
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port="5431",
    database="rag_db",
    user="postgres",
    password="Postgres123@"
)

cursor = conn.cursor()
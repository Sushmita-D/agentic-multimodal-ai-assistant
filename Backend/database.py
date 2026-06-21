import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

print("HOST =", os.getenv("DATABASE_HOST"))
print("PORT =", os.getenv("DATABASE_PORT"))
print("DB =", os.getenv("DATABASE_NAME"))
print("USER =", os.getenv("DATABASE_USER"))
print("PASSWORD =", os.getenv("DATABASE_PASSWORD"))

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DATABASE_HOST"),
        port=os.getenv("DATABASE_PORT"),
        database=os.getenv("DATABASE_NAME"),
        user=os.getenv("DATABASE_USER"),
        password=os.getenv("DATABASE_PASSWORD")
    )
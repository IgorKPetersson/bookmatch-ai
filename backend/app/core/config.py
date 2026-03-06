import os

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")

DATABASE_URL = os.getenv("DATABASE_URL")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
VERIFICATION_KEY = os.getenv("VERIFICATION_KEY")

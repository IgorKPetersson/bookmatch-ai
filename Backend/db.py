import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Read local .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

from models import Book, RecommendationList, RecommendedBook, DismissedRecommendation

Base.metadata.create_all(bind=engine)

inspector = inspect(engine)
user_columns = {column["name"] for column in inspector.get_columns("users")}
if "avatar_seed" not in user_columns:
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE users ADD COLUMN avatar_seed VARCHAR"))
if "full_name" not in user_columns:
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR"))

booklist_columns = {column["name"] for column in inspector.get_columns("booklists")}
if "is_protected" in booklist_columns:
    with engine.begin() as connection:
        connection.execute(
            text("UPDATE booklists SET is_protected = FALSE WHERE is_protected IS NULL")
        )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

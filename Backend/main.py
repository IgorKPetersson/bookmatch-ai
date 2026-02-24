from db import SessionLocal
from fastapi import Depends, FastAPI
from models import Book
from schemas import BookCreate  # importera modellen
from sqlalchemy.orm import Session

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# POST /books – lägg till bok
@app.post("/books")
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    new_book = Book(
        title=book.title,
        authors=book.authors,
        short_description=book.short_description,
        isbn=book.isbn,
        release_year=book.release_year,
        genre=book.genre,
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book


# GET /books – lista alla böcker
@app.get("/books")
def get_books(db: Session = Depends(get_db)):
    return db.query(Book).all()

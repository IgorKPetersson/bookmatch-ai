from typing import List

from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import (
    Book,
    User,
)
from schemas import (
    BookCreate,
    BookRead,
)
from security import (
    get_current_user,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/books", tags=["Books"])


# Create book
@router.post("", response_model=BookRead, status_code=201)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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


# Get all books
@router.get(
    "",
    response_model=List[BookRead],
    summary="Get all books",
    description="Returns all books stored in the BookMatch database.",
)
def get_books(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return db.query(Book).all()


# Search book
@router.get("/search")
def search_books(query: str):
    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=9"
    res = requests.get(url)
    data = res.json()

    return data


# Get book by id
@router.get("/{book_id}", response_model=BookRead)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# Update book
@router.put("/{book_id}", response_model=BookRead)
def update_book(
    book_id: int,
    updated_book: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    book.title = updated_book.title
    book.authors = updated_book.authors
    book.short_description = updated_book.short_description
    book.isbn = updated_book.isbn
    book.release_year = updated_book.release_year
    book.genre = updated_book.genre

    db.commit()
    db.refresh(book)
    return book


# Delete book
@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}


import requests

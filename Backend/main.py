from typing import List

from db import SessionLocal
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from models import Book, BookList, BookListItem, User
from schemas import (
    BookCreate,
    BookListCreate,
    BookListItemCreate,
    BookListItemRead,
    BookListRead,
    BookRead,
    RecommendationRequest,
    RecommendationResponse,
    UserCreate,
    UserRead,
)
from security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from sqlalchemy.orm import Session

app = FastAPI(
    title="BookMatch API",
    description="API for the BookMatch application. Users can search books, manage booklists and get recommendations.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Health check
@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok"}


# -------------------
# BOOK CRUD (JWT-skyddade)
# -------------------


# Create book
@app.post("/books", response_model=BookRead, status_code=201, tags=["Books"])
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
@app.get(
    "/books",
    response_model=List[BookRead],
    tags=["Books"],
    summary="Get all books",
    description="Returns all books stored in the BookMatch database.",
)
def get_books(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return db.query(Book).all()


# Get book by id
@app.get("/books/{book_id}", response_model=BookRead, tags=["Books"])
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
@app.put("/books/{book_id}", response_model=BookRead, tags=["Books"])
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
@app.delete("/books/{book_id}", tags=["Books"])
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


# -------------------
# USER AUTH
# -------------------


# Register new user
@app.post("/register", response_model=UserRead, status_code=201, tags=["Auth"])
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# Login user
@app.post("/login", tags=["Auth"])
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# -------------------
# BOOKLIST CRUD
# -------------------
@app.post(
    "/booklists", response_model=BookListRead, status_code=201, tags=["BookListItems"]
)
def create_booklist(
    booklist: BookListCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_list = BookList(
        name=booklist.name,
        user_id=current_user.id,
    )

    db.add(new_list)
    db.commit()
    db.refresh(new_list)

    return new_list


@app.get("/booklists", response_model=List[BookListRead], tags=["BookLists"])
def get_my_booklists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(BookList).filter(BookList.user_id == current_user.id).all()


@app.delete("/booklists/{booklist_id}", tags=["BookLists"])
def delete_booklist(
    booklist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booklist = (
        db.query(BookList)
        .filter(BookList.id == booklist_id, BookList.user_id == current_user.id)
        .first()
    )

    if not booklist:
        raise HTTPException(status_code=404, detail="BookList not found")

    db.delete(booklist)
    db.commit()

    return {"message": "BookList deleted"}


@app.put("/booklists/{booklist_id}", response_model=BookListRead, tags=["BookLists"])
def update_booklist(
    booklist_id: int,
    updated: BookListCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booklist = (
        db.query(BookList)
        .filter(BookList.id == booklist_id, BookList.user_id == current_user.id)
        .first()
    )

    if not booklist:
        raise HTTPException(status_code=404, detail="BookList not found")

    booklist.name = updated.name

    db.commit()
    db.refresh(booklist)

    return booklist


@app.post(
    "/booklists/{booklist_id}/books",
    response_model=BookListItemRead,
    status_code=201,
    tags=["BookListItems"],
)
def add_book_to_booklist(
    booklist_id: int,
    item: BookListItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # kontrollera att boklistan tillhör användaren
    booklist = (
        db.query(BookList)
        .filter(BookList.id == booklist_id, BookList.user_id == current_user.id)
        .first()
    )

    if not booklist:
        raise HTTPException(status_code=404, detail="BookList not found")

    new_item = BookListItem(
        booklist_id=booklist_id,
        book_id=item.book_id,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


@app.get(
    "/booklists/{booklist_id}/books",
    response_model=List[BookListItemRead],
    tags=["BookLists"],
)
def get_books_in_booklist(
    booklist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booklist = (
        db.query(BookList)
        .filter(BookList.id == booklist_id, BookList.user_id == current_user.id)
        .first()
    )

    if not booklist:
        raise HTTPException(status_code=404, detail="BookList not found")

    items = db.query(BookListItem).filter(BookListItem.booklist_id == booklist_id).all()

    return items


# -------------------
# AI RECOMMENDATIONS (Mock)
# -------------------


# Mock recommendations (no real ai yet)
@app.post(
    "/recommendations",
    response_model=RecommendationResponse,
    tags=["Recommendations"],
)
def get_recommendations(
    request: RecommendationRequest,
    current_user: User = Depends(get_current_user),
):
    favorite_books = request.favorite_books
    if len(favorite_books) < 3:
        raise HTTPException(
            status_code=400, detail="Please provide at least 3 favorite books"
        )

    recommendations = [
        {
            "title": "Hyperion",
            "author": "Dan Simmons",
            "reason": "Epic science fiction similar to books you like.",
        },
        {
            "title": "Snow Crash",
            "author": "Neal Stephenson",
            "reason": "Fast paced cyberpunk recommendation.",
        },
        {
            "title": "The Left Hand of Darkness",
            "author": "Ursula K. Le Guin",
            "reason": "Thought provoking sci-fi classic.",
        },
    ]

    return {"recommendations": recommendations}

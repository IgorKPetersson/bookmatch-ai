import json
import os
from typing import List

import requests
from anthropic import Anthropic
from db import get_db
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from models import (
    Book,
    BookList,
    BookListItem,
    RecommendationList,
    RecommendedBook,
    User,
)
from schemas import (
    BookListRead,
    RecommendationRequest,
    RecommendationRequestSubBooks,
    RecommendationResponse,
    RecommendedListRead,
    SaveBook,
    SaveBookList,
)

from security import get_current_user
from sqlalchemy.orm import Session

load_dotenv("../.env")

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

client = Anthropic()


@router.post("", response_model=RecommendationResponse)
def get_recommendations(
    request: RecommendationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite_books = request.favorite_books

    recommendations = []

    if len(favorite_books) < 1:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least 3 favorite books",
        )

    prompt = f"""I need book recommendations for someone who enjoys these books: {", ".join(favorite_books)}.
{"They prefer the genre: " + request.genre + "." if request.genre else ""}

Suggest exactly 3 books they would enjoy. Do NOT recommend any of the books they already listed.

Respond ONLY in this exact JSON format, no other text:
[
  {{
    "title": "Book Title",
    "authors": "Author Name",
    "reason": "A short sentence explaining why they'd enjoy this book"
  }}
]"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    claude_response = message.content[0].text

    claude_books = json.loads(claude_response)

    for book in claude_books:
        url = "https://www.googleapis.com/books/v1/volumes"
        params = {
            "q": book["title"] + " " + book["authors"],
            "maxResults": 1,
            "key": os.getenv("GOOGLE_API_KEY"),
        }

        try:
            res = requests.get(url, params=params, timeout=5)
        except requests.RequestException:
            continue

        data = res.json()

        if "items" not in data:
            continue

        info = data["items"][0].get("volumeInfo", {})

        recommendations.append(
            {
                "title": info.get("title", ""),
                "authors": ", ".join(info.get("authors", ["Unknown"])),
                "description": info.get("description", ""),
                "isbn": "",
                "genre": ", ".join(info.get("categories", ["Unknown"])),
                "release_date": info.get("publishedDate", ""),
                "image": info.get("imageLinks", {}).get("thumbnail", ""),
                "reason": book["reason"],
            }
        )

        # 💾 SAVE TO DB
    new_list = RecommendationList(
        user_id=current_user.id,
        input_books=",".join(request.favorite_books),
        input_genre=request.genre,
    )
    db.add(new_list)
    db.commit()
    db.refresh(new_list)

    for book in recommendations:
        new_book = RecommendedBook(
            title=book["title"],
            authors=book["authors"],
            reason=book["reason"],
            recommendation_list_id=new_list.id,
        )
        db.add(new_book)

    db.commit()
    db.refresh(new_list)

    return {"recommendations": recommendations}


@router.post("/reshuffle", response_model=RecommendationResponse)
def reshuffle_rejected_books(
    request: RecommendationRequestSubBooks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite_books = request.favorite_books
    rejected_books = request.rejected_books
    keep_books = request.keep_books

    recommendations = []

    prompt = f"""I need book recommendations for someone who enjoys these books: {", ".join(favorite_books)}.
{"They prefer the genre: " + request.genre + "." if request.genre else ""}

Suggest exactly {len(rejected_books)} books they would enjoy. Do NOT recommend any of the books they already listed or any of these books {", ".join(rejected_books)} nor any of these either {", ".join(keep_books)}.

Respond ONLY in this exact JSON format, no other text:
[
  {{
    "title": "Book Title",
    "authors": "Author Name",
    "reason": "A short sentence explaining why they'd enjoy this book"
  }}
]"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    claude_response = message.content[0].text

    claude_books = json.loads(claude_response)

    for book in claude_books:
        url = "https://www.googleapis.com/books/v1/volumes"
        params = {
            "q": book["title"] + " " + book["authors"],
            "maxResults": 1,
            "key": os.getenv("GOOGLE_API_KEY"),
        }
        try:
            res = requests.get(url, params=params, timeout=5)
        except requests.RequestException:
            continue

        data = res.json()

        if "items" not in data:
            continue

        info = data["items"][0].get("volumeInfo", {})

        recommendations.append(
            {
                "title": info.get("title", ""),
                "authors": ", ".join(info.get("authors", ["Unknown"])),
                "description": info.get("description", ""),
                "isbn": "",
                "genre": ", ".join(info.get("categories", ["Unknown"])),
                "release_date": info.get("publishedDate", ""),
                "image": info.get("imageLinks", {}).get("thumbnail", ""),
                "reason": book["reason"],
            }
        )

        # 💾 SAVE TO DB
    new_list = RecommendationList(
        user_id=current_user.id,
        input_books=",".join(request.favorite_books),
        input_genre=request.genre,
    )
    db.add(new_list)
    db.commit()
    db.refresh(new_list)

    for book in recommendations:
        new_book = RecommendedBook(
            title=book["title"],
            authors=book["authors"],
            reason=book["reason"],
            recommendation_list_id=new_list.id,
        )
        db.add(new_book)

    db.commit()
    db.refresh(new_list)

    return {"recommendations": recommendations}


@router.post("/save", response_model=BookListRead)
def save_booklist(
    request: SaveBookList,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if request.name:
        book_list = BookList(
            name=request.name,
            user_id=current_user.id,
        )
        db.add(book_list)
        db.commit()
        db.refresh(book_list)
    elif request.book_list_id:
        book_list = (
            db.query(BookList).filter(BookList.id == request.book_list_id).first()
        )
        if not book_list:
            raise HTTPException(
                status_code=404,
                detail="Book-list not found.",
            )

    else:
        raise HTTPException(
            status_code=400, detail="Please provide name or booklist_id."
        )
    books = request.books

    for book in books:
        add_book = Book(
            title=book.title,
            authors=book.authors,
            short_description=book.description,
            isbn=book.isbn,
            release_year=int(book.release_date.split("-")[0])
            if book.release_date
            else 0,
            genre=book.genre,
        )

        db.add(add_book)
        db.commit()
        db.refresh(add_book)

        add_book_list_item = BookListItem(booklist_id=book_list.id, book_id=add_book.id)

        db.add(add_book_list_item)
        db.commit()
    return book_list


@router.get("/lists", response_model=List[BookListRead])
def get_user_lists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(BookList)
        .filter(BookList.user_id == current_user.id)
        .all()
    )


@router.get("/history", response_model=List[RecommendedListRead])
def fetch_recommend_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(RecommendationList)
        .filter(RecommendationList.user_id == current_user.id)
        .all()
    )


@router.get("/search")
def search_books(query: str, start: int = 0, current_user=Depends(get_current_user)):
    if not query:
        return []

    url = "https://www.googleapis.com/books/v1/volumes"
    params = {
        "q": query,
        "maxResults": 8,
        "startIndex": start,
        "key": os.getenv("GOOGLE_API_KEY"),
    }

    res = requests.get(url, params=params)
    data = res.json()

    print("GOOGLE RESPONSE:", data)

    total = data.get("totalItems")

    # 🔥 only block if total exists AND is exceeded
    if total and start >= total:
        return []

    if "error" in data:
        return data

    if "items" not in data:
        return []

    results = []

    for item in data["items"]:
        info = item.get("volumeInfo", {})

        results.append(
            {
                "title": info.get("title"),
                "authors": ", ".join(info.get("authors", [])),
                "image": info.get("imageLinks", {}).get("thumbnail", ""),
            }
        )

    return results

import os

from dotenv import load_dotenv
from fastapi import Depends

load_dotenv("../.env")
from typing import List

import requests
from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import RecommendationList, RecommendedBook, User
from schemas import (
    RecommendationRequest,
    RecommendationResponse,
    RecommendedListRead,
)
from security import get_current_user
from sqlalchemy.orm import Session

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.post("", response_model=RecommendationResponse)
def get_recommendations(
    request: RecommendationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite_books = request.favorite_books

    if len(favorite_books) < 1:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least 3 favorite books",
        )

    # 🔥 BUILD A BETTER QUERY
    query = " ".join(favorite_books)

    if request.genre:
        query += f" subject:{request.genre}"

    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=10"

    try:
        res = requests.get(url, timeout=5)
    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Failed to fetch recommendations")

    if res.status_code != 200:
        raise HTTPException(status_code=500, detail="Google Books API error")

    data = res.json()

    recommendations = []
    seen_ids = set()

    for item in data.get("items", []):
        book_id = item.get("id")
        info = item.get("volumeInfo", {})

        if not book_id or book_id in seen_ids:
            continue

        title = info.get("title")
        authors = info.get("authors")
        categories = info.get("categories")

        # Skip low-quality / incomplete results
        title = info.get("title")
        authors = info.get("authors") or ["Unknown"]
        categories = info.get("categories") or ["Unknown"]

        if not title:
            continue

        seen_ids.add(book_id)

        recommendations.append(
            {
                "title": title,
                "authors": ", ".join(authors),
                "description": info.get("description", ""),
                "isbn": "",  # Google Books ISBN extraction can be added later
                "genre": ", ".join(categories),
                "release_date": info.get("publishedDate", ""),
                "image": info.get("imageLinks", {}).get("thumbnail", ""),
                "reason": f"Based on your interest in {', '.join(favorite_books[:2])}",
            }
        )

        # ✅ HARD LIMIT: max 3 results
        if len(recommendations) >= 3:
            break

    # If nothing found, fallback (optional but helpful UX)
    if not recommendations:
        raise HTTPException(
            status_code=404,
            detail="No good recommendations found. Try different books or genre.",
        )

    # 💾 SAVE TO DB
    new_list = RecommendationList(
        user_id=current_user.id,
        input_books=",".join(favorite_books),
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

    return {"recommendations": recommendations}


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
        "maxResults": 9,
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

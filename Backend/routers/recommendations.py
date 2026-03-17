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

    if len(favorite_books) < 3:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least 3 favorite books",
        )

    # 🔥 GOOGLE BOOKS QUERY
    query = " ".join(favorite_books)

    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=5"
    res = requests.get(url)
    data = res.json()

    recommendations = []

    for item in data.get("items", [])[:3]:
        info = item.get("volumeInfo", {})

        recommendations.append(
            {
                "title": info.get("title", "Unknown"),
                "authors": ", ".join(info.get("authors", [])),
                "description": info.get("description", ""),
                "isbn": "",
                "genre": ", ".join(info.get("categories", [])),
                "release_date": info.get("publishedDate", ""),
                "image": info.get("imageLinks", {}).get("thumbnail", ""),
                "reason": "Based on your input books",
            }
        )

    # 💾 SAVE TO DB (same as before)
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

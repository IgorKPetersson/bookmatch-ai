from typing import List

from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import (
    RecommendationList,
    RecommendedBook,
    User,
)
from schemas import (
    RecommendationRequest,
    RecommendationResponse,
    RecommendedListRead,
)
from security import (
    get_current_user,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.post(
    "",
    response_model=RecommendationResponse,
)
def get_recommendations(
    request: RecommendationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite_books = request.favorite_books
    if len(favorite_books) < 3:
        raise HTTPException(
            status_code=400, detail="Please provide at least 3 favorite books"
        )

    recommendations = [
        {
            "title": "Hyperion",
            "authors": "Dan Simmons",
            "description": "A pilgrimage to meet the mysterious Shrike on the planet Hyperion.",
            "isbn": "9780553283686",
            "genre": "Science Fiction",
            "release_date": "1989-05-26",
            "image": "/mock-covers/hyperion.jpg",
            "reason": "Epic science fiction similar to books you like.",
        },
        {
            "title": "Snow Crash",
            "authors": "Neal Stephenson",
            "description": "A hacker and pizza delivery driver uncovers a digital virus.",
            "isbn": "9780553380958",
            "genre": "Cyberpunk",
            "release_date": "1992-06-01",
            "image": "/mock-covers/snowcrash.jpg",
            "reason": "Fast paced cyberpunk recommendation.",
        },
        {
            "title": "The Left Hand of Darkness",
            "authors": "Ursula K. Le Guin",
            "description": "A diplomat travels to a planet where gender is fluid.",
            "isbn": "9780441478125",
            "genre": "Science Fiction",
            "release_date": "1969-03-01",
            "image": "/mock-covers/lefthand.jpg",
            "reason": "Thought provoking sci-fi classic.",
        },
    ]

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
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return (
        db.query(RecommendationList)
        .filter(RecommendationList.user_id == current_user.id)
        .all()
    )

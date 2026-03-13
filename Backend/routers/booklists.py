from typing import List

from db import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import (
    BookList,
    BookListItem,
    User,
)
from schemas import (
    BookListCreate,
    BookListItemCreate,
    BookListItemRead,
    BookListRead,
)
from security import (
    get_current_user,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/booklists")


@router.post("", response_model=BookListRead, status_code=201, tags=["BookListItems"])
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


@router.get("", response_model=List[BookListRead], tags=["BookLists"])
def get_my_booklists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(BookList).filter(BookList.user_id == current_user.id).all()


@router.delete("/{booklist_id}", tags=["BookLists"])
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


@router.put("/{booklist_id}", response_model=BookListRead, tags=["BookLists"])
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


@router.post(
    "/{booklist_id}/books",
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


@router.get(
    "/{booklist_id}/books",
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

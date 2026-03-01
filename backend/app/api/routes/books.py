from app.db.database import get_db
from app.models.books import Book
from app.schemas.books import BookCreate
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/")
async def get_books(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Book))
    return result.scalars().all()


@router.post("/")
async def save_book(book: BookCreate, db: AsyncSession = Depends(get_db)):
    new_book = Book(
        title=book.title,
        authors=", ".join(book.authors),
        isbn=book.isbn,
        img_url=book.img_url,
        description=book.description,
        published_date=book.published_date,
    )
    db.add(new_book)

    await db.commit()
    await db.refresh(new_book)
    return new_book


@router.delete("/{book_id}", status_code=200)
async def delete_book(book_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Book).where(Book.id == book_id))
    requested_book = result.scalar_one_or_none()
    if requested_book is None:
        raise HTTPException(404, detail="Book not found.")

    await db.delete(requested_book)
    await db.commit()
    return {"message": "Book was succesfully deleted."}

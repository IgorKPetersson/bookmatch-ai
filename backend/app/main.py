from contextlib import asynccontextmanager

from app.db.database import Base, engine
from app.models.books import Book
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)


books_db = []
book_id_counter = 1


@app.get("/books")
def get_books():
    return books_db


@app.post("/books")
def save_book():
    global book_id_counter

    book_dict = book.model_dump()
    book_dict["id"] = book_id_counter

    books_db.append(book_dict)
    book_id_counter += 1

    return book_dict


@app.delete("/books/{book_id}")
def delete_book(book_id: int):
    for book in books_db:
        if book["id"] == book_id:
            books_db.remove(book)
            return {"message": "Book is deleted."}
    return {"message": "Book does't exist."}

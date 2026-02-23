from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


@app.get("/books")
def get_books():
    return books_db


@app.get("/books")
def get_books():
    return books_db


class Book(BaseModel):
    title: str
    author: str


books_db = []
book_id_counter = 1


@app.post("/books")
def create_book(book: Book):
    global book_id_counter

    book_dict = book.dict()
    book_dict["id"] = book_id_counter

    books_db.append(book_dict)
    book_id_counter += 1

    return book_dict


@app.delete("/books/{book_id}")
def delete_book(book_id: int):
    for book in books_db:
        if book["id"] == book_id:
            books_db.remove(book)
            return {"message": "Book deleted"}

    return {"error": "Book not found"}

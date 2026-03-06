from pydantic import BaseModel


class BookCreate(BaseModel):
    title: str
    authors: str
    short_description: str
    isbn: str
    release_year: int
    genre: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Dune",
                "authors": "Frank Herbert",
                "short_description": "Epic science fiction novel about politics and power.",
                "isbn": "9780441013593",
                "release_year": 1965,
                "genre": "Science Fiction",
            }
        }
    }


class BookRead(BaseModel):
    id: int
    title: str
    authors: str
    short_description: str
    isbn: str
    release_year: int
    genre: str

    class Config:  # ← must be indented
        from_attributes = True


class UserCreate(BaseModel):
    email: str
    password: str


class UserRead(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True


class BookListCreate(BaseModel):
    name: str


class BookListRead(BaseModel):
    id: int
    name: str
    user_id: int

    class Config:
        from_attributes = True


class BookListItemCreate(BaseModel):
    book_id: int


class BookListItemRead(BaseModel):
    id: int
    book_id: int
    booklist_id: int

    class Config:
        from_attributes = True

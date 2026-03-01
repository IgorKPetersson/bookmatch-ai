from datetime import datetime

from pydantic import BaseModel


class BookCreate(BaseModel):
    title: str
    authors: list[str]
    isbn: str | None
    img_url: str | None
    description: str | None
    published_date: datetime

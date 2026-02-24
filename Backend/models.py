from db import Base
from sqlalchemy import Column, Integer, String


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    authors = Column(String, index=True)
    short_description = Column(String, index=True)
    isbn = Column(String, index=True)
    release_year = Column(Integer, index=True)
    genre = Column(String, index=True)

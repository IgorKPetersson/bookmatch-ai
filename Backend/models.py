from db import Base
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    authors = Column(String, index=True)
    short_description = Column(String, index=True)
    isbn = Column(String, index=True)
    release_year = Column(Integer, index=True)
    genre = Column(String, index=True)


from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class BookList(Base):
    __tablename__ = "booklists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", backref="booklists")


class BookListItem(Base):
    __tablename__ = "booklist_items"

    id = Column(Integer, primary_key=True, index=True)

    booklist_id = Column(Integer, ForeignKey("booklists.id"))
    book_id = Column(Integer, ForeignKey("books.id"))

    booklist = relationship("BookList", backref="items")
    book = relationship("Book")


class Preference(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    genre = Column(String)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", backref="preferences")


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    book_id = Column(Integer, ForeignKey("books.id"))

    action = Column(String)  # ex: "viewed", "liked", "added_to_list"

    user = relationship("User", backref="history")
    book = relationship("Book")

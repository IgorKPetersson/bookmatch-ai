from datetime import datetime, timezone

from app.db.database import Base
from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column()
    authors: Mapped[str] = mapped_column()
    isbn: Mapped[str | None] = mapped_column(unique=True)
    img_url: Mapped[str | None] = mapped_column()
    description: Mapped[str | None] = mapped_column()
    google_books_id: Mapped[str | None] = mapped_column(unique=True)
    published_date: Mapped[datetime] = mapped_column()
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
        default=lambda: datetime.now(timezone.utc),
    )

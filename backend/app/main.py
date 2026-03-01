from contextlib import asynccontextmanager

from app.api.routes.books import router as books_router
from app.db.database import Base, engine
from app.models.books import Book
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(books_router, prefix="/books")

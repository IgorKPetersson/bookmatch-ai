from contextlib import asynccontextmanager

from app.api.routes.auth import router as auth_router
from app.api.routes.books import router as books_router
from app.db.database import Base, engine
from app.models.books import Book
from app.models.users import User
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books_router, prefix="/books")
app.include_router(auth_router, prefix="/auth")


@app.get("/health")
async def health_check():
    return {"status": "200"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, booklists, books, recommendations
from security import (
    SECRET_KEY,
)
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI(
    title="BookMatch API",
    description="API for the BookMatch application. Users can search books, manage booklists and get recommendations.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)


# Health check
@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(booklists.router)
app.include_router(books.router)
app.include_router(recommendations.router)

from datetime import datetime, timedelta, timezone

import bcrypt
from app.core.config import JWT_ALGORITHM, VERIFICATION_KEY
from app.db.database import get_db
from app.models.users import User
from app.schemas.users import UserCreate, UserLogin
from fastapi import APIRouter, Depends, HTTPException
from jose import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.post("/register")
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email/User already exists.")

    password_hash = bcrypt.hashpw(
        user_data.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    new_user = User(email=user_data.email, password_hash=password_hash)
    db.add(new_user)
    await db.commit()

    return {"message": "User is successfully registerd."}


@router.post("/login")
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    verfied_user = result.scalar_one_or_none()

    if not verfied_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    password_check = bcrypt.checkpw(
        user_data.password.encode("utf-8"), verfied_user.password_hash.encode("utf-8")
    )

    if not password_check:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token_data = {
        "sub": verfied_user.id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    token = jwt.encode(token_data, VERIFICATION_KEY, algorithm=JWT_ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}

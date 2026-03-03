import bcrypt
from app.db.database import get_db
from app.models.users import User
from app.schemas.users import UserCreate
from fastapi import APIRouter, Depends, HTTPException
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

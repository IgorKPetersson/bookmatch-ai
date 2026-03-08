from app.core.config import JWT_ALGORITHM, VERIFICATION_KEY
from app.db.database import get_db
from app.models.users import User
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
):
    try:
        decoded_token = jwt.decode(token, VERIFICATION_KEY, algorithms=[JWT_ALGORITHM])
        user_id = decoded_token["sub"]
        user = await db.execute(select(User).where(User.id == user_id))
        full_user = user.scalar_one_or_none()

        if not full_user:
            raise HTTPException(status_code=401, detail="Verification failed.")

        return full_user
    except JWTError:
        raise HTTPException(status_code=401, detail="Verification failed.")

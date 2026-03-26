import os
import secrets
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import requests
from db import get_db
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from models import BookList, PasswordResetTokens, User
from schemas import RequestReset, ResetPassword, UserAvatarUpdate, UserCreate, UserRead
from security import (
    get_current_user,
    hash_password,
    verify_password,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

router = APIRouter(tags=["Auth"])

DEFAULT_LISTS = [
    {"name": "Want to Read", "is_protected": True},
    {"name": "Finished Books", "is_protected": True},
    {"name": "Thrillers", "is_protected": False},
    {"name": "Fantasy", "is_protected": False},
    {"name": "Science Fiction", "is_protected": False},
    {"name": "Romance", "is_protected": False},
    {"name": "Mystery", "is_protected": False},
]
GOOGLE_OAUTH_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_OAUTH_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
GOOGLE_OAUTH_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
GOOGLE_OAUTH_REDIRECT_URI = os.getenv(
    "GOOGLE_OAUTH_REDIRECT_URI", "http://localhost:8000/auth/google/callback"
)


def _oauth_error_redirect(message: str):
    return RedirectResponse(
        url=f"{FRONTEND_URL}/auth?oauth_error={message}",
        status_code=302,
    )


def _ensure_default_lists(db: Session, user_id: int):
    existing_names = {
        name
        for (name,) in db.query(BookList.name).filter(BookList.user_id == user_id).all()
    }

    created_any = False
    for item in DEFAULT_LISTS:
        if item["name"] in existing_names:
            continue

        db.add(
            BookList(
                name=item["name"],
                user_id=user_id,
                is_protected=item["is_protected"],
            )
        )
        created_any = True

    if created_any:
        db.commit()


@router.post(
    "/register",
    response_model=UserRead,
    status_code=201,
)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    _ensure_default_lists(db, new_user.id)

    return new_user


@router.post(
    "/login",
)
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter(User.email == form_data.username).first()

    print("EMAIL:", form_data.username)
    print("USER:", db_user)

    if db_user:
        print(
            "PASSWORD MATCH:",
            verify_password(form_data.password, db_user.hashed_password),
        )

    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    _ensure_default_lists(db, db_user.id)
    request.session["user_email"] = db_user.email
    return {"message": "login successful"}


@router.post(
    "/logout",
)
def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out"}


@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me/avatar", response_model=UserRead)
def update_avatar(
    payload: UserAvatarUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_user = db.query(User).filter(User.id == current_user.id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.avatar_seed = payload.avatar_seed
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/auth/google/start")
def google_login_start(request: Request):
    if not GOOGLE_OAUTH_CLIENT_ID or not GOOGLE_OAUTH_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth is not configured on the server",
        )

    state = secrets.token_urlsafe(32)
    request.session["google_oauth_state"] = state

    params = {
        "client_id": GOOGLE_OAUTH_CLIENT_ID,
        "redirect_uri": GOOGLE_OAUTH_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "online",
        "prompt": "select_account",
    }

    return RedirectResponse(
        url=f"{GOOGLE_OAUTH_AUTHORIZE_URL}?{urlencode(params)}",
        status_code=302,
    )


@router.get("/auth/google/callback")
def google_login_callback(
    request: Request,
    state: str | None = None,
    code: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
):
    if error:
        return _oauth_error_redirect("Google sign-in was cancelled")

    saved_state = request.session.pop("google_oauth_state", None)
    if not state or not saved_state or state != saved_state:
        return _oauth_error_redirect("Google sign-in could not be verified")

    if not code:
        return _oauth_error_redirect("Google did not return a login code")

    token_response = requests.post(
        GOOGLE_OAUTH_TOKEN_URL,
        data={
            "code": code,
            "client_id": GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": GOOGLE_OAUTH_CLIENT_SECRET,
            "redirect_uri": GOOGLE_OAUTH_REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        timeout=15,
    )

    if not token_response.ok:
        return _oauth_error_redirect("Google token exchange failed")

    token_payload = token_response.json()
    access_token = token_payload.get("access_token")

    if not access_token:
        return _oauth_error_redirect("Google did not return an access token")

    userinfo_response = requests.get(
        GOOGLE_OAUTH_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=15,
    )

    if not userinfo_response.ok:
        return _oauth_error_redirect("Could not read your Google profile")

    userinfo = userinfo_response.json()
    email = userinfo.get("email")
    email_verified = userinfo.get("email_verified")

    if not email or not email_verified:
        return _oauth_error_redirect("Your Google account must have a verified email")

    db_user = db.query(User).filter(User.email == email).first()
    if db_user is None:
        db_user = User(
            email=email,
            # Random local password keeps the current schema intact for OAuth users.
            hashed_password=hash_password(secrets.token_urlsafe(32)),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    _ensure_default_lists(db, db_user.id)
    request.session["user_email"] = db_user.email
    return RedirectResponse(url=f"{FRONTEND_URL}/dashboard", status_code=302)


@router.post("/auth/reset_link")
async def send_reset_link(
    data: RequestReset,
    db: Session = Depends(get_db),
):
    result = await db.execute(select(User).where(User.email == data.email))

    user = result.scalars().first()
    if user:
        token = secrets.token_urlsafe(32)
        reset_token = PasswordResetTokens(token=token, user_id=user.id)
        db.add(reset_token)
        await db.commit()
        print(f"Reset link: http://localhost:5173/reset-password?token={token}")
    return {
        "message": "If an account exists with this email, a reset link has been sent."
    }


@router.put("/auth/reset_password")
async def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    result = await db.execute(
        select(PasswordResetTokens).where(PasswordResetTokens.token == data.token)
    )

    reset_token = result.scalars().first()

    if not reset_token:
        raise HTTPException(status_code=400, detail="Token does not exist.")

    if reset_token.used:
        raise HTTPException(status_code=400, detail="This token has already been used.")

    if reset_token.created_at < datetime.now(timezone.utc) - timedelta(minutes=15):
        raise HTTPException(status_code=400, detail="This token has expired.")

    hashed_password = hash_password(data.new_password)

    result = await db.execute(select(User).where(User.id == reset_token.user_id))

    user = result.scalars().first()

    user.hashed_password = hashed_password

    reset_token.used = True

    await db.commit()

    return {"message": "Password reset was successful."}

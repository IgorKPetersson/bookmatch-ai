from db import get_db
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from models import (
    BookList,
    User,
)
from schemas import (
    UserCreate,
    UserRead,
)
from security import (
    hash_password,
    verify_password,
)
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

    for item in DEFAULT_LISTS:
        new_list = BookList(
            name=item["name"],
            user_id=new_user.id,
            is_protected=item["is_protected"],
        )
        db.add(new_list)
    db.commit()

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

    request.session["user_email"] = db_user.email
    return {"message": "login successful"}


@router.post(
    "/logout",
)
def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out"}

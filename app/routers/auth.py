from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.dependencies import get_db, get_current_user, log_activity
from app.models.user import UserCreate, Token, UserResponse
from app.services.user_service import UserService
from app.auth.jwt import verify_password, get_password_hash, create_access_token
from app.database import User as DBUser


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)

    existing_user = user_service.get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    hashed_password = get_password_hash(user.password)
    new_user = user_service.create_user(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role="user",
    )
    log_activity(db, new_user, action="register", resource_type="user", resource_id=new_user.id)
    return new_user


@router.post("/login", response_model=Token)
def login(username: str, password: str, db: Session = Depends(get_db)):
    service = UserService(db)

    user = service.get_user_by_username(username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    log_activity(db, user, action="login", resource_type="user", resource_id=user.id)

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
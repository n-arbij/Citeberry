from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.dependencies import get_db
from app.models.user import UserCreate, Token, UserResponse
from app.services.user_service import UserService
from app.services.organization_service import OrganizationService
from app.auth.jwt import verify_password, get_password_hash, create_access_token, decode_access_token


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    org_service = OrganizationService(db)

    existing_user = user_service.get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # determine organization id
    org_id: int | None = None
    if user.organization_id is not None:
        org = org_service.get_organization(user.organization_id)
        if not org:
            raise HTTPException(status_code=400, detail="Organization not found")
        org_id = org.id
    elif user.organization_short_id is not None:
        org = org_service.get_by_short_id(user.organization_short_id)
        if not org:
            raise HTTPException(status_code=400, detail="Organization not found")
        org_id = org.id
    elif user.organization_name:
        org = org_service.get_by_name(user.organization_name)
        if not org:
            org = org_service.create_organization(user.organization_name)
        org_id = org.id

    hashed_password = get_password_hash(user.password)
    return user_service.create_user(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        organization_id=org_id,
    )


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
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
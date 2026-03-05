from pydantic import BaseModel, field_validator
from typing import Optional
from app.models.organization import OrganizationResponse


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str = "user"
    is_locked: bool = False
    organization_id: Optional[int] = None
    organization: Optional[OrganizationResponse] = None

    class Config:
        from_attributes = True


class User(UserResponse):
    pass


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v


class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None
    organization_id: int | None = None

    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
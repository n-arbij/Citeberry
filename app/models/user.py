from pydantic import BaseModel, field_validator
from typing import Optional
from app.models.organization import OrganizationResponse


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    organization: Optional[OrganizationResponse] = None

    class Config:
        orm_mode = True


class User(UserResponse):
    pass


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    # when registering, either supply an existing organization ID, short_id, or a new name
    organization_id: int | None = None
    organization_short_id: str | None = None
    organization_name: str | None = None

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

    @field_validator('organization_name')
    @classmethod
    def check_org_fields(cls, v, values):
        # if org by id/short_id not provided, organization_name must be
        if values.get('organization_id') is None and not values.get('organization_short_id') and not v:
            raise ValueError('organization_id, organization_short_id or organization_name required')
        return v


class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None
    organization_id: int | None = None

    class Config:
        orm_mode = True


class UserInDB(UserResponse):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
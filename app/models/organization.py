from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class OrganizationBase(BaseModel):
    name: str
    address: Optional[str] = None
    email: Optional[str] = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationResponse(OrganizationBase):
    id: str = Field(..., alias="short_id")
    address: Optional[str] = None
    email: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True
        allow_population_by_field_name = True


class JoinRequestResponse(BaseModel):
    id: int
    user_id: int
    organization_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

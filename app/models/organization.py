from pydantic import BaseModel, Field
from typing import Optional


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

    class Config:
        from_attributes = True
        allow_population_by_field_name = True

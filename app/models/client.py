from pydantic import BaseModel
from typing import Optional
from app.models.organization import OrganizationResponse

class Client(BaseModel):
    id: int
    client_name: str
    enterprise_name: str | None = None
    email: str
    phone: str | None = None
    organization: Optional[OrganizationResponse] = None

    class Config:
        from_attributes = True

class ClientCreate(BaseModel):
    client_name: str
    enterprise_name: str | None = None
    email: str
    phone: str | None = None
    organization_id: int | None = None
    organization_short_id: str | None = None
    organization_name: str | None = None

class ClientUpdate(BaseModel):
    client_name: str | None = None
    enterprise_name: str | None = None
    email: str | None = None
    phone: str | None = None
    organization_id: int | None = None
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Quote(BaseModel):
    id: int
    client_id: int
    client_name: Optional[str] = None
    title: str
    description: str | None = None
    amount: float
    created_at: datetime
    updated_at: datetime
    status: str

    class Config:
        from_attributes = True


class QuoteCreate(BaseModel):
    client_id: int
    title: str
    description: str | None = None
    amount: float
    status: str | None = None


class QuoteUpdate(BaseModel):
    client_id: int | None = None
    title: str | None = None
    description: str | None = None
    amount: float | None = None
    status: str | None = None

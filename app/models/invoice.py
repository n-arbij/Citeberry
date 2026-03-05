from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Invoice(BaseModel):
    id: int
    organization_id: Optional[int] = None
    title: str
    description: str
    amount: float
    status: str = 'unpaid'
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InvoiceCreate(BaseModel):
    title: str
    description: str
    amount: float
    status: str = 'unpaid'

class InvoiceUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    amount: float | None = None
    status: str | None = None
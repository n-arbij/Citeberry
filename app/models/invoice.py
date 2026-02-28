from pydantic import BaseModel

class Invoice(BaseModel):
    id: int
    title: str
    description: str
    amount: float
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True

class InvoiceCreate(BaseModel):
    title: str
    description: str
    amount: float


class InvoiceUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    amount: float | None = None
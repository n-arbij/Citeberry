from pydantic import BaseModel


class Quote(BaseModel):
    id: int
    client_id: int
    title: str
    description: str | None = None
    amount: float
    created_at: str
    updated_at: str
    status: str

    class Config:
        orm_mode = True


class QuoteCreate(BaseModel):
    client_id: int
    title: str
    description: str | None = None
    amount: float


class QuoteUpdate(BaseModel):
    client_id: int | None = None
    title: str | None = None
    description: str | None = None
    amount: float | None = None
    status: str | None = None

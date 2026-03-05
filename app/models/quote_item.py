from pydantic import BaseModel

class QuoteItem(BaseModel):
    id: int
    quote_id: int
    description: str
    quantity: int
    unit_price: float
    sub_total: float

    class Config:
        from_attributes = True

class QuoteItemCreate(QuoteItem):
    quote_id: int
    description: str
    quantity: int
    unit_price: float

class QuoteItemUpdate(QuoteItem):
    quote_id: int | None = None
    description: str | None = None
    quantity: int | None = None
    unit_price: float | None = None
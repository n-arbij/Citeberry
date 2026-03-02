from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.quote_service import QuoteService
from app.models.quote import Quote, QuoteCreate, QuoteUpdate

router = APIRouter(prefix="/quotes", tags=["Quotes"])

@router.post("/", response_model=Quote)
def create_quote(payload: QuoteCreate, db: Session = Depends(get_db)):
    service = QuoteService(db)
    return service.create_quote(
        client_id=payload.client_id,
        title=payload.title,
        description=payload.description,
        amount=payload.amount,
    )

@router.get("/", response_model=list[Quote])
def list_quotes(db: Session = Depends(get_db)):
    service = QuoteService(db)
    return service.get_all_quotes()

@router.get("/{quote_id}", response_model=Quote)
def get_quote(quote_id: int, db: Session = Depends(get_db)):
    service = QuoteService(db)
    quote = service.get_quote(quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote

@router.get("/client/{client_id}", response_model=list[Quote])
def quotes_by_client(client_id: int, db: Session = Depends(get_db)):
    service = QuoteService(db)
    return service.get_quotes_for_client(client_id)

@router.put("/{quote_id}", response_model=Quote)
def update_quote(quote_id: int, payload: QuoteUpdate, db: Session = Depends(get_db)):
    service = QuoteService(db)
    quote = service.update_quote(
        quote_id,
        client_id=payload.client_id,
        title=payload.title,
        description=payload.description,
        amount=payload.amount,
        status=payload.status,
    )
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote

@router.delete("/{quote_id}")
def delete_quote(quote_id: int, db: Session = Depends(get_db)):
    service = QuoteService(db)
    success = service.delete_quote(quote_id)
    if not success:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"ok": True}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.quote_item_service import QuoteItemService
from app.models.quote_item import QuoteItem, QuoteItemCreate, QuoteItemUpdate

router = APIRouter(prefix="/quote-items", tags=["QuoteItems"])

@router.post("/", response_model=QuoteItem)
def create_item(payload: QuoteItemCreate, db: Session = Depends(get_db)):
    service = QuoteItemService(db)
    return service.create_quote_item(
        quote_id=payload.quote_id,
        description=payload.description,
        quantity=payload.quantity,
        unit_price=payload.unit_price,
    )

@router.get("/", response_model=list[QuoteItem])
def list_items(db: Session = Depends(get_db)):
    service = QuoteItemService(db)
    return service.get_all_items()

@router.get("/{item_id}", response_model=QuoteItem)
def get_item(item_id: int, db: Session = Depends(get_db)):
    service = QuoteItemService(db)
    item = service.get_quote_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Quote item not found")
    return item

@router.get("/quote/{quote_id}", response_model=list[QuoteItem])
def items_by_quote(quote_id: int, db: Session = Depends(get_db)):
    service = QuoteItemService(db)
    return service.get_items_for_quote(quote_id)

@router.put("/{item_id}", response_model=QuoteItem)
def update_item(item_id: int, payload: QuoteItemUpdate, db: Session = Depends(get_db)):
    service = QuoteItemService(db)
    item = service.update_quote_item(
        item_id,
        description=payload.description,
        quantity=payload.quantity,
        unit_price=payload.unit_price,
    )
    if not item:
        raise HTTPException(status_code=404, detail="Quote item not found")
    return item

@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    service = QuoteItemService(db)
    success = service.delete_quote_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Quote item not found")
    return {"ok": True}

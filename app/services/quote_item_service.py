from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import QuoteItem as DBQuoteItem


class QuoteItemService:
    def __init__(self, db: Session):
        self.db = db

    def create_quote_item(self, quote_id: int, description: str, quantity: int, unit_price: float) -> DBQuoteItem:
        sub_total = quantity * unit_price
        new_item = DBQuoteItem(quote_id=quote_id, description=description, quantity=quantity, unit_price=unit_price, sub_total=sub_total)
        self.db.add(new_item)
        self.db.commit()
        self.db.refresh(new_item)
        return new_item

    def get_quote_item(self, item_id: int) -> DBQuoteItem | None:
        return self.db.get(DBQuoteItem, item_id)

    def get_items_for_quote(self, quote_id: int) -> list[DBQuoteItem]:
        result = self.db.execute(select(DBQuoteItem).where(DBQuoteItem.quote_id == quote_id))
        return result.scalars().all()

    def update_quote_item(self, item_id: int, description: str | None = None, quantity: int | None = None, unit_price: float | None = None) -> DBQuoteItem | None:
        item = self.get_quote_item(item_id)
        if not item:
            return None
        if description is not None:
            item.description = description
        if quantity is not None:
            item.quantity = quantity
        if unit_price is not None:
            item.unit_price = unit_price
        if quantity is not None or unit_price is not None:
            item.sub_total = (item.quantity or 0) * (item.unit_price or 0)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete_quote_item(self, item_id: int) -> bool:
        item = self.get_quote_item(item_id)
        if not item:
            return False
        self.db.delete(item)
        self.db.commit()
        return True


__all__ = ["QuoteItemService"]

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import Quote as DBQuote


class QuoteService:
    def __init__(self, db: Session):
        self.db = db

    def create_quote(self, client_id: int, title: str, description: str | None, amount: float, status: str | None = None) -> DBQuote:
        new_quote = DBQuote(client_id=client_id, title=title, description=description, amount=amount, status=status)
        self.db.add(new_quote)
        self.db.commit()
        self.db.refresh(new_quote)
        return new_quote

    def get_quote(self, quote_id: int) -> DBQuote | None:
        return self.db.get(DBQuote, quote_id)

    def get_all_quotes(self) -> list[DBQuote]:
        result = self.db.execute(select(DBQuote))
        return result.scalars().all()

    def get_quotes_for_client(self, client_id: int) -> list[DBQuote]:
        result = self.db.execute(select(DBQuote).where(DBQuote.client_id == client_id))
        return result.scalars().all()

    def update_quote(self, quote_id: int, client_id: int | None = None, title: str | None = None, description: str | None = None, amount: float | None = None, status: str | None = None) -> DBQuote | None:
        quote = self.get_quote(quote_id)
        if not quote:
            return None
        if client_id is not None:
            quote.client_id = client_id
        if title is not None:
            quote.title = title
        if description is not None:
            quote.description = description
        if amount is not None:
            quote.amount = amount
        if status is not None:
            quote.status = status
        self.db.commit()
        self.db.refresh(quote)
        return quote

    def delete_quote(self, quote_id: int) -> bool:
        quote = self.get_quote(quote_id)
        if not quote:
            return False
        self.db.delete(quote)
        self.db.commit()
        return True


__all__ = ["QuoteService"]

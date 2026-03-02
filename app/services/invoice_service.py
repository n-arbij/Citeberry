from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import Invoice as DBInvoice


class InvoiceService:
    def __init__(self, db: Session):
        self.db = db

    def create_invoice(self, title: str, description: str, amount: float, created_at=None, updated_at=None) -> DBInvoice:
        new_invoice = DBInvoice(title=title, description=description, amount=amount, created_at=created_at, updated_at=updated_at)
        self.db.add(new_invoice)
        self.db.commit()
        self.db.refresh(new_invoice)
        return new_invoice

    def get_invoice(self, invoice_id: int) -> DBInvoice | None:
        return self.db.get(DBInvoice, invoice_id)

    def get_all_invoices(self) -> list[DBInvoice]:
        result = self.db.execute(select(DBInvoice))
        return result.scalars().all()

    def update_invoice(self, invoice_id: int, title: str | None = None, description: str | None = None, amount: float | None = None, updated_at=None) -> DBInvoice | None:
        invoice = self.get_invoice(invoice_id)
        if not invoice:
            return None
        if title is not None:
            invoice.title = title
        if description is not None:
            invoice.description = description
        if amount is not None:
            invoice.amount = amount
        if updated_at is not None:
            invoice.updated_at = updated_at
        self.db.commit()
        self.db.refresh(invoice)
        return invoice

    def delete_invoice(self, invoice_id: int) -> bool:
        invoice = self.get_invoice(invoice_id)
        if not invoice:
            return False
        self.db.delete(invoice)
        self.db.commit()
        return True


__all__ = ["InvoiceService"]

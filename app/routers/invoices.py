from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, log_activity
from app.database import User as DBUser
from app.services.invoice_service import InvoiceService
from app.models.invoice import Invoice, InvoiceCreate, InvoiceUpdate

router = APIRouter(prefix="/invoices", tags=["Invoices"])

@router.post("/", response_model=Invoice)
def create_invoice(
    payload: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = InvoiceService(db)
    invoice = service.create_invoice(
        title=payload.title,
        description=payload.description,
        amount=payload.amount,
        organization_id=current_user.organization_id,
    )
    log_activity(db, current_user, action="create", resource_type="invoice", resource_id=invoice.id)
    return invoice

@router.get("/", response_model=list[Invoice])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = InvoiceService(db)
    if current_user.organization_id:
        return service.get_invoices_by_org(current_user.organization_id)
    return []

@router.get("/{invoice_id}", response_model=Invoice)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    service = InvoiceService(db)
    invoice = service.get_invoice(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.put("/{invoice_id}", response_model=Invoice)
def update_invoice(
    invoice_id: int,
    payload: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = InvoiceService(db)
    invoice = service.update_invoice(
        invoice_id,
        title=payload.title,
        description=payload.description,
        amount=payload.amount,
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    log_activity(db, current_user, action="update", resource_type="invoice", resource_id=invoice_id)
    return invoice

@router.delete("/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = InvoiceService(db)
    success = service.delete_invoice(invoice_id)
    if not success:
        raise HTTPException(status_code=404, detail="Invoice not found")
    log_activity(db, current_user, action="delete", resource_type="invoice", resource_id=invoice_id)
    return {"ok": True}
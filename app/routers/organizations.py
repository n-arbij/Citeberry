from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.services.organization_service import OrganizationService
from app.models.organization import (
    OrganizationCreate,
    OrganizationResponse,
)

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("/", response_model=OrganizationResponse)
def create_organization(
    payload: OrganizationCreate, db: Session = Depends(get_db)
):
    service = OrganizationService(db)
    existing = service.get_by_name(payload.name)
    if existing:
        raise HTTPException(status_code=400, detail="Organization already exists")
    return service.create_organization(payload.name, address=payload.address, email=payload.email)


@router.get("/", response_model=list[OrganizationResponse])
def list_organizations(db: Session = Depends(get_db)):
    service = OrganizationService(db)
    return service.get_all_organizations()


@router.get("/{org_id}", response_model=OrganizationResponse)
def get_organization(org_id: int, db: Session = Depends(get_db)):
    service = OrganizationService(db)
    org = service.get_organization(org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


@router.put("/{org_id}", response_model=OrganizationResponse)
def update_organization(org_id: int, payload: OrganizationCreate, db: Session = Depends(get_db)):
    service = OrganizationService(db)
    org = service.update_organization(org_id, name=payload.name, address=payload.address, email=payload.email)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org


@router.delete("/{org_id}")
def delete_organization(org_id: int, db: Session = Depends(get_db)):
    service = OrganizationService(db)
    success = service.delete_organization(org_id)
    if not success:
        raise HTTPException(status_code=404, detail="Organization not found")
    return {"ok": True}

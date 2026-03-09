from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin, log_activity
from app.services.organization_service import OrganizationService
from app.services.notification_service import NotificationService
from app.models.organization import (
    OrganizationCreate,
    OrganizationResponse,
    JoinRequestResponse,
)
from app.database import User as DBUser

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("/", response_model=OrganizationResponse, status_code=201)
def create_organization(
    payload: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = OrganizationService(db)
    existing = service.get_by_name(payload.name)
    if existing:
        raise HTTPException(status_code=400, detail="Organization already exists")
    org = service.create_organization(payload.name, address=payload.address, email=payload.email)
    # make the creator an admin of the new organization
    current_user.role = "admin"
    current_user.organization_id = org.id
    db.commit()
    log_activity(db, current_user, action="create", resource_type="organization", resource_id=org.id)
    return org


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


@router.put("/{org_id}/deactivate", response_model=OrganizationResponse)
def deactivate_organization(
    org_id: int,
    db: Session = Depends(get_db),
    admin: DBUser = Depends(require_admin),
):
    if admin.organization_id != org_id:
        raise HTTPException(status_code=403, detail="You can only deactivate your own organization")
    service = OrganizationService(db)
    org = service.deactivate_organization(org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    log_activity(db, admin, action="deactivate", resource_type="organization", resource_id=org_id)
    return org


# --- Join request endpoints ---

@router.post("/{org_short_id}/join-requests", response_model=JoinRequestResponse, status_code=201)
def request_to_join(
    org_short_id: str,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = OrganizationService(db)
    org = service.get_by_short_id(org_short_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    # prevent duplicate pending requests
    existing = [r for r in service.list_join_requests(org.id, status="pending") if r.user_id == current_user.id]
    if existing:
        raise HTTPException(status_code=400, detail="A pending join request already exists")
    return service.create_join_request(user_id=current_user.id, org_id=org.id)


@router.get("/{org_short_id}/join-requests", response_model=list[JoinRequestResponse])
def list_join_requests(
    org_short_id: str,
    status: str | None = None,
    db: Session = Depends(get_db),
    admin: DBUser = Depends(require_admin),
):
    service = OrganizationService(db)
    org = service.get_by_short_id(org_short_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    if admin.organization_id != org.id:
        raise HTTPException(status_code=403, detail="You are not an admin of this organization")
    return service.list_join_requests(org.id, status=status)


@router.post("/{org_short_id}/join-requests/{request_id}/accept", response_model=JoinRequestResponse)
def accept_join_request(
    org_short_id: str,
    request_id: int,
    db: Session = Depends(get_db),
    admin: DBUser = Depends(require_admin),
):
    service = OrganizationService(db)
    org = service.get_by_short_id(org_short_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    if admin.organization_id != org.id:
        raise HTTPException(status_code=403, detail="You are not an admin of this organization")
    req = service.accept_join_request(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Join request not found or already processed")
    log_activity(db, admin, action="accept_join_request", resource_type="org_join_request", resource_id=request_id, details=f"user_id={req.user_id}")
    NotificationService(db).create_notification(
        user_id=req.user_id,
        organization_id=org.id,
        title="Join request accepted",
        message=f"Your request to join {org.name} has been accepted. Welcome!",
    )
    return req


@router.post("/{org_short_id}/join-requests/{request_id}/reject", response_model=JoinRequestResponse)
def reject_join_request(
    org_short_id: str,
    request_id: int,
    db: Session = Depends(get_db),
    admin: DBUser = Depends(require_admin),
):
    service = OrganizationService(db)
    org = service.get_by_short_id(org_short_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    if admin.organization_id != org.id:
        raise HTTPException(status_code=403, detail="You are not an admin of this organization")
    req = service.reject_join_request(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Join request not found or already processed")
    log_activity(db, admin, action="reject_join_request", resource_type="org_join_request", resource_id=request_id, details=f"user_id={req.user_id}")
    NotificationService(db).create_notification(
        user_id=req.user_id,
        title="Join request declined",
        message=f"Your request to join {org.name} has been declined.",
    )
    return req

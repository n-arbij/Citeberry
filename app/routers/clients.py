from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, log_activity
from app.database import User as DBUser
from app.services.client_service import ClientService
from app.services.organization_service import OrganizationService
from app.models.client import Client, ClientCreate, ClientUpdate

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.post("/", response_model=Client)
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = ClientService(db)
    org_service = OrganizationService(db)
    
    # resolve organization — fall back to current user's org
    org_id: int | None = current_user.organization_id
    if client.organization_id is not None:
        org = org_service.get_organization(client.organization_id)
        if not org:
            raise HTTPException(status_code=400, detail="Organization not found")
        org_id = org.id
    elif client.organization_short_id is not None:
        org = org_service.get_by_short_id(client.organization_short_id)
        if not org:
            raise HTTPException(status_code=400, detail="Organization not found")
        org_id = org.id
    elif client.organization_name:
        org = org_service.get_by_name(client.organization_name)
        if not org:
            org = org_service.create_organization(client.organization_name)
        org_id = org.id
    
    new_client = service.create_client(
        client_name=client.client_name,
        enterprise_name=client.enterprise_name,
        email=client.email,
        phone=client.phone,
        organization_id=org_id,
    )
    log_activity(db, current_user, action="create", resource_type="client", resource_id=new_client.id)
    return new_client

@router.get("/", response_model=list[Client])
def list_clients(db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_user)):
    service = ClientService(db)
    if current_user.organization_id:
        return service.get_clients_by_org(current_user.organization_id)
    return service.get_all_clients()

@router.get("/{client_id}", response_model=Client)
def get_client(client_id: int, db: Session = Depends(get_db)):
    service = ClientService(db)
    client = service.get_client(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.put("/{client_id}", response_model=Client)
def update_client(
    client_id: int,
    payload: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = ClientService(db)
    client = service.update_client(
        client_id,
        client_name=payload.client_name,
        enterprise_name=payload.enterprise_name,
        email=payload.email,
        phone=payload.phone,
        organization_id=payload.organization_id,
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    log_activity(db, current_user, action="update", resource_type="client", resource_id=client_id)
    return client

@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = ClientService(db)
    success = service.delete_client(client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")
    log_activity(db, current_user, action="delete", resource_type="client", resource_id=client_id)
    return {"ok": True}

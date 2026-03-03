from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.client_service import ClientService
from app.services.organization_service import OrganizationService
from app.models.client import Client, ClientCreate, ClientUpdate

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.post("/", response_model=Client)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    service = ClientService(db)
    org_service = OrganizationService(db)
    
    # resolve organization
    org_id: int | None = None
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
    
    return service.create_client(
        client_name=client.client_name,
        enterprise_name=client.enterprise_name,
        email=client.email,
        phone=client.phone,
        organization_id=org_id,
    )

@router.get("/", response_model=list[Client])
def list_clients(db: Session = Depends(get_db)):
    service = ClientService(db)
    return service.get_all_clients()

@router.get("/{client_id}", response_model=Client)
def get_client(client_id: int, db: Session = Depends(get_db)):
    service = ClientService(db)
    client = service.get_client(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.put("/{client_id}", response_model=Client)
def update_client(client_id: int, payload: ClientUpdate, db: Session = Depends(get_db)):
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
    return client

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    service = ClientService(db)
    success = service.delete_client(client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"ok": True}

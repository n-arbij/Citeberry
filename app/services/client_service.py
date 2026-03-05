from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import Client as DBClient


class ClientService:
    def __init__(self, db: Session):
        self.db = db

    def create_client(self, client_name: str, enterprise_name: str | None, email: str, phone: str | None, organization_id: int | None = None) -> DBClient:
        new_client = DBClient(
            client_name=client_name,
            enterprise_name=enterprise_name,
            email=email,
            phone=phone,
            organization_id=organization_id,
        )
        self.db.add(new_client)
        self.db.commit()
        self.db.refresh(new_client)
        return new_client

    def get_client(self, client_id: int) -> DBClient | None:
        return self.db.get(DBClient, client_id)

    def get_all_clients(self) -> list[DBClient]:
        result = self.db.execute(select(DBClient))
        return result.scalars().all()

    def get_clients_by_org(self, organization_id: int) -> list[DBClient]:
        result = self.db.execute(select(DBClient).where(DBClient.organization_id == organization_id))
        return result.scalars().all()

    def update_client(self, client_id: int, client_name: str | None = None, enterprise_name: str | None = None, email: str | None = None, phone: str | None = None, organization_id: int | None = None) -> DBClient | None:
        client = self.get_client(client_id)
        if not client:
            return None
        if client_name is not None:
            client.client_name = client_name
        if enterprise_name is not None:
            client.enterprise_name = enterprise_name
        if email is not None:
            client.email = email
        if phone is not None:
            client.phone = phone
        if organization_id is not None:
            client.organization_id = organization_id
        self.db.commit()
        self.db.refresh(client)
        return client

    def delete_client(self, client_id: int) -> bool:
        client = self.get_client(client_id)
        if not client:
            return False
        self.db.delete(client)
        self.db.commit()
        return True


__all__ = ["ClientService"]
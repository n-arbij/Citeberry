from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.models import Client


class ClientService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_client(self, client_name: str, enterprise_name: str, email: str, phone: str) -> Client:
        new_client = Client(
            client_name=client_name,
            enterprise_name=enterprise_name,
            email=email,
            phone=phone
        )
        self.db.add(new_client)
        await self.db.commit()
        await self.db.refresh(new_client)
        return new_client
    
    async def get_client(self, client_id: int) -> Client:
        return await self.db.get(Client, client_id)
    
    async def get_all_clients(self) -> list[Client]:
        result = await self.db.execute(select(Client))
        return result.scalars().all()
    
    async def update_client(self, client_id: int, client_name: str = None, enterprise_name: str = None, email: str = None, phone: str = None) -> Client:
        client = await self.get_client(client_id)
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
        await self.db.commit()
        await self.db.refresh(client)
        return client
    
    async def delete_client(self, client_id: int) -> bool:
        client = await self.get_client(client_id)
        if not client:
            return False
        await self.db.delete(client)
        await self.db.commit()
        return True
    

__all__ = ["ClientService"]
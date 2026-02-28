from pydantic import BaseModel

class Client(BaseModel):
    id: int
    client_name: str
    enterprise_name: str | None = None
    email: str
    phone: str | None = None

    class Config:
        orm_mode = True

class ClientCreate(Client):
    client_name: str
    enterprise_name: str | None = None
    email: str
    phone: str | None = None

class ClientUpdate(Client):
    client_name: str | None = None
    enterprise_name: str | None = None
    email: str | None = None
    phone: str | None = None
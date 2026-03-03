from pydantic import BaseModel

class User(BaseModel):
    id: int
    username: str
    email: str
    hashed_password: str

    class Config:
        orm_mode = True


class UserCreate(User):
    username: str
    email: str
    password: str


class UserUpdate(User):
    username: str | None = None
    email: str | None = None
    password: str | None = None


class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
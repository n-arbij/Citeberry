from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Notification(BaseModel):
    id: int
    user_id: int
    organization_id: Optional[int] = None
    message: str
    created_at: datetime

    class Config:
        orm_mode = True

class NotificationCreate(BaseModel):
    user_id: int
    message: str

class NotificationUpdate(BaseModel):
    user_id: int | None = None
    message: str | None = None
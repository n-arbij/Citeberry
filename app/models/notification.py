from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Notification(BaseModel):
    id: int
    user_id: int
    organization_id: Optional[int] = None
    title: Optional[str] = None
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    user_id: int
    title: Optional[str] = None
    message: str

class NotificationUpdate(BaseModel):
    title: str | None = None
    message: str | None = None
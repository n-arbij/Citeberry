from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import Notification as DBNotification
from datetime import datetime, timezone


class NotificationService:
    def __init__(self, db: Session):
        self.db = db

    def create_notification(self, user_id: int, message: str, title: str | None = None, organization_id: int | None = None, created_at=None) -> DBNotification:
        new_notification = DBNotification(
            user_id=user_id,
            title=title,
            message=message,
            organization_id=organization_id,
            created_at=created_at or datetime.now(timezone.utc),
        )
        self.db.add(new_notification)
        self.db.commit()
        self.db.refresh(new_notification)
        return new_notification

    def get_notification(self, notification_id: int) -> DBNotification | None:
        return self.db.get(DBNotification, notification_id)

    def get_all_notifications(self) -> list[DBNotification]:
        result = self.db.execute(select(DBNotification))
        return result.scalars().all()

    def get_notifications_by_org(self, organization_id: int) -> list[DBNotification]:
        result = self.db.execute(
            select(DBNotification).where(DBNotification.organization_id == organization_id)
        )
        return result.scalars().all()

    def get_notifications_for_user(self, user_id: int) -> list[DBNotification]:
        result = self.db.execute(select(DBNotification).where(DBNotification.user_id == user_id))
        return result.scalars().all()

    def update_notification(self, notification_id: int, message: str | None = None) -> DBNotification | None:
        n = self.get_notification(notification_id)
        if not n:
            return None
        if message is not None:
            n.message = message
        self.db.commit()
        self.db.refresh(n)
        return n

    def delete_notification(self, notification_id: int) -> bool:
        n = self.get_notification(notification_id)
        if not n:
            return False
        self.db.delete(n)
        self.db.commit()
        return True


__all__ = ["NotificationService"]

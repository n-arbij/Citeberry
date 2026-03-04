from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import ActivityLog as DBActivityLog
from datetime import datetime, timezone


class ActivityLogService:
    def __init__(self, db: Session):
        self.db = db

    def log(
        self,
        user_id: int,
        action: str,
        organization_id: int | None = None,
        resource_type: str | None = None,
        resource_id: int | None = None,
        details: str | None = None,
    ) -> DBActivityLog:
        entry = DBActivityLog(
            user_id=user_id,
            organization_id=organization_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            created_at=datetime.now(timezone.utc),
        )
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def get_by_org(self, organization_id: int) -> list[DBActivityLog]:
        result = self.db.execute(
            select(DBActivityLog)
            .where(DBActivityLog.organization_id == organization_id)
            .order_by(DBActivityLog.created_at.desc())
        )
        return result.scalars().all()


__all__ = ["ActivityLogService"]

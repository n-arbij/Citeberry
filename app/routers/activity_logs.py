from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin
from app.database import User as DBUser
from app.services.activity_log_service import ActivityLogService
from app.models.activity_log import ActivityLogResponse

router = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])


@router.get("/", response_model=list[ActivityLogResponse])
def list_activity_logs(
    db: Session = Depends(get_db),
    admin: DBUser = Depends(require_admin),
):
    if not admin.organization_id:
        raise HTTPException(status_code=400, detail="Admin is not assigned to an organization")
    service = ActivityLogService(db)
    return service.get_by_org(admin.organization_id)

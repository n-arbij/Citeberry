from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.database import User as DBUser
from app.services.notification_service import NotificationService
from app.models.notification import Notification, NotificationCreate, NotificationUpdate

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.post("/", response_model=Notification)
def create_notification(
    payload: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = NotificationService(db)
    return service.create_notification(
        user_id=payload.user_id,
        title=payload.title,
        message=payload.message,
        organization_id=current_user.organization_id,
    )

@router.get("/", response_model=list[Notification])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    service = NotificationService(db)
    if current_user.organization_id:
        return service.get_notifications_by_org(current_user.organization_id)
    return service.get_notifications_for_user(current_user.id)

@router.get("/{notification_id}", response_model=Notification)
def get_notification(notification_id: int, db: Session = Depends(get_db)):
    service = NotificationService(db)
    note = service.get_notification(notification_id)
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")
    return note

@router.put("/{notification_id}", response_model=Notification)
def update_notification(notification_id: int, payload: NotificationUpdate, db: Session = Depends(get_db)):
    service = NotificationService(db)
    note = service.update_notification(
        notification_id,
        message=payload.message,
    )
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")
    return note

@router.put("/{notification_id}/read", response_model=Notification)
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    service = NotificationService(db)
    note = service.mark_read(notification_id)
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")
    return note


@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    service = NotificationService(db)
    success = service.delete_notification(notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"ok": True}
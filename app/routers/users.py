from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin, log_activity
from app.services.user_service import UserService
from app.models.user import User, UserCreate, UserUpdate, UserResponse
from app.database import User as DBUser

router = APIRouter(prefix="/users", tags=["Users"])


class RolePayload(BaseModel):
    role: str  # "user" | "admin"


class LockPayload(BaseModel):
    is_locked: bool


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    # organization handling same as auth.register
    org_id: int | None = None
    if user.organization_id is not None:
        org_id = user.organization_id
    elif user.organization_short_id is not None:
        from app.services.organization_service import OrganizationService
        org_service = OrganizationService(db)
        org = org_service.get_by_short_id(user.organization_short_id)
        if not org:
            raise HTTPException(status_code=400, detail="Organization not found")
        org_id = org.id
    elif user.organization_name:
        # create if needed
        from app.services.organization_service import OrganizationService
        org_service = OrganizationService(db)
        org = org_service.get_by_name(user.organization_name)
        if not org:
            org = org_service.create_organization(user.organization_name)
        org_id = org.id
    return service.create_user(
        username=user.username,
        email=user.email,
        hashed_password=user.password,
        organization_id=org_id,
    )


@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_user)):
    service = UserService(db)
    if current_user.organization_id:
        return service.get_users_by_org(current_user.organization_id)
    return service.get_all_users()


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)
    user = service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    service = UserService(db)
    user = service.update_user(
        user_id,
        username=payload.username,
        email=payload.email,
        hashed_password=payload.password,
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    service = UserService(db)
    success = service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}


@router.put("/{user_id}/role", response_model=UserResponse)
def set_user_role(
    user_id: int,
    payload: RolePayload,
    db: Session = Depends(get_db),
    admin: DBUser = Depends(require_admin),
):
    if payload.role not in ("user", "admin"):
        raise HTTPException(status_code=400, detail="Role must be 'user' or 'admin'")
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    service = UserService(db)
    user = service.set_role(user_id, payload.role)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    log_activity(db, admin, action="set_role", resource_type="user", resource_id=user_id,
                 details=f"role={payload.role}")
    return user


@router.put("/{user_id}/lock", response_model=UserResponse)
def set_user_lock(
    user_id: int,
    payload: LockPayload,
    db: Session = Depends(get_db),
    admin: DBUser = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot lock your own account")
    service = UserService(db)
    user = service.set_locked(user_id, payload.is_locked)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    action = "lock_user" if payload.is_locked else "unlock_user"
    log_activity(db, admin, action=action, resource_type="user", resource_id=user_id)
    return user
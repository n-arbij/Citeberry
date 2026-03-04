from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import Organization as DBOrganization, OrgJoinRequest, User as DBUser


class OrganizationService:
    def __init__(self, db: Session):
        self.db = db

    def create_organization(self, name: str, address: str | None = None, email: str | None = None) -> DBOrganization:
        org = DBOrganization(name=name, address=address, email=email)
        self.db.add(org)
        self.db.commit()
        self.db.refresh(org)
        return org

    def get_organization(self, org_id: int) -> DBOrganization | None:
        return self.db.get(DBOrganization, org_id)

    def get_by_name(self, name: str) -> DBOrganization | None:
        result = self.db.execute(select(DBOrganization).where(DBOrganization.name == name))
        return result.scalars().first()

    def get_by_short_id(self, short_id: str) -> DBOrganization | None:
        result = self.db.execute(select(DBOrganization).where(DBOrganization.short_id == short_id))
        return result.scalars().first()

    def get_all_organizations(self) -> list[DBOrganization]:
        result = self.db.execute(select(DBOrganization))
        return result.scalars().all()

    def update_organization(self, org_id: int, name: str | None = None, address: str | None = None, email: str | None = None) -> DBOrganization | None:
        org = self.get_organization(org_id)
        if not org:
            return None
        if name is not None:
            org.name = name
        if address is not None:
            org.address = address
        if email is not None:
            org.email = email
        self.db.commit()
        self.db.refresh(org)
        return org

    def delete_organization(self, org_id: int) -> bool:
        org = self.get_organization(org_id)
        if not org:
            return False
        self.db.delete(org)
        self.db.commit()
        return True

    # --- Join request methods ---

    def create_join_request(self, user_id: int, org_id: int) -> OrgJoinRequest:
        req = OrgJoinRequest(user_id=user_id, organization_id=org_id, status="pending")
        self.db.add(req)
        self.db.commit()
        self.db.refresh(req)
        return req

    def get_join_request(self, request_id: int) -> OrgJoinRequest | None:
        return self.db.get(OrgJoinRequest, request_id)

    def list_join_requests(self, org_id: int, status: str | None = None) -> list[OrgJoinRequest]:
        q = select(OrgJoinRequest).where(OrgJoinRequest.organization_id == org_id)
        if status:
            q = q.where(OrgJoinRequest.status == status)
        return self.db.execute(q).scalars().all()

    def accept_join_request(self, request_id: int) -> OrgJoinRequest | None:
        req = self.get_join_request(request_id)
        if not req or req.status != "pending":
            return None
        req.status = "accepted"
        # move the user into the organization
        user = self.db.get(DBUser, req.user_id)
        if user:
            user.organization_id = req.organization_id
        self.db.commit()
        self.db.refresh(req)
        return req

    def reject_join_request(self, request_id: int) -> OrgJoinRequest | None:
        req = self.get_join_request(request_id)
        if not req or req.status != "pending":
            return None
        req.status = "rejected"
        self.db.commit()
        self.db.refresh(req)
        return req


__all__ = ["OrganizationService"]
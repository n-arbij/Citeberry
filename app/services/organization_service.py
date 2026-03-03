from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import Organization as DBOrganization


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


__all__ = ["OrganizationService"]
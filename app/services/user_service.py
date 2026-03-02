from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import User as DBUser


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, username: str, email: str, hashed_password: str) -> DBUser:
        new_user = DBUser(username=username, email=email, hashed_password=hashed_password)
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def get_user(self, user_id: int) -> DBUser | None:
        return self.db.get(DBUser, user_id)

    def get_user_by_username(self, username: str) -> DBUser | None:
        result = self.db.execute(select(DBUser).where(DBUser.username == username))
        return result.scalars().first()

    def get_all_users(self) -> list[DBUser]:
        result = self.db.execute(select(DBUser))
        return result.scalars().all()

    def update_user(self, user_id: int, username: str | None = None, email: str | None = None, hashed_password: str | None = None) -> DBUser | None:
        user = self.get_user(user_id)
        if not user:
            return None
        if username is not None:
            user.username = username
        if email is not None:
            user.email = email
        if hashed_password is not None:
            user.hashed_password = hashed_password
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int) -> bool:
        user = self.get_user(user_id)
        if not user:
            return False
        self.db.delete(user)
        self.db.commit()
        return True


__all__ = ["UserService"]

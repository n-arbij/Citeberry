
from typing import Generator, Any
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, Query
from jose import JWTError
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.auth.jwt import decode_access_token

from app.database import database
from app.models.user import TokenData, UserInDB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db() -> Generator[Session, None, None]:
	yield from database.get_db()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
	credentials_exception = HTTPException(
		status_code=401,
		detail="Could not validate credentials",
		headers={"WWW-Authenticate": "Bearer"},
	)
	try:
		payload = decode_access_token(token)
		username: str = payload.username
		if username is None:
			raise credentials_exception
		token_data = TokenData(username=username)
	except JWTError:
		raise credentials_exception
	user = db.query(UserInDB).filter(UserInDB.username == token_data.username).first()
	if user is None:
		raise credentials_exception
	return UserInDB(**user.__dict__)

class Pagination(BaseModel):
	page: int = 1
	per_page: int = 10
	max_per_page: int = 100

	@property
	def limit(self) -> int:
		return min(max(1, self.per_page), self.max_per_page)

	@property
	def offset(self) -> int:
		return (max(1, self.page) - 1) * self.limit


def pagination_params(
	page: int = Query(1, ge=1), per_page: int = Query(10, ge=1, le=100)
) -> Pagination:
	return Pagination(page=page, per_page=per_page)


def paginate_query(query: Any, pagination: Pagination):
	return query.offset(pagination.offset).limit(pagination.limit)


__all__ = ["get_db", "pagination_params", "Pagination", "paginate_query"]


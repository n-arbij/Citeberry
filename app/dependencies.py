
from typing import Generator, Any

from fastapi import Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import database


def get_db() -> Generator[Session, None, None]:
	yield from database.get_db()


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


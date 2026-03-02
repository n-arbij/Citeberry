from fastapi import APIRouter

from .clients import router as clients_router
from .users import router as users_router
from .quotes import router as quotes_router
from .quote_items import router as quote_items_router
from .invoices import router as invoices_router
from .notifications import router as notifications_router

api_router = APIRouter()

api_router.include_router(clients_router)
api_router.include_router(users_router)
api_router.include_router(quotes_router)
api_router.include_router(quote_items_router)
api_router.include_router(invoices_router)
api_router.include_router(notifications_router)

__all__ = ["api_router"]

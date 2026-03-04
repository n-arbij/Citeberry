from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from datetime import datetime, timezone
from dotenv import load_dotenv

class Database:
    def __init__(self):
        load_dotenv()
        self.database_url = os.getenv("DATABASE_URL")
        if not self.database_url:
            raise ValueError("DATABASE_URL is not set in environment")
        self.engine = create_engine(self.database_url, connect_args={"check_same_thread": False})
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.Base = declarative_base()
        self.Base.metadata.create_all(self.engine)

    def get_db(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()

database = Database()

class QuoteStatus:
    DRAFT = "draft"
    SENT = "sent"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class User(database.Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    organization = relationship("Organization", back_populates="users")


class Client(database.Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, index=True)
    enterprise_name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    organization = relationship("Organization", back_populates="clients")


class Quote(database.Base):
    __tablename__ = "quotes"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    organization = relationship("Organization", back_populates="quotes")
    client_id = Column(Integer, ForeignKey("clients.id"))
    client = relationship("Client")
    title = Column(String, index=True)
    description = Column(String)
    amount = Column(Float)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    status = Column(String, default=QuoteStatus.DRAFT)
    quote_items = relationship("QuoteItem", back_populates="quote", cascade="all, delete-orphan")


class QuoteItem(database.Base):
    __tablename__ = "quote_items"
    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey("quotes.id"))
    quote = relationship("Quote", back_populates="quote_items")
    description = Column(String)
    quantity = Column(Integer)
    unit_price = Column(Float)
    sub_total = Column(Float)


class Notification(database.Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    organization = relationship("Organization", back_populates="notifications")
    user_id = Column(Integer)
    message = Column(String)
    created_at = Column(DateTime)


class Invoice(database.Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    organization = relationship("Organization", back_populates="invoices")
    title = Column(String, index=True)
    description = Column(String)
    amount = Column(Float)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)



import shortuuid


class OrgJoinRequest(database.Base):
    __tablename__ = "org_join_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    status = Column(String, default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user = relationship("User")
    organization = relationship("Organization", back_populates="join_requests")


class Organization(database.Base):
    __tablename__ = "organizations"
    # internal integer primary key, external short_id used everywhere else
    id = Column(Integer, primary_key=True, index=True)
    short_id = Column(String, unique=True, index=True, default=lambda: shortuuid.uuid())
    name = Column(String, unique=True, index=True)
    address = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=True)
    users = relationship("User", back_populates="organization")
    clients = relationship("Client", back_populates="organization")
    quotes = relationship("Quote", back_populates="organization")
    invoices = relationship("Invoice", back_populates="organization")
    notifications = relationship("Notification", back_populates="organization")
    join_requests = relationship("OrgJoinRequest", back_populates="organization")


from sqlalchemy import text


def create_tables():
    database.Base.metadata.create_all(database.engine)

    with database.engine.connect() as conn:
        result = conn.execute(text("PRAGMA table_info(users)"))
        cols = [row[1] for row in result.fetchall()]
        if "organization_id" not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN organization_id INTEGER"))
        if "role" not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'user'"))
        
        # clients table
        result = conn.execute(text("PRAGMA table_info(clients)"))
        cols = [row[1] for row in result.fetchall()]
        if "organization_id" not in cols:
            conn.execute(text("ALTER TABLE clients ADD COLUMN organization_id INTEGER"))
        
        # organization table additions
        result = conn.execute(text("PRAGMA table_info(organizations)"))
        org_cols = [row[1] for row in result.fetchall()]
        if "short_id" not in org_cols:
            conn.execute(text("ALTER TABLE organizations ADD COLUMN short_id VARCHAR"))
        if "address" not in org_cols:
            conn.execute(text("ALTER TABLE organizations ADD COLUMN address VARCHAR"))
        if "email" not in org_cols:
            conn.execute(text("ALTER TABLE organizations ADD COLUMN email VARCHAR"))
        
        # quote, invoice, notification organization refs
        result = conn.execute(text("PRAGMA table_info(quotes)"))
        quote_cols = [row[1] for row in result.fetchall()]
        if "organization_id" not in quote_cols:
            conn.execute(text("ALTER TABLE quotes ADD COLUMN organization_id INTEGER"))
        
        result = conn.execute(text("PRAGMA table_info(invoices)"))
        inv_cols = [row[1] for row in result.fetchall()]
        if "organization_id" not in inv_cols:
            conn.execute(text("ALTER TABLE invoices ADD COLUMN organization_id INTEGER"))
        
        result = conn.execute(text("PRAGMA table_info(notifications)"))
        notif_cols = [row[1] for row in result.fetchall()]
        if "organization_id" not in notif_cols:
            conn.execute(text("ALTER TABLE notifications ADD COLUMN organization_id INTEGER"))

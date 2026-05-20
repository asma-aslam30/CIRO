from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./ciro_startup.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="operator")


class SignalDB(Base):
    __tablename__ = "signals"
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)
    text = Column(Text)
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CrisisDB(Base):
    __tablename__ = "crises"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    location = Column(String)
    severity = Column(String)
    confidence = Column(Float)
    reasoning = Column(Text)
    signals_count = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    actions = relationship("ActionDB", back_populates="crisis")

class ActionDB(Base):
    __tablename__ = "actions"
    id = Column(Integer, primary_key=True, index=True)
    crisis_id = Column(Integer, ForeignKey("crises.id"))
    action = Column(String)
    status = Column(String)
    detail = Column(Text)
    time = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    crisis = relationship("CrisisDB", back_populates="actions")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# database.py connects Python to PostgreSQL

from sqlalchemy import create_engine  # represent SQL tables as Python classes
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str           # defined in .env file
    device_api_key: str
    model_config = SettingsConfigDict(env_file='.env')

settings = Settings()

# the engine manages connections to PostgreSQL
engine = create_engine(settings.database_url, pool_pre_ping=True) 
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

# provides a session to an endpoint and closes it afterward
def get_db():
    with SessionLocal() as db:
        yield db

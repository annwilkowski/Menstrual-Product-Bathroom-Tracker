# models.py defines the database tables for PostgreSQL

from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base

# creates and returns the current date and time as a timezone-aware datetime object 
def utcnow(): 
    return datetime.now(timezone.utc)

'''
Table: 
dispensers
id	  name	             pad_count	  tampon_count	  measured_at
1	  ECEB 1st Floor     12	          8	              17:00
2	  ECEB 2nd Floor     5	          3	              16:50
Each row represents one physical dispenser. 
Stores only the latest product counts, rather than a full measurement history.
'''
class Dispenser(Base):
    __tablename__ = 'dispensers'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    building: Mapped[str] = mapped_column(String(100))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    pad_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    tampon_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    measured_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


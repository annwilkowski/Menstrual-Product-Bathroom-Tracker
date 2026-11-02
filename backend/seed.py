# seed.py inserts example dispensers for testing

from app.database import SessionLocal, Base, engine
from app.models import Dispenser
from sqlalchemy import select

Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    if not db.scalar(select(Dispenser.id).limit(1)):
        db.add_all([
            Dispenser(name='ECEB 1st Floor', building='ECEB', latitude=40.1157, longitude=-88.2284),
            Dispenser(name='ECEB 2nd Floor', building='ECEB', latitude=40.1157, longitude=-88.2284),
        ])
        db.commit()
print('Seed complete')

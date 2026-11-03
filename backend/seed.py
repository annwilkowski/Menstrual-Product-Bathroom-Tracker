# seed.py inserts example dispensers for testing

from app.database import SessionLocal, Base, engine
from app.models import Dispenser
from sqlalchemy import select

Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    if not db.scalar(select(Dispenser.id).limit(1)): # if the database is empty
        db.add_all([
            Dispenser(name='ECEB 1st Floor', building='ECEB', latitude=40.1157, longitude=-88.2284, pad_count=0, tampon_count=1),
            Dispenser(name='ECEB 2nd Floor', building='ECEB', latitude=40.1157, longitude=-88.2284, pad_count=2, tampon_count=3),
            Dispenser(name='Siebel Bathroom', building='Siebel Center', latitude=40.1138, longitude=-88.2249, pad_count=4, tampon_count=5),
            Dispenser(name='Grainger Bathroom', building='Grainger Library', latitude=40.1125, longitude=-88.2261, pad_count=6, tampon_count=7)
        ])
        db.commit()
print('Seed complete')

# Run "TRUNCATE TABLE dispensers RESTART IDENTITY;" inside psql to clear dispensers table
# dispensers.py - handles requests from the app

from datetime import datetime, timezone, timedelta
from math import radians, sin, cos, asin, sqrt
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Dispenser
from ..schemas import DispenserOut

# connects to main.py
router = APIRouter(prefix='/dispensers', tags=['dispensers'])

# The Haversine formula calculates the distance between two points on Earth's 
# surface using their latitude and longitude
# The function accepts a: User latitude, b: User longitude, c: Dispenser latitude, d: Dispenser longitude
def distance_km(a, b, c, d):
    dlat, dlon = radians(c-a), radians(d-b)
    h = sin(dlat/2)**2 + cos(radians(a))*cos(radians(c))*sin(dlon/2)**2
    return 6371 * 2 * asin(sqrt(h))   # Earth's approximate radius: 6,371 km

# Find the closest 3 dispensers using the Haversine formula
@router.get('/nearby', response_model=list[DispenserOut])
def nearby(lat: float = Query(ge=-90, le=90), lon: float = Query(ge=-180, le=180), db: Session = Depends(get_db)):
    boxes = db.scalars(select(Dispenser)).all()
    return sorted(boxes, key=lambda x: distance_km(lat, lon, x.latitude, x.longitude))[:3]

# returns all dispensers sorted by id order
@router.get("/all", response_model=list[DispenserOut])
def get_all_dispensers(db: Session = Depends(get_db)):
    return db.scalars(
        select(Dispenser).order_by(Dispenser.id)
    ).all()

# dispensers.py - handles requests from the app

from datetime import datetime, timezone, timedelta
from math import radians, sin, cos, asin, sqrt
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Dispenser
from ..schemas import DispenserOut, DispenserLocationUpdate

# connects to main.py
router = APIRouter(prefix='/dispensers', tags=['dispensers'])

# returns all dispensers sorted by id order
@router.get("/all", response_model=list[DispenserOut])
def get_all_dispensers(db: Session = Depends(get_db)):
    return db.scalars(
        select(Dispenser).order_by(Dispenser.id)
    ).all()


# Only used for testing - Update the location of an existing dispenser
@router.patch("/{dispenser_id}/location", response_model=DispenserOut)
def update_dispenser_location(
    dispenser_id: int,
    location: DispenserLocationUpdate,
    db: Session = Depends(get_db),
):
    # Find the dispenser
    dispenser = db.get(Dispenser, dispenser_id)

    if dispenser is None:
        raise HTTPException(404, "Dispenser not found")

    # Update its coordinates
    dispenser.latitude = location.latitude
    dispenser.longitude = location.longitude

    db.commit()
    db.refresh(dispenser)

    return dispenser

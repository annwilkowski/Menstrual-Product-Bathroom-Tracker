# measurements.py accepts measurements whenever the ESP32 wakes up

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database import get_db, settings
from ..models import Dispenser
from ..schemas import MeasurementIn

# TESTING
# from time import perf_counter

router = APIRouter(prefix="/devices", tags=["devices"])

@router.post("/{dispenser_id}/measurement")
def upload_measurement(
    dispenser_id: int,
    measurement: MeasurementIn,
    x_device_key: str = Header(),
    db: Session = Depends(get_db),
):
    # TESTING 
    # start_time = perf_counter()
    
    # Authenticate the ESP32
    if x_device_key != settings.device_api_key:
        raise HTTPException(401, "Invalid device API key")

    # Find the dispenser in database
    dispenser = db.get(Dispenser, dispenser_id)

    if dispenser is None:
        raise HTTPException(404, "Dispenser not found")

    # Update the inventory
    dispenser.pad_count = measurement.pad_count
    dispenser.tampon_count = measurement.tampon_count
    dispenser.measured_at = datetime.now(timezone.utc)

    db.commit()

    # TESTING
    # end_time = perf_counter()
    # elapsed_time = end_time - start_time
    # print(f"Database update time: {elapsed_time:.6f} seconds")

    return {"status": "success"}

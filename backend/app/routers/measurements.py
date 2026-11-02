# measurements.py accepts measurements whenever the ESP32 wakes up

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database import get_db, settings
from ..models import Dispenser

router = APIRouter(prefix="/devices", tags=["devices"])

# data validation
class MeasurementIn(BaseModel):
    pad_count: int = Field(ge=0) # count >= 0
    tampon_count: int = Field(ge=0)


@router.post("/{dispenser_id}/measurement")
def upload_measurement(
    dispenser_id: int,
    measurement: MeasurementIn,
    x_device_key: str = Header(),
    db: Session = Depends(get_db),
):
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

    return {"status": "success"}

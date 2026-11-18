# schemas.py validates incoming data

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

# Pydantic checks that the fields exist, have the right types, and that the counts aren't negative.
# If the ESP32 sends an inorrect message, FastAPI rejects the request with a validation error.


### Dispensers.py Schemas ###
class DispenserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    building: str
    latitude: float
    longitude: float
    pad_count: int | None
    tampon_count: int | None
    measured_at: datetime | None

class DispenserLocationUpdate(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


### Measurements.py Schemas ###
class MeasurementIn(BaseModel):
    pad_count: int = Field(ge=0)
    tampon_count: int = Field(ge=0)

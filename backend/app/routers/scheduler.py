from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class IrrigationRequest(BaseModel):
    crop: str
    soil: str
    area: float


CROP_WATER = {
    "rice": 12000,
    "wheat": 6000,
    "cotton": 7000,
}

SOIL_FACTOR = {
    "sandy": 1.2,
    "loamy": 1.0,
    "clay": 0.8,
}


@router.get("/api/scheduler/options")
def scheduler_options():
    return {
        "crops": sorted(CROP_WATER.keys()),
        "soils": sorted(SOIL_FACTOR.keys()),
    }


@router.post("/api/scheduler")
def calculate_irrigation(data: IrrigationRequest):
    crop = data.crop.lower().strip()
    soil = data.soil.lower().strip()
    area = data.area

    if crop not in CROP_WATER:
        raise HTTPException(status_code=400, detail=f"Unsupported crop: {data.crop}")

    if soil not in SOIL_FACTOR:
        raise HTTPException(status_code=400, detail=f"Unsupported soil type: {data.soil}")

    if area <= 0:
        raise HTTPException(status_code=400, detail="Area must be greater than zero")

    water_needed = CROP_WATER[crop] * area * SOIL_FACTOR[soil]
    duration = water_needed / 400  # liters per minute

    if soil == "sandy":
        message = "Soil drains quickly. Irrigate today in the morning."
    elif soil == "clay":
        message = "Soil holds water well. Avoid over-irrigation."
    else:
        message = "Soil moisture is balanced. Follow regular irrigation."

    return {
        "crop": crop.capitalize(),
        "water_needed_liters": round(water_needed, 2),
        "duration_minutes": round(duration, 1),
        "message": message,
    }

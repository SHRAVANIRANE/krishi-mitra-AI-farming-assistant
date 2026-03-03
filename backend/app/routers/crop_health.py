from fastapi import APIRouter
from app.services.crop_health_service import (
    get_crop_health_history,
    get_crop_health_summary,
)

router = APIRouter()

@router.get("/api/crop-health/summary")
def crop_health_summary():
    return get_crop_health_summary()


@router.get("/api/crop-health/history")
def crop_health_history(limit: int = 10):
    return {"items": get_crop_health_history(limit=limit)}

# dashboard.py
from fastapi import APIRouter
from app.services.dashboard_service import calculate_dashboard_stats


router = APIRouter()

@router.get("/api/dashboard/stats")
def get_dashboard_stats():
    return calculate_dashboard_stats()

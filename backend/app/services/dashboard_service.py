from app.services.crop_health_service import get_crop_health_summary
from app.services.alert_service import generate_alerts

def calculate_dashboard_stats():
    crop_summary = get_crop_health_summary()

    total_acres = 45
    soil_moisture = 68

    alerts = generate_alerts(
        crop_summary=crop_summary,
        soil_moisture=soil_moisture
    )

    return {
        "total_acres": total_acres,
        "healthy_crops": crop_summary["healthy_percentage"],  # SAME VALUE
        "active_alerts": len(alerts),
        "soil_moisture": soil_moisture
    }

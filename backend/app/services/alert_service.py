def generate_alerts(crop_summary, soil_moisture):
    alerts = []

    if crop_summary["diseased_fields"] > 0:
        alerts.append("Disease detected in crops")

    if soil_moisture < 40:
        alerts.append("Low soil moisture detected")

    return alerts

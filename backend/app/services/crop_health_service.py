from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from app.database import SessionLocal
from models.crop_scan import CropScan


def save_crop_scan_result(prediction: str):
    is_healthy = "healthy" in prediction.lower()

    db = SessionLocal()
    try:
        scan = CropScan(prediction=prediction, is_healthy=is_healthy)
        db.add(scan)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
    finally:
        db.close()


def get_crop_health_summary():
    db = SessionLocal()
    try:
        total = db.query(func.count(CropScan.id)).scalar() or 0
        if total == 0:
            return {
                "total_fields": 0,
                "healthy_percentage": 0,
                "diseased_fields": 0,
            }

        healthy = (
            db.query(func.count(CropScan.id))
            .filter(CropScan.is_healthy.is_(True))
            .scalar()
            or 0
        )
        diseased = total - healthy

        return {
            "total_fields": int(total),
            "healthy_percentage": int((healthy / total) * 100),
            "diseased_fields": int(diseased),
        }
    except SQLAlchemyError:
        return {
            "total_fields": 0,
            "healthy_percentage": 0,
            "diseased_fields": 0,
        }
    finally:
        db.close()


def get_crop_health_history(limit: int = 10):
    safe_limit = max(1, min(limit, 50))
    db = SessionLocal()
    try:
        rows = (
            db.query(CropScan)
            .order_by(CropScan.created_at.desc(), CropScan.id.desc())
            .limit(safe_limit)
            .all()
        )
        return [
            {
                "id": row.id,
                "prediction": row.prediction,
                "is_healthy": bool(row.is_healthy),
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in rows
        ]
    except SQLAlchemyError:
        return []
    finally:
        db.close()

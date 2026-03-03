# Krishi Mitra - Smart Farming Assistant

Krishi Mitra is a full-stack, ML-powered web application that helps with crop disease detection, irrigation planning, weather-based decisions, and farm-level analytics.

## Current Features

### 1) Crop Health Monitoring (ML Inference)
- Upload crop leaf images from the frontend.
- Backend runs TensorFlow/Keras inference using `krishi_mitra_inference_model.keras`.
- Returns:
  - predicted class label
  - confidence score
- Saves each prediction to PostgreSQL (Neon) for persistent analytics.

### 2) Crop Health Analytics
- `GET /api/crop-health/summary`
  - total scans
  - healthy percentage
  - diseased fields count
- `GET /api/crop-health/history?limit=10`
  - recent scan records with timestamps

### 3) Dashboard
- `GET /api/dashboard/stats`
- Shows:
  - total acres
  - healthy crop percentage
  - active alerts
  - soil moisture
- Includes recent scan history and healthy/diseased trend visualization.

### 4) Irrigation Planner
- `GET /api/scheduler/options`
- `POST /api/scheduler`
- Uses crop + soil + area to estimate:
  - total water needed (liters)
  - irrigation duration (minutes)
  - advisory message

### 5) Weather Intelligence
- OpenWeather integration from frontend.
- Geolocation-based current weather + 5-day forecast.
- Smart recommendation blocks based on rain probability, temperature, and humidity.

## Machine Learning Details

- Framework: TensorFlow / Keras
- Deployed inference model: `ml_model/saved_model/krishi_mitra_inference_model.keras`
- Training notebook: `ml_model/1-Model-Training.ipynb`
- Model approach (from notebook):
  - transfer learning with MobileNetV2
  - image size: 224x224
  - augmentation: flip, rotation, zoom
  - train/validation split: 80/20
- Dataset folder used in training:
  - `ml_model/data/Plant_leave_diseases_dataset_without_augmentation`
  - 39 classes in notebook output

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI
- ML: TensorFlow / Keras
- Database: Neon PostgreSQL + SQLAlchemy

## Project Structure (Key Paths)

- Frontend app: `frontend/`
- Backend app entrypoint: `backend/main.py` (re-exports `app.main`)
- Main backend logic: `backend/app/main.py`
- Routers: `backend/app/routers/`
- Services: `backend/app/services/`
- DB setup: `backend/app/database.py`
- DB model: `backend/models/crop_scan.py`
- ML assets: `ml_model/saved_model/`

## Local Development

## Prerequisites
- Python 3.12+
- Node.js 18+

## 1) Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 2) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### `backend/.env`

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

### `frontend/.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_OPENWEATHER_API_KEY=<your_openweather_key>
```

## API Endpoints

- `GET /` -> health message
- `POST /predict` -> crop disease prediction
- `GET /api/crop-health/summary`
- `GET /api/crop-health/history?limit=10`
- `GET /api/dashboard/stats`
- `GET /api/scheduler/options`
- `POST /api/scheduler`

## Notes

- Backend creates DB tables on startup via `create_db_and_tables()`.
- DB connection uses defensive settings (`pool_pre_ping`, timeout) to reduce hangs when Neon is slow/unavailable.
- Do not commit real secrets or production database URLs.
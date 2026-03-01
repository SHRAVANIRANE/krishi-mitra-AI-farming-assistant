# 🌾 Krishi Mitra – Smart Farming Assistant

Krishi Mitra is a full-stack, ML-powered web application designed to assist farmers in crop health monitoring, irrigation planning, and farm management.

---

## 🚀 Features Implemented

### 🌱 Crop Health Monitoring
- Upload crop images
- AI-based disease detection using a CNN model
- Confidence and severity analysis
- Actionable treatment recommendations

### 📊 Overall Farm Health
- Aggregated health score derived from all crop scans
- Healthy vs diseased field count
- Persistent summary across page navigation

### 📈 Dashboard
- Backend-driven statistics
- Healthy crop percentage
- Active alerts count
- Soil moisture overview

### 💧 Irrigation Scheduler
- Crop + soil based water requirement calculation
- Duration and water quantity estimation

### 🚨 Alert Engine
- Disease detection alerts
- Low soil moisture alerts
- Designed for weather integration

---

## 🧠 System Architecture

Frontend (React)
→ Backend APIs (FastAPI)
→ Service Layer (ML + Rules)
→ Aggregated Farm Intelligence

The backend acts as the single source of truth, ensuring data consistency across the application.

---

## ⚙️ Technology Stack

- Frontend: React, Tailwind CSS
- Backend: FastAPI, Python
- ML: TensorFlow / Keras
- Architecture: Modular routers + service layer

---

## 🔮 Future Enhancements

- Database integration (MongoDB)
- User authentication
- Historical analytics & charts
- Weather-based irrigation intelligence
- IoT sensor integration

---

## 📌 Note

Currently, crop scan data is stored in server memory for rapid prototyping. This will be replaced with persistent storage in the next phase.

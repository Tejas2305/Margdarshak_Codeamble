# 🛡️ Margdarshak — Real-Time Public Safety Navigation Platform

**Margdarshak** is a real-time, safety-focused spatial navigation platform. It evaluates travel routes not just by distance or traffic speed, but by **user physical safety**, leveraging police FIR crime statistics, crowdsourced community hazard telemetry, ambient lighting factors, and PostGIS spatial topological analysis.

---

## 📚 Core Documentation

- 📄 **[MARGDARSHAK_PROJECT_DOCUMENTATION.md](file:///e:/Hackathons/Codeamble/Margadarshak/MARGDARSHAK_PROJECT_DOCUMENTATION.md)** — Comprehensive technical design document, PostGIS 1-km stretch algorithms, safety index mathematical equations, DB schemas, and full REST API specifications (ready for PDF export).
- 📈 **[Progress.md](file:///e:/Hackathons/Codeamble/Margadarshak/Progress.md)** — Live completion progress, verified endpoints matrix, and roadmap.

---

## ✨ Key Features

1. **Multi-Layer Safety Index**:
   - **Layer A (Government Data)**: Aggregates historical police crime records (FIRs) and population density.
   - **Layer B (Community Real-Time)**: Dynamic incident reporting (harassment, unlit streets, accidents) weighted by Reddit-style confidence voting.
   - **Layer C (Environmental)**: Ambient time-of-day risk adjustments and street lighting scores.

2. **PostGIS Topological 1-km Road Stretch Traversal**:
   - Automatically traverses connected road segments (`ST_Touches`, `ST_Union`) to compute continuous 1-kilometer spatial risk profiles.

3. **OSRM Polyline Buffer Hazard Matching**:
   - Matches live crowdsourced reports against alternate candidate routes using a spatial buffer ($350\text{ m}$) across route GeoJSON polylines.

4. **Dynamic Speed Penalty & ETA Slowdown**:
   - Calculates safety travel penalties on risky segments, guiding users towards safest routes naturally.

5. **Panic SOS & Emergency Telemetry**:
   - One-tap SOS trigger with geolocation persistence and saved contact alert routing.

---

## 🛠️ Technology Stack

* **Frontend**: React Native (Expo SDK 52, React Navigation v7, Zustand, React Query, `react-native-maps`).
* **Backend Framework**: Python FastAPI (AsyncIO asynchronous architecture).
* **Database**: PostgreSQL with PostGIS Geospatial Extension.
* **Routing Engine**: OSRM (Open Source Routing Machine).
* **Caching**: Redis.
* **Security**: OAuth2 with JWT (RS256/HS256) & Encrypted Storage (Expo SecureStore).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL with PostGIS enabled
- OSRM server (or standard fallback mode)

### 2. Backend Setup
```bash
cd Backend
# Install python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*Backend Swagger API Docs will be available at:* `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd Frontend/MargdarshakApp
# Install dependencies
npm install

# Start Expo dev server
npm start
```

---

## 📁 Repository Structure

```
Margdarshak/
├── README.md                              # Main repository overview & quickstart
├── MARGDARSHAK_PROJECT_DOCUMENTATION.md   # Detailed PDF-ready technical documentation
├── Progress.md                            # Feature completion & API verification tracker
│
├── Backend/                               # FastAPI Spatial Intelligence Backend
│   ├── app/                               # Routers, spatial services, models & schemas
│   ├── data/                              # Seeding data & geographic Pune centroids
│   └── requirements.txt                   # Asynchronous Python dependencies
│
└── Frontend/                              # React Native Expo Mobile App
    └── MargdarshakApp/
        ├── src/                           # Screen components, theme, navigation & API client
        └── package.json                   # Mobile App dependencies
```

---

## 🛡️ License

Built with ❤️ for public safety navigation.

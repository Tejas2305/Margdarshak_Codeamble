# Margdarshak — Project Context

## What We're Building

Margdarshak (also called SentinelMap) is a **real-time public safety navigation platform**.

It helps users choose the **safest route — not just the fastest one** — using live incidents, AI-powered risk analysis, and community-verified reports.

### The Problem
Current navigation apps (Google Maps, etc.) optimize for speed, distance, and traffic. They are completely blind to personal safety. Users can unknowingly walk or drive through crime hotspots, harassment-prone areas, accident locations, riots, or flooded roads.

### The Solution
Safety as a navigation parameter. Instead of only asking "How fast can I reach my destination?", Margdarshak asks: **"What is the safest way to reach my destination right now?"**

---

## How It Works

```
Crime Reports + User Reports + News Articles + Historical Crime Data + Traffic & Road Incidents
        │
        ▼
Data Collection Layer
        │
        ▼
AI Verification & Risk Engine
        │
        ▼
Dynamic Safety Heatmap
        │
        ▼
Safe Route Calculation (OSRM + Risk Weights)
        │
        ▼
User Navigation
```

---

## Core Features

- **Live Safety Heatmap** — Every road gets a dynamic safety score. 🟢 Safe / 🟡 Moderate / 🔴 High Risk. Updates continuously as incidents are verified.
- **Real-Time Incident Alerts** — Nearby notifications like "⚠ Robbery reported 500m ahead."
- **Safe Route Navigation** — Route = Distance + Road Risk + Time of Day = Safest Path. A 2-min longer but safer route may be recommended.
- **Incident Reporting** — Users report Theft, Harassment, Assault, Suspicious Activity, Accident, Road Block, Fire, Flood. Each report includes GPS location, time, category, optional image, description.
- **Dynamic Safety Score** — Every area scored 0–10, changes as incidents occur or expire.
- **Night Safety Mode** — After a set time (e.g. 10 PM), higher weight given to poorly lit or high-risk roads.
- **Emergency Mode** — One tap: send live location to emergency contacts, share travel status, trigger emergency notifications.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native |
| Backend | Python + FastAPI |
| Database | PostgreSQL + PostGIS (geospatial) |
| Caching | Redis |
| Routing Engine | OSRM (Open Source Routing Machine) |
| Authentication | JWT, Google OAuth, Apple Sign-In |

---

## Responsibility Split

- **Vedant (User) → Frontend only** — React Native app. All UI, navigation flows, map interactions, incident reporting, emergency mode.
- **Backend** — Python/FastAPI, PostgreSQL/PostGIS, Redis, OSRM, Risk Engine. Not Vedant's concern.

> ⚠️ When assisting Vedant, **focus exclusively on the React Native frontend**. Do not generate backend code, API server code, database schemas, or infrastructure config unless explicitly asked.

---

## Data Sources

- Crowdsourced user reports
- News sources
- Historical crime data
- Traffic events
- Government open data

---

## Target Users

- **Consumers** — Women, students, families, night travelers, tourists
- **Businesses** — Delivery companies, ride-sharing, logistics
- **Government** — Smart city dashboards, urban safety analytics, emergency response planning

---

## Future Vision

SentinelMap evolves from a navigation app into a **city-wide public safety ecosystem** integrating:
- AI-based crime prediction
- Smart City infrastructure
- Emergency services + IoT sensors
- Government dashboards
- Community-driven safety intelligence

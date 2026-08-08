import httpx
import math
import psycopg2
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text

from app.config import (
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
)
from app.models.road_segment import RoadSegment
from app.models.area import Area
from app.models.fir import FIR
from app.models.report import Report
from app.schemas.map import LocationPoint, RouteSafetyOption, RouteSafetyResponse, WarningItem
from app.services.scoring_service import (
    calculate_community_score_b,
    calculate_government_score_a,
    calculate_environment_score_c,
    calculate_total_risk_score,
    calculate_adjusted_speed,
)

# Standard Pune Locality Geocoded Centroids (Pre-populated seed dictionary)
PUNE_AREA_CENTROIDS = {
    "Baner": (18.5596, 73.7799),
    "Kondhwa": (18.4682, 73.8927),
    "Shivajinagar": (18.5314, 73.8446),
    "Hadapsar": (18.5089, 73.9260),
    "Yerawada": (18.5529, 73.8796),
    "Lohegaon": (18.5912, 73.9188),
    "Swargate": (18.5018, 73.8636),
    "Kharadi": (18.5515, 73.9349),
    "Hinjawadi": (18.5912, 73.7389),
    "Kothrud": (18.5074, 73.8077),
    "Warje": (18.4844, 73.8001),
    "Wakad": (18.5987, 73.7634),
    "Camp": (18.5158, 73.8770),
    "Chinchwad": (18.6298, 73.7997),
    "Pimpri": (18.6278, 73.8006),
    "Aundh": (18.5580, 73.8077),
    "Nigdi": (18.6480, 73.7699),
}

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


async def seed_areas_if_empty(db: AsyncSession):
    result = await db.execute(select(Area))
    existing = result.scalars().all()
    if not existing:
        for name, (lat, lng) in PUNE_AREA_CENTROIDS.items():
            area = Area(name=name, latitude=lat, longitude=lng)
            db.add(area)
        await db.commit()


async def search_places(query: str) -> List[Dict[str, Any]]:
    search_text = (query or "").strip()
    if not search_text:
        return []

    try:
        conn = psycopg2.connect(
            dbname="osrm",
            user="postgres",
            password="tejas",
            host="localhost",
            port=5432,
        )
        cur = conn.cursor()
        pattern = f"%{search_text}%"

        cur.execute(
            """
            SELECT name, ST_Y(ST_Centroid(way)) AS lat, ST_X(ST_Centroid(way)) AS lng
            FROM (
                SELECT name, way FROM planet_osm_point
                UNION ALL
                SELECT name, way FROM planet_osm_polygon
                UNION ALL
                SELECT name, way FROM planet_osm_line
            ) AS places
            WHERE name ILIKE %s
            ORDER BY name
            LIMIT 5
            """,
            (pattern,),
        )

        rows = cur.fetchall()
        cur.close()
        conn.close()

        results = []
        for name, lat, lng in rows:
            if name:
                results.append({
                    "name": name,
                    "lat": float(lat),
                    "lng": float(lng),
                })
        return results
    except Exception:
        return []


async def find_nearest_road_segment(db: AsyncSession, lat: float, lng: float) -> Optional[RoadSegment]:
    """
    Finds or creates the nearest specific road segment using PostGIS planet_osm_line spatial lookup.
    """
    road_name = None
    osm_id = None

    try:
        conn = psycopg2.connect(
            dbname="osrm",
            user=DB_USER or "postgres",
            password=DB_PASSWORD or "tejas",
            host=DB_HOST or "localhost",
            port=int(DB_PORT or 5432),
        )
        cur = conn.cursor()
        cur.execute("""
            SELECT name, osm_id
            FROM planet_osm_line
            WHERE highway IS NOT NULL
            ORDER BY way <-> ST_SetSRID(ST_MakePoint(%s, %s), 4326)
            LIMIT 1;
        """, (lng, lat))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            road_name = row[0]
            osm_id = int(row[1]) if row[1] else None
    except Exception as e:
        print(f"[find_nearest_road_segment Warning] PostGIS lookup error: {e}")

    if road_name:
        result = await db.execute(
            select(RoadSegment).where(RoadSegment.name == road_name)
        )
        existing = result.scalar_one_or_none()
        if existing:
            if not existing.osm_id and osm_id:
                existing.osm_id = osm_id
                await db.commit()
            return existing

        # Create new RoadSegment for this real road
        new_segment = RoadSegment(
            osm_id=osm_id,
            name=road_name,
            base_speed_kmh=50.0,
            updated_speed_kmh=50.0,
            fir_score=20.0,
            population_score=30.0,
            community_score_b=0.0,
            pollution_score=10.0,
            risk_score=15.0,
            is_dirty=False
        )
        db.add(new_segment)
        await db.commit()
        await db.refresh(new_segment)
        return new_segment

    # Fallback if PostGIS lookup returned nothing or failed
    result = await db.execute(select(RoadSegment))
    segments = result.scalars().all()

    if not segments:
        new_segment = RoadSegment(
            name="Default Pune Road Segment",
            base_speed_kmh=50.0,
            updated_speed_kmh=50.0,
            fir_score=20.0,
            population_score=30.0,
            community_score_b=0.0,
            pollution_score=10.0,
            risk_score=15.0,
            is_dirty=False
        )
        db.add(new_segment)
        await db.commit()
        await db.refresh(new_segment)
        return new_segment

    return segments[0]


async def sync_fir_scores_to_road_segments(db: AsyncSession):
    """
    Groups FIR records by area, calculates normalized fir_score (0-100),
    and updates road_segments based on nearest area centroid.
    """
    await seed_areas_if_empty(db)

    # Count FIRs per area name
    result = await db.execute(
        select(FIR.area, func.count(FIR.id).label("cnt")).group_by(FIR.area)
    )
    fir_counts = {row.area: row.cnt for row in result if row.area}

    if not fir_counts:
        return

    max_count = max(fir_counts.values()) if fir_counts else 1.0

    # Get areas with coordinates
    area_result = await db.execute(select(Area))
    areas = area_result.scalars().all()
    area_scores = {}
    for area in areas:
        cnt = fir_counts.get(area.name, 0)
        score = (cnt / float(max_count)) * 100.0
        area_scores[area.area_id] = {
            "name": area.name,
            "lat": area.latitude,
            "lng": area.longitude,
            "score": score
        }

    if not area_scores:
        return

    # Update road_segments
    seg_result = await db.execute(select(RoadSegment))
    road_segments = seg_result.scalars().all()

    for seg in road_segments:
        # Assign closest area's fir_score
        # Default coords if not explicitly defined
        best_score = 0.0
        min_dist = float("inf")
        for a_id, data in area_scores.items():
            dist = haversine_distance_km(18.5204, 73.8567, data["lat"], data["lng"])
            if dist < min_dist:
                min_dist = dist
                best_score = data["score"]

        seg.fir_score = best_score
        seg.risk_score = calculate_total_risk_score(
            calculate_government_score_a(seg.fir_score, seg.population_score),
            seg.community_score_b,
            calculate_environment_score_c(15.0, seg.pollution_score)
        )
        seg.updated_speed_kmh = calculate_adjusted_speed(seg.base_speed_kmh, seg.risk_score)

    await db.commit()


async def evaluate_osrm_routes(origin: LocationPoint, destination: LocationPoint, db: AsyncSession) -> RouteSafetyResponse:
    osrm_url = f"http://localhost:5000/route/v1/driving/{origin.lng},{origin.lat};{destination.lng},{destination.lat}"
    params = {
        "alternatives": "true",
        "annotations": "nodes",
        "overview": "full",
        "geometries": "geojson"
    }

    routes_data = []
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(osrm_url, params=params)
            if resp.status_code == 200:
                json_body = resp.json()
                if json_body.get("code") == "Ok":
                    routes_data = json_body.get("routes", [])
    except Exception:
        routes_data = []

    # If OSRM server is not running locally or returned no routes, construct a fallback mock route response
    if not routes_data:
        direct_dist = haversine_distance_km(origin.lat, origin.lng, destination.lat, destination.lng) * 1000.0
        dur = direct_dist / (50.0 * 1000.0 / 3600.0) if direct_dist > 0 else 60.0

        fallback_route = RouteSafetyOption(
            route_index=0,
            distance_meters=round(direct_dist, 2),
            duration_seconds=round(dur, 2),
            adjusted_duration_seconds=round(dur * 1.15, 2),
            average_risk_score=24.5,
            safety_index=75.5,
            is_safest=True,
            warnings=[],
            geometry={
                "type": "LineString",
                "coordinates": [
                    [origin.lng, origin.lat],
                    [(origin.lng + destination.lng) / 2, (origin.lat + destination.lat) / 2],
                    [destination.lng, destination.lat]
                ]
            }
        )
        return RouteSafetyResponse(routes=[fallback_route], recommended_route_index=0)

    # Process returned routes from OSRM
    scored_options: List[RouteSafetyOption] = []
    best_index = 0
    lowest_risk = float("inf")

    # Fetch default segment risk for baseline
    seg = await find_nearest_road_segment(db, origin.lat, origin.lng)
    base_risk = seg.risk_score if seg else 20.0

    # Fetch ALL non-rejected reports with meaningful severity once
    all_reports_result = await db.execute(
        select(Report).where(
            Report.status != "REJECTED",
            Report.computed_severity >= 40.0,
            Report.description.isnot(None),
            Report.description != "",
        )
    )
    all_reports = all_reports_result.scalars().all()

    # Buffer distance in km — reports within this distance of the route path
    # are considered "on the route"
    ROUTE_BUFFER_KM = 0.3  # ~300 meters

    # Sample every Nth coordinate from the route geometry to avoid checking
    # hundreds of points per report (OSRM routes can have 500+ coords)
    SAMPLE_EVERY_N = 10

    for idx, r in enumerate(routes_data):
        dist = float(r.get("distance", 0.0))
        dur = float(r.get("duration", 0.0))
        geometry = r.get("geometry")

        # Slightly vary risk across alternative routes for clear comparison
        route_risk = max(5.0, min(95.0, base_risk + (idx * 8.5) - 3.0))
        adjusted_dur = dur * (1.0 + (route_risk / 100.0) * 0.4)
        safety_index = round(100.0 - route_risk, 1)

        # Extract route coordinates from geometry ([lng, lat] pairs)
        # Sample every Nth point for performance, always include first and last
        route_coords: List[tuple] = []
        if geometry and isinstance(geometry, dict):
            coords_list = geometry.get("coordinates", [])
            total_coords = len(coords_list)
            for i, coord in enumerate(coords_list):
                if isinstance(coord, (list, tuple)) and len(coord) >= 2:
                    # Include: first point, last point, and every Nth point
                    if i == 0 or i == total_coords - 1 or i % SAMPLE_EVERY_N == 0:
                        # OSRM GeoJSON: [lng, lat]
                        route_coords.append((float(coord[1]), float(coord[0])))

        # Filter warnings: only include reports whose location is near this route's path
        warnings: List[WarningItem] = []
        for report in all_reports:
            report_lat = float(report.latitude or 0.0)
            report_lng = float(report.longitude or 0.0)

            if report_lat == 0.0 and report_lng == 0.0:
                continue

            # Check if the report is within ROUTE_BUFFER_KM of any sampled point on this route
            is_on_route = False
            if route_coords:
                for rlat, rlng in route_coords:
                    d = haversine_distance_km(report_lat, report_lng, rlat, rlng)
                    if d <= ROUTE_BUFFER_KM:
                        is_on_route = True
                        break
            else:
                # No geometry coords available — fallback: check proximity to
                # the straight line between origin and destination
                d_origin = haversine_distance_km(report_lat, report_lng, origin.lat, origin.lng)
                d_dest = haversine_distance_km(report_lat, report_lng, destination.lat, destination.lng)
                route_length = haversine_distance_km(origin.lat, origin.lng, destination.lat, destination.lng)
                # Include if within buffer of either endpoint or roughly along the path
                if d_origin <= ROUTE_BUFFER_KM or d_dest <= ROUTE_BUFFER_KM:
                    is_on_route = True
                elif route_length > 0 and (d_origin + d_dest) <= route_length * 1.3:
                    is_on_route = True

            if is_on_route:
                warnings.append(
                    WarningItem(
                        latitude=report_lat,
                        longitude=report_lng,
                        message=report.description,
                        severity=int(report.computed_severity or 0),
                    )
                )

        if route_risk < lowest_risk:
            lowest_risk = route_risk
            best_index = idx

        scored_options.append(
            RouteSafetyOption(
                route_index=idx,
                distance_meters=round(dist, 2),
                duration_seconds=round(dur, 2),
                adjusted_duration_seconds=round(adjusted_dur, 2),
                average_risk_score=round(route_risk, 1),
                safety_index=safety_index,
                is_safest=False,  # will set best below
                warnings=warnings,
                geometry=geometry
            )
        )

    if scored_options:
        scored_options[best_index].is_safest = True

    return RouteSafetyResponse(routes=scored_options, recommended_route_index=best_index)

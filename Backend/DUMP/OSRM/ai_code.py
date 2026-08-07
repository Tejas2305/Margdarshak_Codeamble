import psycopg2

DB_CONFIG = {
    "dbname": "osrm",
    "user": "postgres",
    "password": "tejas",      # Change if needed
    "host": "localhost",
    "port": 5432,
}

# Simple priority table
ROAD_PRIORITY = {
    "motorway": 10,
    "trunk": 9,
    "primary": 8,
    "secondary": 7,
    "tertiary": 6,
    "unclassified": 5,
    "residential": 4,
    "living_street": 3,
    "service": 2,
    "track": 1,
}


def find_nearest_road(lat, lon):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM planet_osm_line
        WHERE highway IS NOT NULL
        ORDER BY
            way <-> ST_SetSRID(ST_MakePoint(%s, %s), 4326)
        LIMIT 1;
    """, (lon, lat))

    row = cur.fetchone()

    if row is None:
        return None

    columns = [desc[0] for desc in cur.description]

    cur.close()
    conn.close()

    return dict(zip(columns, row))


if __name__ == "__main__":

    LAT = 18.557531
    LON = 73.817092

    road = find_nearest_road(LAT, LON)

    if road is None:
        print("No road found.")
        exit()

    highway = road.get("highway")
    priority = ROAD_PRIORITY.get(highway, 0)

    print("=" * 60)
    print("ROAD INFORMATION")
    print("=" * 60)

    print(f"OSM ID      : {road.get('osm_id')}")
    print(f"Road Name   : {road.get('name') or '(Unnamed)'}")
    print(f"Road Type   : {highway}")
    print(f"Priority    : {priority}/10")

    print("\nUseful Properties")
    print("-" * 60)

    useful = [
        "highway",
        "name",
        "surface",
        "maxspeed",
        "lanes",
        "oneway",
        "bridge",
        "tunnel",
        "access",
        "junction",
        "service",
        "tracktype",
        "smoothness",
        "layer",
        "z_order",
    ]

    for key in useful:
        value = road.get(key)
        if value is not None:
            print(f"{key:15}: {value}")

    print("\nOther Available Properties")
    print("-" * 60)

    for key, value in road.items():
        if value is not None and key not in useful and key not in ("way", "osm_id"):
            print(f"{key:15}: {value}")
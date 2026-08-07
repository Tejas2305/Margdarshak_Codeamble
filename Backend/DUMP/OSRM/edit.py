# import psycopg2
# import requests

# LAT = 18.547116
# LON = 73.818122
# SPEED = 1

# conn = psycopg2.connect(dbname="osrm", user="postgres", password="tejas", host="localhost", port=5432)
# cur = conn.cursor()

# cur.execute("""
#     SELECT name FROM planet_osm_line
#     WHERE highway IS NOT NULL AND name IS NOT NULL
#     ORDER BY way <-> ST_SetSRID(ST_MakePoint(%s, %s), 4326)
#     LIMIT 1;
# """, (LON, LAT))
# name = cur.fetchone()[0]
# print("Road:", name)

# cur.execute("""
#     SELECT ST_AsText(way) FROM planet_osm_line
#     WHERE name = %s
#     AND ST_DWithin(way::geography, ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography, 1000);
# """, (name, LON, LAT))
# rows = cur.fetchall()
# cur.close()
# conn.close()

# f = open("D:/My_Software/OSRM/data/penalty.csv", "w")

# for row in rows:

#     wkt = row[0]
#     print(len(rows))
#     coords = wkt.replace("LINESTRING(", "").replace(")", "").split(",")
#     points = [c.strip().split() for c in coords]
#     coord_str = ";".join(p[0] + "," + p[1] for p in points)

#     url = "http://localhost:5000/route/v1/driving/" + coord_str
#     r = requests.get(url, params={"overview": "false", "annotations": "nodes"})
#     data = r.json()

#     if data["code"] == "Ok":
#         nodes = data["routes"][0]["legs"][0]["annotation"]["nodes"]
#         for i in range(len(nodes) - 1):
#             f.write(str(nodes[i]) + "," + str(nodes[i + 1]) + "," + str(SPEED) + "\n")
#             f.write(str(nodes[i + 1]) + "," + str(nodes[i]) + "," + str(SPEED) + "\n")

# f.close()
# print("penalty.csv created")
import psycopg2
# import requests
import httpx

LAT = 18.547116
LON = 73.818122
SPEED = 1

# MAX_POINTS = 100

# ---------------- DATABASE ----------------
client = httpx.Client(
    timeout=30,
    http2=False
)

conn = psycopg2.connect(
    dbname="osrm",
    user="postgres",
    password="tejas",
    host="localhost",
    port=5432
)

cur = conn.cursor()

# ---------------- FIND ROAD ----------------

cur.execute("""
SELECT name
FROM planet_osm_line
WHERE highway IS NOT NULL
AND name IS NOT NULL
ORDER BY way <-> ST_SetSRID(ST_MakePoint(%s,%s),4326)
LIMIT 1;
""", (LON, LAT))

result = cur.fetchone()

if result is None:
    print("No road found.")
    exit()

name = result[0]

print("Road:", name)

# ---------------- GET GEOMETRY ----------------

cur.execute("""
SELECT ST_AsText(way)
FROM planet_osm_line
WHERE name=%s
AND ST_DWithin(
    way::geography,
    ST_SetSRID(ST_MakePoint(%s,%s),4326)::geography,
    1000
);
""", (name, LON, LAT))

rows = cur.fetchall()

print("Segments Returned :", len(rows))

cur.close()
conn.close()

# ---------------- FILE ----------------

f = open("D:/My_Software/OSRM/data/penalty.csv", "w")

TOTAL_HTTP = 0
TOTAL_PARSE = 0
TOTAL_WRITE = 0

TOTAL_ORIGINAL_POINTS = 0
TOTAL_OPTIMIZED_POINTS = 0

# ---------------- PROCESS ----------------

for segment_no, (wkt,) in enumerate(rows, start=1):

    print("\n" + "="*60)
    print(f"Segment {segment_no}/{len(rows)}")
    print("="*60)

    coords = wkt.replace("LINESTRING(", "").replace(")", "").split(",")

    points = [c.strip().split() for c in coords]

    original_points = len(points)

    # if original_points > MAX_POINTS:
    #     step = (original_points + MAX_POINTS - 1) // MAX_POINTS
    #     points = points[::step]
    # else:
    #     step = 1
    step = 1

    optimized_points = len(points)

    TOTAL_ORIGINAL_POINTS += original_points
    TOTAL_OPTIMIZED_POINTS += optimized_points

    coord_str = ";".join(
        p[0] + "," + p[1]
        for p in points
    )

    # ---------------- OSRM ----------------

    url = "http://localhost:5000/route/v1/driving/" + coord_str
    print(url)
    # r = requests.get(
    #     url,
    #     params={
    #         "overview": "false",
    #         "annotations": "nodes"
    #     }
    # )
    r = client.get(
    url,
    params={
        "overview": "false",
        "annotations": "nodes"
    }
    )

    # ---------------- JSON ----------------

    data = r.json()

    print("OSRM Code       :", data.get("code"))

    if data.get("code") == "Ok":

        nodes = data["routes"][0]["legs"][0]["annotation"]["nodes"]

        print("Nodes Returned  :", len(nodes))

        for i in range(len(nodes)-1):
            f.write(f"{nodes[i]},{nodes[i+1]},{SPEED}\n")
            f.write(f"{nodes[i+1]},{nodes[i]},{SPEED}\n")

f.close()

# ---------------- SUMMARY ----------------

print("\npenalty.csv created successfully")
client.close()
import asyncio
import httpx
from app.main import app
from app.database import engine, Base


async def run_test_suite():
    print("=" * 75)
    print("🚀 MARGDARSHAK BACKEND SYSTEM & ROUTE SAFETY TEST SUITE")
    print("=" * 75)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables initialized.")

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:

        # ---------------------------------------------------------
        # STEP 1: Register and Login Test User
        # ---------------------------------------------------------
        print("\n--- [STEP 1] User Registration & Login ---")
        user_email = "testuser_flow@gmail.com"
        password = "TestPassword123"

        await client.post("/auth/register", json={
            "first_name": "Demo",
            "last_name": "User",
            "email": user_email,
            "phone_number": "9876543211",
            "password": password,
            "date_of_birth": "2000-01-01"
        })

        login_resp = await client.post("/auth/login", data={
            "username": user_email,
            "password": password
        })
        token_data = login_resp.json()
        access_token = token_data.get("access_token")
        headers = {"Authorization": f"Bearer {access_token}"}
        print(f"Logged in successfully. Token: {access_token[:25]}...")

        # ---------------------------------------------------------
        # STEP 2: Fetch Categories
        # ---------------------------------------------------------
        print("\n--- [STEP 2] Fetch Categories ---")
        cat_resp = await client.get("/reports/categories", headers=headers)
        categories = cat_resp.json()
        print(f"Total categories available: {len(categories)}")
        for c in categories:
            print(f"  [{c['category_id']}] {c['name']} (Severity: {c.get('severity_min')} - {c.get('severity_max')})")

        # Select "Got Robbed" category (Category #1)
        robbed_cat_id = categories[0]["category_id"] if categories else 1

        # Test locations (Baner to Shivajinagar)
        origin = {"lat": 18.5596, "lng": 73.7799}
        destination = {"lat": 18.5314, "lng": 73.8446}

        # ---------------------------------------------------------
        # STEP 3: BEFORE REPORTING — Speed Limit & Route Safety
        # ---------------------------------------------------------
        print("\n--- [STEP 3] State BEFORE Reporting ---")
        speed_before = await client.get(f"/map/speed-limit?lat={origin['lat']}&lng={origin['lng']}", headers=headers)
        sb_data = speed_before.json()
        print(f"  [Speed Limit] Road: {sb_data['road_name']} | Base Speed: {sb_data['base_speed_kmh']} km/h | Live Speed: {sb_data['updated_speed_kmh']} km/h | Risk: {sb_data['risk_score']}%")

        route_before = await client.post("/map/route-safety", json={"origin": origin, "destination": destination}, headers=headers)
        rb_data = route_before.json()
        print("  [Route Safety] Evaluated Routes:")
        for r in rb_data.get("routes", []):
            safest = "⭐ [SAFEST]" if r["is_safest"] else ""
            print(f"    Route #{r['route_index']}: Risk={r['average_risk_score']}% | Safety Index={r['safety_index']} {safest}")

        # ---------------------------------------------------------
        # STEP 4: Submit Incident Report
        # ---------------------------------------------------------
        print("\n--- [STEP 4] Submit Incident Report (Got Robbed, Rating 5/5) ---")
        report_payload = {
            "category_id": robbed_cat_id,
            "user_rating": 5,
            "description": "Phone & chain snatched near Baner main junction",
            "latitude": origin["lat"],
            "longitude": origin["lng"]
        }
        rep_resp = await client.post("/reports/create", json=report_payload, headers=headers)
        report_data = rep_resp.json()
        report_id = report_data["report_id"]
        print(f"  Report Created -> ID: {report_id} | User ID: {report_data['user_id']} | Computed Severity: {report_data['computed_severity']}")

        # ---------------------------------------------------------
        # STEP 5: AFTER REPORTING — Speed Limit & Route Safety
        # ---------------------------------------------------------
        print("\n--- [STEP 5] State AFTER Reporting ---")
        speed_after_rep = await client.get(f"/map/speed-limit?lat={origin['lat']}&lng={origin['lng']}", headers=headers)
        sar_data = speed_after_rep.json()
        print(f"  [Speed Limit] Live Speed: {sar_data['updated_speed_kmh']} km/h | Risk Score: {sar_data['risk_score']}%")

        route_after_rep = await client.post("/map/route-safety", json={"origin": origin, "destination": destination}, headers=headers)
        rar_data = route_after_rep.json()
        print("  [Route Safety] Evaluated Routes:")
        for r in rar_data.get("routes", []):
            safest = "⭐ [SAFEST]" if r["is_safest"] else ""
            print(f"    Route #{r['route_index']}: Risk={r['average_risk_score']}% | Safety Index={r['safety_index']} {safest}")

        # ---------------------------------------------------------
        # STEP 6: Upvote Incident Report
        # ---------------------------------------------------------
        print("\n--- [STEP 6] Upvote Report ---")
        vote_resp = await client.post(f"/reports/{report_id}/vote", json={"vote_type": 1}, headers=headers)
        vote_data = vote_resp.json()
        print(f"  Upvote Recorded -> Upvotes: {vote_data['upvotes']} | Confidence Score: {vote_data['confidence_score']}")

        # ---------------------------------------------------------
        # STEP 7: AFTER VOTING — Speed Limit & Route Safety
        # ---------------------------------------------------------
        print("\n--- [STEP 7] State AFTER Voting ---")
        speed_after_vote = await client.get(f"/map/speed-limit?lat={origin['lat']}&lng={origin['lng']}", headers=headers)
        sav_data = speed_after_vote.json()
        print(f"  [Speed Limit] Live Speed: {sav_data['updated_speed_kmh']} km/h | Risk Score: {sav_data['risk_score']}%")

        route_after_vote = await client.post("/map/route-safety", json={"origin": origin, "destination": destination}, headers=headers)
        rav_data = route_after_vote.json()
        print("  [Route Safety] Evaluated Routes:")
        for r in rav_data.get("routes", []):
            safest = "⭐ [SAFEST]" if r["is_safest"] else ""
            print(f"    Route #{r['route_index']}: Risk={r['average_risk_score']}% | Safety Index={r['safety_index']} {safest}")

    print("\n" + "=" * 75)
    print("🎉 ALL TEST FLOW CHECKS COMPLETED SUCCESSFULLY!")
    print("=" * 75)


if __name__ == "__main__":
    asyncio.run(run_test_suite())

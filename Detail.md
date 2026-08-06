# Margdarshak API Tracker — Detailed

## List 1 — Completed APIs

### POST /auth/register
**Purpose:** Create a new user account.
**Request:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone_number": "string | null",
  "password": "string",
  "date_of_birth": "date | null"
}
```
**Response:** User created confirmation.
**Status:** Done

### POST /auth/login
**Purpose:** Authenticate user, return access + refresh tokens.
**Request:** `application/x-www-form-urlencoded` — `username` (email), `password`.
**Response:**
```json
{ "access_token": "string", "refresh_token": "string|null", "token_type": "bearer" }
```
**Status:** Done

### POST /auth/refresh
**Purpose:** Exchange a valid refresh token for a new access token.
**Request:** `{ "refresh_token": "string" }`
**Response:** Same shape as login (`AuthResponse`).
**Status:** Done

### POST /auth/logout
**Purpose:** Invalidate the given refresh token so it can't be reused.
**Request:** `{ "refresh_token": "string" }`
**Status:** Done

### GET /users/me
**Purpose:** Return the logged-in user's profile. Requires bearer token.
**Status:** Done

### PUT /users/me
**Purpose:** Update profile fields.
**Request:** `{ first_name?, last_name?, phone_number?, date_of_birth?, profile_picture? }` — all optional/partial update.
**Status:** Done

### DELETE /users/me
**Purpose:** Delete the current user's account. Requires bearer token.
**Status:** Done

### PUT /users/change-password
**Purpose:** Change password while logged in.
**Request:** `{ "current_password": "string", "new_password": "string" }`
**Status:** Done

**8 / 8 done** — Auth + core user profile module.

---

## List 2 — Pending APIs (by priority)

### High

**GET /reports/categories**
- Purpose: Return the list of incident categories (Theft, Harassment, Accident, Poor Lighting, Animal Threat, etc.) so the frontend can populate the report-type dropdown.
- Response: `[{ id, name, icon, description }]`
- Note: needed before report creation can work — feed this in first even though it's a simple static/seeded table.

**POST /reports/create**
- Purpose: Submit a new incident report.
- Request: `{ category_id, description, location: { lat, lng }, photos: [url], is_anonymous: bool }`
- Response: `{ report_id, status: "pending" }`
- Should store: user (nullable if anonymous), description, location, category, anonymous flag, created_at.

**POST /reports/upload-photo**
- Purpose: Upload one or more incident photos, return their URLs (Cloudinary or similar).
- Request: multipart FormData with image file(s).
- Response: `{ urls: [string] }`
- Called before/alongside `/reports/create` — frontend uploads photos first, then sends URLs in the create payload.

**GET /reports/my-reports**
- Purpose: Return all reports submitted by the current user, paginated.
- Query params: `page`, `limit`.
- Response: `{ reports: [{ id, category, description, location, status, created_at }], total, page }`
- **Status field lives here** — no separate `/reports/{id}/status` endpoint needed; each report object in the list already carries its current status (pending / reviewed / approved / resolved).

**POST /map/route-safety**
- Purpose: Analyze a single route's safety between an origin and destination.
- Request: `{ origin: { lat, lng }, destination: { lat, lng } }`
- Uses: OSRM for routing, PostGIS + incident DB for risk scoring.
- Response: `{ safety_score, dangerous_points: [...], warnings: [...] }`
- This is the core "Margdarshak" feature — the route safety guidance.

### Medium

**GET /user/emergency-contacts**
- Purpose: List all saved emergency contacts for the current user.
- Response: `[{ id, name, phone, relationship }]`

**POST /user/emergency-contacts**
- Purpose: Add a new emergency contact.
- Request: `{ name, phone, relationship }`

**PUT /user/emergency-contacts/{id}**
- Purpose: Edit an existing contact's details.
- Request: same shape as POST, partial update allowed.

**DELETE /user/emergency-contacts/{id}**
- Purpose: Remove a contact by id.

**POST /map/safety-check**
- Purpose: Check the safety of a single point (e.g. current location).
- Request: `{ lat, lng }`
- Response: `{ safety_score, nearby_incidents, risk_level }`

**POST /map/compare-routes**
- Purpose: Compare multiple candidate routes and highlight the safest.
- Request: `{ routes: [{ origin, destination, waypoints? }] }`
- Response: array of routes each with a safety score (e.g. Route A 82%, Route B 61%, Route C 90%) — frontend highlights the safest.

**GET /map/incidents/nearby**
- Purpose: Return incidents within a radius of a given point.
- Query params: `lat`, `lng`, `radius` (in **meters** — e.g. 500, 1000, 5000).
- Response: `{ incidents: [{ id, type, location, time, severity, distance }] }`

**GET /search/places**
- Purpose: Search for locations by free-text query (e.g. "Pune Railway Station", "MIT WPU").
- To be backed by OSRM/Nominatim for the demo (per your note) rather than Google Places.
- Response: `[{ place_id, name, lat, lng }]`

**GET /places/safety-score**
- Purpose: Return the safety score for a specific searched/selected place.
- Query param: `place_id` (or lat/lng).
- Response: `{ score, description }`

**POST /sos/trigger**
- Purpose: User presses the SOS button — save the SOS event.
- Request: `{ location: { lat, lng }, emergency_type? }`
- Response: `{ sos_id, timestamp }`
- Backend should just persist this (save SOS + location + timestamp); actual contact notification is a separate, skipped endpoint (`/sos/notify-contacts`).

### Least

**GET /user/safety-score**
- Purpose: Calculate/return the current user's overall safety score.
- Response: `{ score, percentage, description }`
- Depends on: routes taken, nearby reported incidents, safe-travel %, SOS history.

**GET /user/safety-trends**
- Purpose: Return a weekly/monthly trend series for charting.
- Response: `{ weekly: [80, 81, 82, 78, 85, 87, 90] }` (or `monthly`, via query param).

**GET /map/zones**
- Purpose: Return safe/danger zones as heatmaps or polygons for map overlay.
- Response: array of polygons/regions with a risk color/level.

**GET /sos/history**
- Purpose: Return the user's past SOS activations.
- Response: `[{ sos_id, location, timestamp }]`

**GET /community/reports**
- Purpose: Public, anonymized feed of nearby reports (not just the user's own).
- Query params: `lat`, `lng`, `radius`.
- Response: `[{ type, time_ago, distance }]` — e.g. "Phone Snatching, 2 hours ago, 0.8 km away".

**25 pending** across high/medium/least/optional.

### Optional (mock or skip for the 3-day hackathon demo, revisit after)

**POST /auth/send-otp**
- Purpose: Send a one-time code to the user's email (signup, email change, forgot password).
- Request: `{ email }` → Response: `{ message: "OTP sent successfully" }`
- For the demo: hardcode a fixed OTP server-side instead of wiring real SMTP.

**POST /auth/verify-otp**
- Purpose: Verify the OTP entered by the user.
- Request: `{ email, otp }` → Response: `{ verified: true }`

**POST /auth/forgot-password**
- Purpose: Generate a password reset token/OTP for a given email.
- Request: `{ email }`

**POST /auth/reset-password**
- Purpose: Set a new password using the reset token.
- Request: `{ email, token, new_password }`

**Google OAuth Login**
- Purpose: Authenticate via Google Sign-In, return the same JWT + refresh token shape as regular login.

---

## Explicitly skipped (confirmed, not building)

- **POST /sos/notify-contacts** — send alerts (SMS/push/WhatsApp) to emergency contacts on SOS trigger.
- **POST /places/rate** — star-rating a location's perceived safety.
- **POST /analytics/track** — generic usage-event logging (opened map, triggered SOS, etc.).
- **POST /users/upload-profile-photo** — dedicated profile picture upload (Cloudinary).
- **GET /admin/reports/pending**, **PUT /admin/reports/{id}/status** — report moderation queue.
- **GET /admin/users**, **PUT /admin/users/{id}/block** — user management/blocking.
- **Doc2-only extras:** settings (notifications/location-tracking/night-mode/auto-alert), theme preference, language preference, push notification token registration, in-app notifications (get/mark-read), recent searches (get/save/delete), phone number verification.

---

## Progress

- **Done:** 8 / 33 tracked APIs (~24%)
- **Days remaining:** 3
- **Demo-critical path (high + medium, 15 APIs):** 0 / 15 done — this is what to clear first
- Optional category (5 APIs) can be mocked/hardcoded for the demo without spending build time on real integration

**Totals:** 8 done, 25 pending (5 high, 10 medium, 5 least, 5 optional), 13 skipped.
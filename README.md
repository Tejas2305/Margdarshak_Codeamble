# Margdarshak API Tracker

## List 1 — Completed APIs

| API | Status | Taken By |
|---|---|---|
| POST /auth/register | Done | Tanishka |
| POST /auth/login | Done | Tanishka |
| POST /auth/refresh | Done | Tanishka |
| POST /auth/logout | Done | Tanishka |
| GET /users/me | Done | Tanishka |
| PUT /users/me | Done | Tanishka |
| DELETE /users/me | Done | Tanishka |
| PUT /users/change-password | Done | Tanishka |

**8 / 8 done** — Auth + core user profile module.

---

## List 2 — Pending APIs (by priority)

### High

| API | Status | Taken By |
|---|---|---|
| GET /reports/categories | Done | Tejas |
| POST /reports/create | Pending | Tejas |
| POST /reports/upload-photo | Pending | |
| GET /reports/my-reports *(includes status inline, no separate /status endpoint)* | Pending | |
| POST /map/route-safety | Pending | |

**1 / 5 done**

### Medium

| API | Status | Taken By |
|---|---|---|
| GET /user/emergency-contacts | Done | Tejas |
| POST /user/emergency-contacts | Done | Tejas |
| PUT /user/emergency-contacts/ | Done | Tejas |
| DELETE /user/emergency-contacts/ | Done | Tejas |
| POST /map/safety-check | Pending | |
| POST /map/compare-routes | Pending | |
| GET /map/incidents/nearby *(radius in meters param)* | Pending | |
| GET /search/places *(OSRM-enabled)* | Pending | |
| GET /places/safety-score | Pending | |
| POST /sos/trigger | Pending | |

**4 / 10 done**

### Least

| API | Status | Taken By |
|---|---|---|
| GET /user/safety-score | Pending | |
| GET /user/safety-trends | Pending | |
| GET /map/zones | Pending | |
| GET /sos/history | Pending | |
| GET /community/reports | Pending | |

**0 / 5 done**

### Optional (mock or skip for the 3-day hackathon demo, revisit after)

| API | Status | Taken By |
|---|---|---|
| POST /auth/send-otp | Pending | |
| POST /auth/verify-otp | Pending | |
| POST /auth/forgot-password | Pending | |
| POST /auth/reset-password | Pending | |
| Google OAuth Login | Pending | |

**0 / 5 done**

## Explicitly skipped (confirmed, not building)

- POST /sos/notify-contacts
- POST /places/rate
- POST /analytics/track
- POST /users/upload-profile-photo
- GET /admin/reports/pending
- PUT /admin/reports/{id}/status
- GET /admin/users
- PUT /admin/users/{id}/block
- All doc2-only extras: settings, theme/language prefs, notifications, recent-searches, phone verification

---

**Totals:** 13 done (8 auth/profile + 1 high + 4 medium), 20 pending (4 high, 6 medium, 5 least, 5 optional), 13 skipped.

## Progress

- **Done:** 13 / 33 tracked APIs (~39%)
- **Days remaining:** 3
- **Demo-critical path (high + medium, 15 APIs):** 5 / 15 done — this is what to clear first
- Optional category (5 APIs) can be mocked/hardcoded for the demo without spending build time on real integration
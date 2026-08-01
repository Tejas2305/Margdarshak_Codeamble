# Margdarshak - Screen Flow Guide

## 📱 Complete App Navigation

### Authentication Flow
```
1. SPLASH SCREEN (2 seconds)
   ↓
2. ONBOARDING (3 slides, swipeable)
   - Slide 1: Safety First 🛡️
   - Slide 2: Real-time Alerts ⚡
   - Slide 3: Community Driven 🤝
   ↓
3. AUTH LANDING
   - "Get Started" → Register
   - "Log In" → Login
   ↓
4a. REGISTER                    4b. LOGIN
   - Full name                    - Email
   - Email                        - Password
   - Phone                        - "Forgot Password?" → Forgot Flow
   - Password                     ↓
   - Confirm password             [Login Success]
   ↓                              ↓
5. OTP VERIFICATION              MAIN APP
   - Enter 6-digit code          ↓
   ↓                             
6. PERMISSIONS
   - Location access
   ↓
7. SUCCESS
   - "Account Created!"
   - Auto-redirect (3s) or "Get Started" button
   ↓
   MAIN APP
```

### Forgot Password Flow
```
LOGIN → "Forgot Password?"
   ↓
FORGOT PASSWORD
   - Enter email
   ↓
OTP VERIFICATION
   - Enter 6-digit code
   ↓
RESET PASSWORD
   - New password
   - Confirm password
   ↓
SUCCESS
   - "Password Reset!"
   - Redirect to Login
```

---

## 🏠 Main App Structure

### Bottom Navigation (4 Tabs)
```
┌─────────────────────────────────────────┐
│         Main Tab Navigator              │
├─────────┬─────────┬──────────┬─────────┤
│  🗺️ Map │ 📝 Reports│ 📊 Dashboard│ 🚨 SOS │
│  (Home) │          │          │         │
└─────────┴─────────┴──────────┴─────────┘
```

### Map Screen (Home) - Main Hub
```
MAP SCREEN
├─ Search Bar "Where to?" → [SEARCH SCREEN]
├─ Settings button ⚙️ → [SETTINGS SCREEN]
├─ Emergency button 🚨 → [SOS SCREEN]
├─ Safety Score Card
│  └─ "Compare Routes" → [ROUTE COMPARISON SCREEN]
└─ Nearby Incidents (bottom sheet)
```

### Full Stack Navigation
```
MAIN TABS (Bottom)
│
├─ Map Tab
│  ├─ Map Screen (Home)
│  ├─ Search Screen (overlay)
│  ├─ Route Comparison (overlay)
│  └─ Settings (overlay)
│
├─ Reports Tab
│  └─ Reports Screen
│     └─ (Submit incident form)
│
├─ Dashboard Tab
│  └─ Dashboard Screen
│     └─ (Safety metrics, alerts, contacts)
│
└─ SOS Tab
   └─ SOS Screen
      └─ (Emergency activation)
```

---

## 🎨 Screen Details

### 1. Map Screen (Home) 🗺️
**Location:** Bottom Tab 1
```
┌─────────────────────────────┐
│ 🔍 Search: "Where to?"  ⚙️  │ ← Top bar
├─────────────────────────────┤
│                             │
│    [Interactive Map]        │
│    • Safety markers         │
│    • Incident pins          │
│    • User location          │
│                       🚨    │ ← Emergency
│                       📍    │ ← My Location
│                             │
├─────────────────────────────┤
│ Current Area Safety         │
│ 8.9/10 ⚫ Very Safe         │
│ Compare Routes →            │
├─────────────────────────────┤
│ Nearby Incidents ━━         │ ← Bottom sheet
│ [🚧 Road Work] [🚓 Patrol] │
└─────────────────────────────┘
```

### 2. Reports Screen 📝
**Location:** Bottom Tab 2
```
┌─────────────────────────────┐
│ Report Incident             │
├─────────────────────────────┤
│ What happened?              │
│ ┌──────┬──────┬──────┐     │
│ │ 🚨   │ ⚠️   │ 👁️   │     │
│ │Theft │Harass│Suspi │     │
│ └──────┴──────┴──────┘     │
│ ┌──────┬──────┬──────┐     │
│ │ 🚗   │ 🚧   │ 🔥   │     │
│ │Accid │Block │ Fire │     │
│ └──────┴──────┴──────┘     │
│                             │
│ Location: 📍 Current        │
│ Description: [Text Area]    │
│ Photos: [📷 Add]            │
│ 🕵️ Anonymous [Toggle]       │
│ [Submit Report]             │
└─────────────────────────────┘
```

### 3. Dashboard Screen 📊
**Location:** Bottom Tab 3
```
┌─────────────────────────────┐
│ Safety Dashboard        ⚙️  │
├─────────────────────────────┤
│ Personal Safety Score       │
│     ┌─────────┐             │
│     │   850   │             │
│     │  /1000  │             │
│     └─────────┘             │
│ Excellent! 85% safe         │
├─────────────────────────────┤
│ 🌙 Night Mode [Toggle]      │
├─────────────────────────────┤
│ Safety Trends [Week][Month] │
│ [Bar Chart]                 │
├─────────────────────────────┤
│ Recent Alerts               │
│ • High Crime Area           │
│ • Road Closure              │
├─────────────────────────────┤
│ Emergency Contacts          │
│ 🚓 Police  🚑 Ambulance     │
│ 🚒 Fire    👮 Women Helpline│
└─────────────────────────────┘
```

### 4. SOS Screen 🚨
**Location:** Bottom Tab 4
```
┌─────────────────────────────┐
│ Emergency SOS               │
├─────────────────────────────┤
│                             │
│       ┌─────────┐           │
│       │   🚨    │           │
│       │   SOS   │           │ ← Pulse animation
│       │Press&Hold│          │
│       └─────────┘           │
│                             │
├─────────────────────────────┤
│ Quick Actions               │
│ 🚓 Police  🚑 Ambulance 🚒 │
│   100        102      101   │
├─────────────────────────────┤
│ When activated:             │
│ 📞 Calls emergency          │
│ 📍 Shares location          │
│ 📱 Alerts contacts          │
│ 🎥 Records audio/video      │
└─────────────────────────────┘
```

### 5. Route Comparison Screen 🧭
**Location:** Stack (from Map → "Compare Routes")
```
┌─────────────────────────────┐
│ ← Compare Routes            │
├─────────────────────────────┤
│    [Map with 3 Routes]      │
│    • Green (Safest)         │
│    • Gray (Fastest)         │
│    • Blue (Balanced)        │
│                             │
├─────────────────────────────┤
│ [Horizontal Scroll Cards]   │
│ ┌─────────────────────┐    │
│ │ Safest Route ✓      │    │
│ │ ⚫ 9.5/10           │    │
│ │ 📏 5.2 km  ⏱️ 18m  │    │
│ │ • Well-lit streets  │    │
│ │ • High patrol       │    │
│ └─────────────────────┘    │
├─────────────────────────────┤
│ 🧭 [Start Navigation]      │
└─────────────────────────────┘
```

### 6. Search Screen 🔍
**Location:** Stack (from Map → Search Bar)
```
┌─────────────────────────────┐
│ ← 🔍 [Search input...]   ✕ │
├─────────────────────────────┤
│ Categories                  │
│ 🏥 🚓 🛡️ 🏨 🍽️ 🏧          │
│                             │
│ Recent Searches             │
│ • 🏬 Downtown Mall          │
│ • 🌳 Central Park           │
│                             │
│ Popular Places              │
│ 🏥 City Hospital            │
│    123 Main St • 2.5 km     │
│    🛡️ 9.2/10               │
│                             │
│ 🏬 Central Mall             │
│    456 Shopping • 1.8 km    │
│    🛡️ 8.7/10               │
│                             │
│ 💡 Safety Tip               │
│    Always check safety score│
└─────────────────────────────┘
```

### 7. Settings Screen ⚙️
**Location:** Stack (from Map → ⚙️ button)
```
┌─────────────────────────────┐
│ ← Settings                  │
├─────────────────────────────┤
│ 👤 John Doe                 │
│    john.doe@example.com  ✏️ │
├─────────────────────────────┤
│ Privacy & Safety            │
│ 🔔 Notifications [Toggle]   │
│ 📍 Location Tracking [On]   │
│ 🌙 Night Mode Alerts [Off]  │
│ 🚨 Auto Alert [Off]         │
│                             │
│ Emergency Contacts          │
│ 👨‍👩‍👧‍👦 Manage Contacts →      │
│                             │
│ Data & Privacy              │
│ 📊 Share Data [Toggle]      │
│ 🔒 Privacy Policy →         │
│ 📜 Terms of Service →       │
│                             │
│ App Settings                │
│ 🌍 Language: English →      │
│ 🎨 Theme: Light →           │
│ 💾 Storage: 128 MB →        │
│                             │
│ About                       │
│ ℹ️ Version: 1.0.0           │
│ ⭐ Rate Us →                │
│ 💬 Feedback →               │
│                             │
│ Danger Zone                 │
│ [🚪 Logout]                 │
│ [⚠️ Delete Account]         │
└─────────────────────────────┘
```

---

## 🎯 User Journey Examples

### Journey 1: First Time User
```
Download App
   ↓
Splash Screen (2s)
   ↓
Onboarding (swipe 3 slides)
   ↓
Auth Landing → "Get Started"
   ↓
Register (fill form)
   ↓
OTP Verification
   ↓
Location Permission
   ↓
Success Screen
   ↓
🗺️ MAP SCREEN (MAIN APP)
```

### Journey 2: Report Incident
```
Open App (logged in)
   ↓
📝 Reports Tab
   ↓
Select "Theft" category
   ↓
Current location auto-filled
   ↓
Type description
   ↓
Add photo (optional)
   ↓
Enable "Anonymous"
   ↓
Submit Report
   ↓
✅ Confirmation
```

### Journey 3: Find Safe Route
```
🗺️ Map Tab
   ↓
Tap "Compare Routes"
   ↓
🧭 Route Comparison Screen
   ↓
View 3 routes on map
   ↓
Select "Safest Route" (9.5/10)
   ↓
Review features:
   - Well-lit streets
   - High patrol
   ↓
Tap "Start Navigation"
   ↓
Follow route on map
```

### Journey 4: Emergency SOS
```
🚨 SOS Tab
   ↓
Press & Hold SOS button
   ↓
5-second countdown
   (can cancel)
   ↓
[Countdown reaches 0]
   ↓
✅ SOS Activated:
   • Emergency services called
   • Location shared
   • Contacts alerted
   • Recording started
```

---

## 📊 Screen Count Summary

**Auth Flow:** 10 screens
- Splash, Onboarding, AuthLanding, Register, Login, ForgotPassword, OTP, ResetPassword, Permissions, Success

**Main App:** 7 screens
- Map, Reports, Dashboard, SOS, RouteComparison, Search, Settings

**Total:** 17 screens (all fully functional with mock data)

---

## 🎨 Design Highlights

- **Primary Color:** #2196F3 (Blue)
- **Success Color:** #4CAF50 (Green)
- **Error Color:** #F44336 (Red)
- **Text:** #1A1A1A (Dark)
- **Background:** #F5F5F5 (Light Gray)
- **Cards:** #FFFFFF with shadows
- **Icons:** Emojis (can replace with icon library later)
- **Animations:** Pulse (SOS button), Gradient (buttons/cards)
- **Typography:** SF Pro (iOS) / Roboto (Android)

---

**All screens are production-ready UI with mock data. Backend integration is the next phase!** 🚀

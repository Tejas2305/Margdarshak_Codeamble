# Margdarshak - How to Run

## Quick Start

### Daily Development (Recommended)
```bash
cd /Users/vedantchandgude/Desktop/MGD/Margdarshak/Frontend/MargdarshakApp
npx expo start
```
Then scan the QR code with Expo Go app on your phone (device ID: 1e48b669).

### Stopping the Server
Press `Ctrl+C` in the terminal, or run:
```bash
pkill -f expo
```

---

## When to Use Which Command

### ✅ `npx expo start` - Light & Fast
**Use for:**
- Daily development
- Code changes (screens, components, logic)
- UI tweaks and styling
- Testing features

**Pros:**
- Fast reload (~2-5 seconds)
- Low system resources
- Easy to stop/restart

### ⚠️ `npx expo run:android` - Heavy
**Use ONLY when:**
- Adding new native packages (react-native-maps, expo-location, etc.)
- Changing native Android code
- Updating `app.json` or `gradle.properties`

**Cons:**
- Takes 5-10 minutes to build
- Uses lots of CPU/RAM (Mac will heat up)
- Rebuilds entire app

---

## Testing Different Modes

### Test Auth Flow (Login/Register)
In `App.tsx`, line 11:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false); // Show auth screens
```

### Test Main App (Map, Dashboard, etc.)
In `App.tsx`, line 11:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(true); // Show main app
```

---

## Project Structure

```
src/
├── screens/
│   ├── auth/              # Login, Register, ForgotPassword, etc.
│   ├── main/              # Map, Reports, Dashboard, SOS, RouteComparison, Search, Settings
│   ├── onboarding/        # Onboarding slides
│   └── permissions/       # Location permission screen
├── components/ui/         # Button, Input, PasswordInput
├── navigation/
│   ├── AuthNavigator.tsx      # Auth flow navigation
│   ├── MainTabNavigator.tsx   # Bottom tabs (Map, Reports, Dashboard, SOS)
│   └── MainStackNavigator.tsx # Main app stack (includes Search, RouteComparison, Settings)
└── theme/                 # Colors, typography, shadows
```

---

## Main App Features

### 🗺️ Map Screen (Home)
- Interactive map with safety markers
- Search bar → Opens Search screen
- Settings button (⚙️) → Opens Settings
- Safety score card (8.9/10)
- Emergency button → Opens SOS
- Nearby incidents list
- "Compare Routes" link → Opens Route Comparison

### 📝 Reports Screen
- 6 incident categories (Theft, Harassment, Suspicious Activity, Accident, Road Block, Fire)
- Location picker
- Description text area
- Photo upload (up to 4 photos)
- Anonymous reporting toggle
- Submit button

### 📊 Dashboard Screen
- Personal safety score (850/1000) with gradient circle
- Night Mode alerts toggle
- Safety trends chart (Weekly/Monthly)
- Recent alerts list
- Emergency contacts (Police, Ambulance, Fire, Women Helpline) with call buttons
- Stats summary (Safe Routes, Reports Filed, Safe Trips)

### 🚨 SOS Screen
- Large emergency SOS button with pulse animation
- 5-second countdown when activated
- Cancel option
- Quick action buttons (Police 100, Ambulance 102, Fire 101)
- Features list (calls emergency, shares location, alerts contacts, records audio/video)
- False alarm warning

### 🧭 Route Comparison Screen
- Interactive map with 3 routes:
  - **Safest Route** (9.5/10, green)
  - **Fastest Route** (4.2/10, gray)
  - **Balanced Route** (7.8/10, blue)
- Route cards with safety scores
- Distance and ETA for each route
- Feature lists (well-lit, patrol, CCTV, etc.)
- "Start Navigation" button

### 🔍 Search Screen
- Search bar with auto-focus
- Categories (Hospitals, Police Stations, Safe Zones, Hotels, Restaurants, ATMs)
- Recent searches
- Popular places with safety scores and distance
- Empty state for no results
- Safety tips card

### ⚙️ Settings Screen
- User profile with avatar
- Privacy & Safety toggles:
  - Notifications
  - Location Tracking
  - Night Mode Alerts
  - Auto Emergency Alert
  - Share Anonymous Data
- Emergency contacts management
- Data & Privacy (Privacy Policy, Terms of Service)
- App settings (Language, Theme, Storage)
- About section (Version, Rate Us, Feedback, Help)
- Danger zone (Logout, Delete Account)

---

## Navigation Flow

```
Auth Flow:
Splash → Onboarding → AuthLanding → Register/Login → Permissions → Success → Main App

Main App:
├── Bottom Tabs
│   ├── Map (Home)
│   ├── Reports
│   ├── Dashboard
│   └── SOS
└── Stack Screens
    ├── Search (from Map search bar)
    ├── RouteComparison (from Map "Compare Routes")
    └── Settings (from Map ⚙️ button)
```

---

## Mock Data

All screens use mock data (no backend). Examples:
- Safety scores: 8.9/10, 9.5/10, 4.2/10
- Incidents: Road Work, Patrol, Accident, Theft
- Emergency contacts: Police 100, Ambulance 102, Fire 101
- Popular places: City Hospital, Central Mall, University Campus
- User data: John Doe, john.doe@example.com

---

## Known Features (Frontend Only)

✅ Complete auth flow (8 screens)
✅ 7 main app screens with full UI
✅ Bottom tab navigation
✅ Stack navigation for overlays
✅ Interactive maps with markers
✅ Safety score visualizations
✅ Chart visualization (weekly trends)
✅ Form inputs with validation UI
✅ Photo upload UI
✅ Emergency calling (opens dialer)
✅ Location permissions handling
✅ Smooth animations (pulse, gradient)

⚠️ No backend integration (all mock data)
⚠️ No actual API calls
⚠️ No real-time data
⚠️ No authentication tokens
⚠️ No data persistence (AsyncStorage not implemented yet)

---

## Tips

1. **Metro bundler stuck?** Press `R` to reload, or `Ctrl+C` and restart
2. **App won't load?** Check if Expo Go app is up to date
3. **Mac heating up?** You're probably running `npx expo run:android` - use `npx expo start` instead
4. **Want to test login?** Enter any email/password, it will work (no validation yet)
5. **Settings button location:** Top-right of Map screen (⚙️ icon)

---

## Next Steps (Future Backend Integration)

When ready to connect backend:
1. Replace mock data with API calls
2. Add AsyncStorage for auth tokens
3. Implement actual location tracking
4. Connect to real maps API for safety data
5. Add push notifications for alerts
6. Implement real-time incident reporting
7. Add user authentication with JWT
8. Store user preferences and history

---

**Enjoy building Margdarshak! 🚀**

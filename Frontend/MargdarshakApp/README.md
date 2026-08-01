# Margdarshak - Real-Time Public Safety Navigation App

<div align="center">

🛡️ **Safety First** • ⚡ **Real-time Alerts** • 🤝 **Community Driven**

_A React Native mobile app for safer navigation_

</div>

---

## 📱 What's Built

Complete **frontend-only** mobile app with all main screens and navigation. Uses mock data (no backend integration yet).

### ✅ Authentication Flow (10 Screens)
- Splash screen with auto-navigation
- 3-slide onboarding experience
- Register & Login with full form validation UI
- OTP verification
- Password reset flow
- Location permission request
- Success confirmation with auto-redirect

### ✅ Main App (7 Screens)
1. **🗺️ Map Screen** - Interactive map with safety markers, search, emergency button
2. **📝 Reports Screen** - 6 incident categories, photo upload, anonymous reporting
3. **📊 Dashboard** - Safety score (850/1000), trends chart, alerts, emergency contacts
4. **🚨 SOS Screen** - Emergency activation with countdown, quick action buttons
5. **🧭 Route Comparison** - Compare 3 routes with safety scores (Safest/Fastest/Balanced)
6. **🔍 Search Screen** - Find places with safety ratings, categories, recent searches
7. **⚙️ Settings** - Profile, privacy toggles, app settings, logout

---

## 🚀 Quick Start

### Run the App
```bash
cd /Users/vedantchandgude/Desktop/MGD/Margdarshak/Frontend/MargdarshakApp
npx expo start
```
Then scan the QR code with **Expo Go** app on your Android phone.

### Stop the Server
```bash
# Press Ctrl+C in terminal, or:
pkill -f expo
```

---

## 📚 Documentation

- **[HOW_TO_RUN.md](./HOW_TO_RUN.md)** - Complete guide on running, testing, and commands
- **[SCREEN_FLOW.md](./SCREEN_FLOW.md)** - Visual guide to all 17 screens and navigation
- **[../../../PROJECT_CONTEXT.md](../../../PROJECT_CONTEXT.md)** - Project overview and tech stack

---

## 🏗️ Project Structure

```
src/
├── screens/
│   ├── auth/              # 8 authentication screens
│   ├── main/              # 7 main app screens
│   ├── onboarding/        # Onboarding slides
│   ├── permissions/       # Permission request
│   └── SplashScreen.tsx   # Initial splash
├── components/ui/         # Reusable UI components
├── navigation/
│   ├── AuthNavigator.tsx      # Auth flow
│   ├── MainTabNavigator.tsx   # Bottom tabs
│   └── MainStackNavigator.tsx # Stack overlays
└── theme/                 # Colors, typography, spacing
```

---

## 🎨 Features

### Navigation
- ✅ Bottom tab navigation (Map, Reports, Dashboard, SOS)
- ✅ Stack navigation for overlays (Search, Route Comparison, Settings)
- ✅ Smooth transitions between auth and main app
- ✅ Auto-navigation after successful login/register

### UI Components
- ✅ Custom Button, Input, PasswordInput
- ✅ Theme system with colors, typography, shadows
- ✅ Interactive maps with markers and polylines
- ✅ Safety score visualizations (circles, bars, charts)
- ✅ Gradient cards and animated buttons
- ✅ Form validation UI (error states)

### Mock Data
- Safety scores: 8.9/10, 9.5/10, 4.2/10
- Incidents: Road Work, Patrol, Accident, Theft
- Emergency contacts: Police 100, Ambulance 102, Fire 101
- User: John Doe (john.doe@example.com)

---

## 🧪 Testing

### Test Auth Flow
In `App.tsx`, line 11:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
```
Navigate: Splash → Onboarding → Register/Login → Permissions → Main App

### Test Main App Directly
In `App.tsx`, line 11:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(true);
```
Opens directly to Map screen with bottom tabs

---

## 📦 Tech Stack

- **Framework**: React Native with Expo SDK 57
- **Navigation**: React Navigation v7 (Native Stack + Bottom Tabs)
- **Maps**: react-native-maps + expo-location
- **UI**: Custom components with theme system
- **Animations**: react-native-reanimated, expo-linear-gradient
- **Language**: TypeScript
- **Build Tool**: Expo Development Builds

---

## 🔄 Development Workflow

### Daily Development (Fast ⚡)
Use `npx expo start` for all code changes:
- UI tweaks
- Screen modifications
- Logic updates
- Styling changes

**Reload:** ~2-5 seconds, low resources

### Heavy Build (Slow 🐌)
Use `npx expo run:android` **ONLY** when:
- Adding new native packages
- Changing Android config
- Updating gradle settings

**Build time:** 5-10 minutes, high CPU usage (Mac will heat up)

---

## 📖 Navigation Flow

```
AUTH FLOW:
Splash → Onboarding → AuthLanding → Register/Login → Permissions → Success → Main App

MAIN APP:
├─ Bottom Tabs
│  ├─ Map (Home)
│  ├─ Reports
│  ├─ Dashboard
│  └─ SOS
└─ Stack Screens
   ├─ Search (from Map search bar)
   ├─ RouteComparison (from Map "Compare Routes")
   └─ Settings (from Map ⚙️ button)
```

---

## 🎯 User Journeys

### First Time User
```
Download App → Splash → Onboarding → Register → OTP → Permissions → Map Screen
```

### Report Incident
```
Reports Tab → Select Category → Enter Details → Add Photo → Submit
```

### Find Safe Route
```
Map → "Compare Routes" → View 3 Routes → Select Safest → Start Navigation
```

### Emergency
```
SOS Tab → Press & Hold → 5s Countdown → SOS Activated
```

---

## 🚧 What's NOT Implemented (Backend Phase)

- ❌ Real API calls (all mock data)
- ❌ Authentication tokens / session management
- ❌ Data persistence (AsyncStorage)
- ❌ Real-time location tracking
- ❌ Push notifications
- ❌ Actual emergency service calls
- ❌ Real maps API integration for safety data
- ❌ User-uploaded incident reports
- ❌ Social auth (Google, Apple)

---

## 📱 System Requirements

- **OS**: macOS (for development)
- **Java**: 17 LTS (configured for Gradle)
- **Android SDK**: Platform 34-36
- **Phone**: Android device with USB debugging
- **Internet**: For Expo Go download and Metro bundler

---

## 💡 Tips

1. **Metro bundler stuck?** Press `R` to reload
2. **App won't load?** Update Expo Go app
3. **Mac heating?** You're running heavy build - use `npx expo start` instead
4. **Test login?** Any email/password works (no validation yet)
5. **Settings location?** Top-right ⚙️ button on Map screen

---

## 🤝 Contributing

This is a **frontend-only** phase. Backend integration is the next step.

When ready for backend:
1. Replace mock data with API calls
2. Add AsyncStorage for auth tokens
3. Implement real location tracking
4. Connect to maps API for safety data
5. Add push notifications
6. Implement real emergency service integration

---

## 📄 License

[Add license here]

---

## 👨‍💻 Developer

Built by Vedant Chandgude

---

<div align="center">

**Ready to make communities safer! 🚀**

[View Screen Flow](./SCREEN_FLOW.md) • [How to Run](./HOW_TO_RUN.md) • [Project Context](../../../PROJECT_CONTEXT.md)

</div>

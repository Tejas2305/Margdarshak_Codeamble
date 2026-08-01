# Margdarshak - Real-Time Public Safety Navigation Platform

## Project Overview
Margdarshak is a mobile application focused on real-time public safety navigation. It helps users navigate safely by providing real-time safety information and route optimization.

## Tech Stack

### Frontend
- **Framework**: React Native (Expo with Development Builds)
- **Navigation**: React Navigation v7
- **State Management**: Zustand + React Query
- **UI**: Custom components with theme system
- **Maps**: react-native-maps
- **Location**: react-native-geolocation-service
- **Auth**: JWT, Google OAuth, Apple Sign-In
- **Storage**: AsyncStorage + Encrypted Storage

### Backend
- **Framework**: Python FastAPI
- **Database**: PostgreSQL with PostGIS (Geospatial Extension)
- **Caching**: Redis
- **Routing Engine**: OSRM (Open Source Routing Machine)
- **Authentication**: JWT, Google OAuth, Apple Sign-In

## Project Structure

```
Margdarshak/
├── Frontend/           # React Native Expo app
│   └── MargdarshakApp/
└── Backend/           # Python FastAPI (NOT IN SCOPE YET)
    └── DUMP/         # Experimental/learning code
```

## Current Status
- **Frontend**: In development - Building complete auth/onboarding flow with Expo
- **Backend**: Not started yet - Frontend-only development phase

## Key Features to Implement
1. **Authentication & Onboarding**
   - Splash screen
   - 3-slide onboarding
   - Email/Password registration and login
   - Social auth (Google, Apple)
   - OTP verification
   - Password reset flow
   - Permission requests (Location, Notifications)

2. **Safety Navigation** (Future)
   - Real-time route safety scoring
   - Hazard alerts and warnings
   - Safe route recommendations
   - Live location sharing

3. **User Features** (Future)
   - Profile management
   - Safety preferences
   - Emergency contacts
   - Trip history

## Development Notes
- Using Expo with development builds (not Expo Go) to support native modules
- All native packages (maps, location, permissions) require custom dev builds
- Phone testing via USB debugging (Android device: 1e48b669)
- System: macOS with Java 17, Android SDK Platform 34-36

## Design System
- **Theme**: Dark theme with blue accent (#2196F3)
- **Typography**: System fonts (SF Pro on iOS, Roboto on Android)
- **Spacing**: 8px base unit
- **Components**: Button, Input, PasswordInput, SocialButton, Divider

## Important Commands
```bash
# Start Expo dev server
npx expo start

# Build development build for Android
eas build --profile development --platform android

# Install on connected device
adb install path/to/build.apk

# Run on connected Android device
npx expo run:android
```

## Important Notes
- **Working on Frontend ONLY** - Backend development will come later
- Using USB debugging with Android phone for testing
- No emulators/simulators required - direct device testing

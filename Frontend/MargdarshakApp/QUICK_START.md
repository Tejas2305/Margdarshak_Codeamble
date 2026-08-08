# 🚀 Margdarshak - Quick Start Guide

## Prerequisites Installed ✅
- React Native with Expo
- All required npm packages (573 packages)
- TypeScript configuration
- Environment variables setup

---

## 🏃 Run the App NOW

### Step 1: Start Development Server
```bash
npm start
```

### Step 2: Choose Platform
After the Metro bundler starts, press:
- **`a`** - Run on Android emulator
- **`i`** - Run on iOS simulator
- **Scan QR Code** - Run on physical device with Expo Go app

---

## 📱 Expo Go App (For Physical Device Testing)

### Download Expo Go:
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS:** https://apps.apple.com/app/expo-go/id982107779

### Run on Device:
1. Install Expo Go on your phone
2. Run `npm start` on your computer
3. Scan the QR code with:
   - **Android:** Expo Go app
   - **iOS:** Camera app (opens Expo Go)

---

## 🔑 Important Configuration

### Add Your API Keys (Optional for Testing)
Edit `c:\Users\rudra\Documents\Margdarshak\Frontend\MargdarshakApp\.env`:

```env
# Your Backend API (when ready)
API_BASE_URL=http://YOUR_IP:8000/api

# Google Maps (required for maps to work)
GOOGLE_MAPS_API_KEY=your-api-key-here

# Google OAuth (for Google Sign-In)
GOOGLE_CLIENT_ID_ANDROID=your-id-here
GOOGLE_CLIENT_ID_IOS=your-id-here
```

**Note:** The app will run without these keys, but maps won't display correctly.

---

## 🧪 Current App Status

### ✅ Working Features (No Backend Required)
- All UI screens accessible
- Navigation between screens
- Form inputs and validation
- Map component (needs Google Maps API key)
- Camera access (on device only)
- Photo picker

### 🔄 Needs Backend Connection
- User authentication
- Real-time incident data
- Safety heatmap data
- Route calculation
- User reports submission

### 🔐 Authentication Status
**Currently DISABLED** for testing - you can access all screens directly.

To enable authentication later, edit `App.tsx`.

---

## 📂 Project Structure

```
src/
├── components/ui/         # Button, Input, etc.
├── navigation/            # Screen routing
├── screens/
│   ├── auth/             # Login, Register
│   ├── main/             # Dashboard, Map, Reports, SOS
│   ├── onboarding/       # First-time user flow
│   └── permissions/      # Location/Camera permissions
└── theme/                # Colors, fonts, spacing
```

---

## 🎯 Available Screens

### Authentication Screens (Accessible)
- ✅ Login
- ✅ Register
- ✅ Forgot Password
- ✅ OTP Verification
- ✅ Reset Password

### Main App Screens
- ✅ Dashboard - Home screen with quick actions
- ✅ Map - Interactive safety map
- ✅ Search - Search destinations
- ✅ Route Comparison - Compare safe routes
- ✅ Reports - View incident reports
- ✅ SOS - Emergency mode
- ✅ Settings - App settings

### Support Screens
- ✅ Onboarding - First-time user tutorial
- ✅ Permissions - Request location/camera access
- ✅ Splash Screen - App loading

---

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web (limited functionality)
npm run web

# Clear cache and restart
npx expo start -c
```

---

## 📱 Testing on Physical Device

### Find Your Computer's IP Address:
**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (usually 192.168.x.x)

**Mac/Linux:**
```bash
ifconfig | grep inet
```

### Update API URL:
Replace `localhost` with your IP in `.env`:
```env
API_BASE_URL=http://192.168.1.100:8000/api
```

---

## 🐛 Troubleshooting

### Issue: Metro bundler not starting
**Solution:** Clear cache
```bash
npx expo start -c
```

### Issue: Maps not showing
**Solution:** Add Google Maps API key to `.env`

### Issue: Camera not working in emulator
**Solution:** Test on physical device - camera needs real hardware

### Issue: "Unable to resolve module"
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### Issue: TypeScript errors
**Solution:** Already configured! If you see any, restart VS Code.

---

## 🎨 Customization

### Change Theme Colors
Edit: `src/theme/index.ts`

### Change App Name
Edit: `app.json` - Change "name" and "slug"

### Change Bundle ID
Edit: `app.json` - Change "bundleIdentifier" (iOS) and "package" (Android)

---

## 📦 What's Installed

**Navigation:** React Navigation (Stack, Tabs, Drawer)
**Maps:** React Native Maps + Directions
**State:** Zustand + React Query
**Auth:** JWT + OAuth
**UI:** Custom components + Expo Linear Gradient
**Animations:** Reanimated + Lottie
**Storage:** Async Storage + Secure Store
**Media:** Camera + Image Picker

---

## ✨ Ready to Go!

Everything is set up. Just run:

```bash
npm start
```

And start building your safety navigation app! 🚀

---

**Need help?** Check `SETUP_COMPLETE.md` for detailed information.

# 🚀 Quick Start - Margdarshak App

## ✅ SKIP LOGIN - See All Screens Immediately

Auth flow is **DISABLED** for testing. App goes straight to main screens!

---

## 📱 Run the App (3 Steps)

### Step 1: Connect Phone via USB
```bash
# Check phone is connected
adb devices
```
Should show: `1e48b669	device`

### Step 2: Set up port forwarding
```bash
adb reverse tcp:8081 tcp:8081
```

### Step 3: Start the app
```bash
cd /Users/vedantchandgude/Desktop/MGD/Margdarshak/Frontend/MargdarshakApp
npx expo start --android
```

**The app will open automatically on your phone!**

---

## 🎯 What You'll See

App opens directly to **Map Screen** with bottom tabs:

1. **🗺️ Map** (Home) - You start here
2. **📝 Reports** - Tap to report incidents  
3. **📊 Dashboard** - Tap to see safety scores
4. **🚨 SOS** - Emergency screen

### Navigate Around:
- **Search icon** (top left) → Search Screen
- **⚙️ Settings icon** (top right) → Settings Screen  
- **"Compare Routes"** link on Map → Route Comparison Screen

---

## 🛑 Stop the Server

Press `Ctrl+C` in terminal, or run:
```bash
pkill -f expo
```

---

## 🐛 If App Crashes

### 1. Clean Start
```bash
cd /Users/vedantchandgude/Desktop/MGD/Margdarshak/Frontend/MargdarshakApp
pkill -f expo
adb reverse tcp:8081 tcp:8081
npx expo start --android --clear
```

### 2. Shake Phone → Reload
- Shake your phone
- Tap "Reload"

### 3. Check Metro Terminal
Look for red error messages in the terminal where `npx expo start` is running.

### 4. Nuclear Option (if still crashing)
```bash
cd /Users/vedantchandgude/Desktop/MGD/Margdarshak/Frontend/MargdarshakApp
rm -rf node_modules
npm install
adb reverse tcp:8081 tcp:8081
npx expo start --android
```

---

## 📂 All Available Screens

### Main App (Bottom Tabs)
✅ **Map Screen** - Interactive map, markers, search  
✅ **Reports Screen** - 6 incident categories, photo upload  
✅ **Dashboard Screen** - Safety score, trends chart, contacts  
✅ **SOS Screen** - Emergency button with countdown  

### Stack Screens (Overlays)
✅ **Search Screen** - Find places with safety scores  
✅ **Route Comparison** - Compare 3 routes (safest/fastest/balanced)  
✅ **Settings Screen** - Profile, privacy, app settings  

---

## 💡 Features Working

- ✅ All 7 main screens accessible
- ✅ Bottom tab navigation
- ✅ Interactive maps with markers
- ✅ Mock safety data (no backend needed)
- ✅ All UI animations and transitions
- ✅ Emergency contacts with call buttons
- ✅ Charts and visualizations

---

## ⚠️ Known Limitations

- ❌ Real location tracking disabled (using San Francisco coordinates)
- ❌ No actual API calls (all mock data)
- ❌ Login/Auth skipped for testing
- ❌ Camera/photo upload is placeholder only

---

## 🎨 Testing Different Screens

### From Map Screen:
- Tap **🔍 Search** → Search Screen
- Tap **⚙️ Settings** → Settings Screen
- Tap **"Compare Routes"** → Route Comparison

### From Bottom Tabs:
- Tap **📝** → Reports Screen
- Tap **📊** → Dashboard Screen
- Tap **🚨** → SOS Screen

---

## 📝 Notes

1. **No login required** - auth flow is completely skipped
2. **All data is mock** - no backend integration yet
3. **Location is hardcoded** - San Francisco coordinates
4. **Maps work** but don't need location permission
5. **Phone must stay connected via USB** for Metro bundler

---

## 🆘 Common Issues

**Q: App says "Unable to load script"**  
A: Run `adb reverse tcp:8081 tcp:8081` then reload app

**Q: App crashes after splash screen**  
A: This shouldn't happen now. If it does, check Metro terminal for errors

**Q: Maps not showing**  
A: Google Maps API key might be needed. For now, map shows basic layout

**Q: Want to test login screens?**  
A: Edit `App.tsx` and uncomment the AuthNavigator code

---

**Ready! Just run the 3 commands above and explore all screens! 🎉**

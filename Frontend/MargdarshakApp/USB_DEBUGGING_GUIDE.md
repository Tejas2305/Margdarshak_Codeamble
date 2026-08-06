# 📱 USB Debugging Setup Guide for Margdarshak

## ✅ Step-by-Step Instructions

### Step 1: Enable Developer Options on Your Phone

1. Open **Settings** on your Android phone
2. Scroll down to **About Phone** (or **About Device**)
3. Find **Build Number** (might be under "Software Information")
4. **Tap "Build Number" 7 times rapidly**
5. You'll see: **"You are now a developer!"**

### Step 2: Enable USB Debugging

1. Go back to main **Settings**
2. Find **Developer Options** (usually in Settings → System → Developer Options)
3. Toggle **ON** the "Developer Options" switch at the top
4. Scroll down and find **USB Debugging**
5. Toggle **ON** USB Debugging
6. **Optional but recommended:**
   - Enable **"Install via USB"**
   - Enable **"USB debugging (Security settings)"** (if available)

### Step 3: Connect Your Phone

1. **Connect your Android phone to your computer via USB cable**
2. On your phone, you may see: **"Use USB for?"**
   - Select **"File Transfer"** or **"MTP"** mode
3. You'll see a popup: **"Allow USB debugging?"**
   - ✅ Check **"Always allow from this computer"**
   - Tap **"OK"** or **"Allow"**

### Step 4: Verify Connection

Double-click: **`check-device.bat`** in this folder

You should see something like:
```
List of devices attached
ABC123XYZ    device
```

If you see `unauthorized`, go back to your phone and accept the USB debugging prompt.

---

## 🚀 Run the App on Your Phone

### Method 1: Using Helper Script (Easiest)
Double-click: **`run-on-device.bat`**

This will:
- Check your device connection
- Start the development server
- Automatically detect your phone

Then press **`a`** to install and run on Android.

### Method 2: Manual Commands

```bash
# Start the dev server
npm start

# In the terminal, press 'a' for Android
# Or scan QR code with Expo Go app
```

---

## 🐛 Troubleshooting

### Issue: "No devices found"

**Solution 1:** Restart ADB
```bash
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe kill-server
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe start-server
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
```

**Solution 2:** Try a different USB cable (some cables are charge-only)

**Solution 3:** Try a different USB port on your computer

**Solution 4:** Revoke USB debugging authorization
- Go to Developer Options
- Tap "Revoke USB debugging authorizations"
- Reconnect and accept again

### Issue: Device shows as "unauthorized"

**Solution:**
- Disconnect and reconnect your phone
- Check your phone screen for the "Allow USB debugging" prompt
- Make sure to check "Always allow from this computer"
- Tap "OK"

### Issue: USB Debugging option is grayed out

**Solution:**
- Some phones have "USB debugging" restrictions
- Check if your phone requires unlocking OEM (Developer Options → OEM Unlocking)
- Some Samsung phones require Samsung account login first

### Issue: "Install failed" error

**Solution:**
- Enable "Install via USB" in Developer Options
- Check if "Install unknown apps" is enabled for the installer
- Make sure you have enough storage space

---

## 📋 Device-Specific Instructions

### Samsung Phones
1. Settings → About Phone → Software Information
2. Tap "Build Number" 7 times
3. Go back → Developer Options
4. Enable USB Debugging
5. May need to enable "USB debugging (Security settings)"

### Xiaomi/Redmi Phones
1. Settings → About Phone
2. Tap "MIUI Version" 7 times
3. Settings → Additional Settings → Developer Options
4. Enable USB Debugging
5. **Important:** Enable "Install via USB" and "USB debugging (Security settings)"

### OnePlus Phones
1. Settings → About Phone
2. Tap "Build Number" 7 times
3. Settings → System → Developer Options
4. Enable USB Debugging

### Google Pixel Phones
1. Settings → About Phone
2. Tap "Build Number" 7 times
3. Settings → System → Advanced → Developer Options
4. Enable USB Debugging

### Realme/Oppo Phones
1. Settings → About Phone
2. Tap "Build Number" 7 times
3. Settings → Additional Settings → Developer Options
4. Enable USB Debugging
5. Enable "Disable Permission Monitoring"

---

## ✅ Current ADB Path

Your ADB is located at:
```
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe
```

---

## 🎯 Quick Commands Reference

```bash
# Check connected devices
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe devices

# Restart ADB server
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe kill-server
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe start-server

# Install APK manually
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe install app.apk

# View device logs
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe logcat

# Uninstall app
C:\Users\rudra\AppData\Local\Android\Sdk\platform-tools\adb.exe uninstall com.margdarshak.app
```

---

## 📱 What Happens Next?

Once your device is connected and USB debugging is enabled:

1. Run `npm start` or double-click `run-on-device.bat`
2. Press **`a`** in the terminal
3. The app will be built and installed on your phone
4. It will automatically open
5. Any code changes will auto-reload via Fast Refresh!

---

## 🎉 Advantages of USB Debugging

✅ **Faster** - Direct connection, no WiFi needed
✅ **More reliable** - No network issues
✅ **Full features** - Camera, GPS, sensors all work
✅ **Live reload** - Code changes reflect instantly
✅ **Debugging** - Full Chrome DevTools access
✅ **Better performance** - Faster than emulator

---

## 🆘 Still Having Issues?

If you've followed all steps and still can't connect:

1. Make sure USB drivers are installed for your phone manufacturer
2. Try installing universal ADB drivers
3. Check Windows Device Manager for any driver issues
4. Try on a different computer to rule out hardware issues

**Need help?** Run `check-device.bat` and share the output!

# 🚀 Backend + Frontend Testing Guide

## Quick Start: Test API Connection in 5 Minutes

---

## Step 1: Start the Backend 🐍

Open a **new terminal** in the Backend folder:

```bash
cd c:\Users\rudra\Documents\Margdarshak\Backend
```

### Install Dependencies (First Time Only):
```bash
pip install -r requirements.txt
```

### Start Backend Server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend is running when you see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Verify Backend:
Open browser: `http://localhost:8000/`

Should see:
```json
{"message": "backend is running"}
```

---

## Step 2: Configure Frontend 📱

### Find Your IP Address:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually something like `192.168.1.100`)

### Update Frontend `.env`:

Edit: `c:\Users\rudra\Documents\Margdarshak\Frontend\MargdarshakApp\.env`

```env
# For testing on physical device (replace with YOUR IP)
API_BASE_URL=http://192.168.1.100:8000

# For Android emulator
# API_BASE_URL=http://10.0.2.2:8000

# For iOS simulator  
# API_BASE_URL=http://localhost:8000
```

**Important:** Use your actual IP address if testing on a physical phone!

---

## Step 3: Start the Frontend 📱

Open a **new terminal** in the Frontend folder:

```bash
cd c:\Users\rudra\Documents\Margdarshak\Frontend\MargdarshakApp
```

### Start Development Server:
```bash
npm start
```

### Run on Device:
- Press **`a`** for Android
- Or scan QR code with Expo Go app

---

## Step 4: Test API Connection 🧪

### In the App:

1. **Navigate to API Test Screen:**
   - Go to Dashboard
   - Tap the **API icon** (🔌) in the top right header
   
2. **Run Tests:**
   - Tap **"🚀 Run All Tests"**
   - Watch the tests execute
   - Check for green ✅ (success) or red ❌ (failed)

### Expected Results:

```
✅ Tests Passed: 9/9

✅ health - Backend Health Check
✅ register - User registered successfully  
✅ login - Login successful
✅ profile - Got user profile
✅ updateProfile - Profile updated
✅ categories - Got report categories
✅ createContact - Emergency contact created
✅ getContacts - Got emergency contacts list
✅ logout - Logged out successfully
```

---

## Step 5: Check Logs 📊

### Backend Logs (Terminal 1):

You should see incoming requests:
```
INFO:     127.0.0.1:52134 - "GET / HTTP/1.1" 200 OK
INFO:     127.0.0.1:52135 - "POST /auth/register HTTP/1.1" 200 OK
INFO:     127.0.0.1:52136 - "POST /auth/login HTTP/1.1" 200 OK
INFO:     127.0.0.1:52137 - "GET /users/me HTTP/1.1" 200 OK
```

### Frontend Logs (Metro Bundler):

You should see test outputs:
```
✅ Backend Health Check: { message: 'backend is running' }
✅ Registration Success: { message: 'User registered successfully', user_id: 1 }
✅ Login Success: { token_type: 'bearer', has_access_token: true }
```

---

## 🐛 Troubleshooting

### ❌ Test 1 Failed: "Network Error"

**Problem:** Frontend can't reach backend

**Solutions:**
1. Check backend is running (see terminal)
2. Verify `.env` has correct IP address
3. Make sure phone and computer are on same WiFi
4. Try: `http://YOUR_IP:8000` instead of `localhost`
5. Check firewall isn't blocking port 8000

**Test Manually:**
```bash
# From your computer
curl http://localhost:8000/

# From your phone's browser
# Open: http://YOUR_IP:8000/
```

---

### ❌ Test 2 Failed: "Email already registered"

**Problem:** Test user already exists in database

**Solution:** This is actually expected on second run! The first test creates a user, subsequent runs will see this message. You can:

1. Ignore it (it's normal)
2. Or delete the test user from database
3. Or modify test to use different email

---

### ❌ Test 3 Failed: "Invalid credentials"

**Problem:** Login credentials don't match

**Solution:** Make sure Test 2 (register) ran successfully first, or use credentials of an existing user.

---

### ❌ Tests 4-8 Failed: "401 Unauthorized"

**Problem:** Not logged in

**Solution:** Make sure Test 3 (login) ran successfully first. Tests must run in order.

---

## 📱 Testing on Different Devices

### Physical Android Phone:
```env
API_BASE_URL=http://YOUR_IP:8000
```

### Android Emulator:
```env
API_BASE_URL=http://10.0.2.2:8000
```

### iOS Simulator:
```env
API_BASE_URL=http://localhost:8000
```

### Production:
```env
API_BASE_URL=https://api.margdarshak.com
```

---

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Browser shows `{"message": "backend is running"}`
- [ ] Frontend `.env` configured with correct IP
- [ ] App running on device/emulator
- [ ] API Test screen accessible
- [ ] All 9 tests passing ✅
- [ ] Backend logs showing requests
- [ ] Frontend logs showing responses

---

## 🎯 What's Tested?

1. **Health Check**: Backend is reachable
2. **Registration**: User creation works
3. **Login**: Authentication works
4. **Get Profile**: Authorized API calls work
5. **Update Profile**: Data modification works
6. **Categories**: Report system works
7. **Create Contact**: Emergency contacts work
8. **Get Contacts**: Data retrieval works
9. **Logout**: Session cleanup works

---

## 📖 API Documentation

Once backend is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These show all available endpoints with try-it-out functionality!

---

## 🎉 Ready to Develop!

Once all tests pass, you can:

1. Use API services in your components
2. Build login/register screens
3. Implement user profiles
4. Add emergency contacts
5. Create incident reports

All API calls are ready to use:

```typescript
import { authService, userService } from '@/services/api';

// In your components
await authService.login(email, password);
const profile = await userService.getProfile();
```

---

## 💡 Pro Tips

1. **Keep backend terminal open** - You'll see all API requests
2. **Use test screen** - Quick way to verify endpoints
3. **Check Swagger docs** - See all available endpoints
4. **Use real device** - Better for testing GPS, camera, etc.
5. **Watch for errors** - Backend terminal shows detailed errors

---

## 🆘 Still Having Issues?

1. **Backend won't start:**
   - Check Python version: `python --version` (need 3.8+)
   - Install dependencies again
   - Check for port conflicts (something else using 8000)

2. **Frontend won't connect:**
   - Restart Metro bundler (`npm start`)
   - Clear cache: `npx expo start -c`
   - Check `.env` file is in correct location

3. **Tests fail randomly:**
   - Restart backend
   - Logout and login again
   - Run tests one at a time

---

## 📊 Test Commands Reference

```bash
# Backend
cd Backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd Frontend/MargdarshakApp
npm start

# Check backend health
curl http://localhost:8000/

# View API docs
open http://localhost:8000/docs
```

---

## ✅ You're All Set!

**Backend:** Running ✅
**Frontend:** Connected ✅  
**API:** Tested ✅

Happy coding! 🚀

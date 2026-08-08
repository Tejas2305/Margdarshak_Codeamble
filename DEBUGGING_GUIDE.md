# 🐛 Debugging Guide - Registration Failed Issue

## Changes Made

✅ **Enhanced error messages** in RegisterScreen
✅ **Added detailed console logging** to API client
✅ **Better error handling** for network issues

## How to Debug Now

### 1. Check Frontend Logs (Metro Bundler)

When you try to register, you'll now see detailed logs in your **Terminal 2 (Metro Bundler)**:

```
🔵 Attempting registration with: { first_name: 'rudru', last_name: 'rudru', email: 'test@example.com' }
🌐 API Request: POST http://10.225.130.98:8000/auth/register
```

**If successful:**
```
✅ API Response: 200 /auth/register
✅ Registration successful: { message: 'User registered successfully', user_id: 1 }
```

**If failed:**
```
❌ API Error: 400 /auth/register { detail: 'Email already registered' }
❌ Registration error: [full error object]
```

**If network error:**
```
❌ Network Error: No response received Network Error
```

### 2. Check Backend Logs (Terminal 1)

When the request reaches backend, you'll see in your backend terminal:

```bash
INFO:     10.225.130.98:12345 - "POST /auth/register HTTP/1.1" 200 OK
```

Or if there's an error:
```bash
INFO:     10.225.130.98:12345 - "POST /auth/register HTTP/1.1" 400 Bad Request
```

### 3. Common Issues and Solutions

#### Issue 1: Network Error (No Backend Logs)

**Symptom:** 
- Frontend shows: `❌ Network Error: No response received`
- NO logs appear in backend terminal
- App shows: "Cannot connect to server"

**Cause:** Frontend can't reach backend

**Solutions:**
1. **Check backend is running:**
   ```bash
   # Should be running in Terminal 1
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

2. **Verify backend URL in .env:**
   ```bash
   # From your computer, test:
   curl http://10.225.130.98:8000/
   
   # Should return:
   {"message":"backend is running"}
   ```

3. **Check your phone and computer are on same WiFi**

4. **Get your computer's IP address:**
   ```bash
   # macOS/Linux:
   ifconfig | grep "inet "
   
   # Look for IP like: 10.225.130.98 or 192.168.x.x
   ```

5. **Update .env if IP changed:**
   ```env
   API_BASE_URL=http://YOUR_ACTUAL_IP:8000
   ```

6. **Restart frontend:**
   ```bash
   # Press 'r' in Metro bundler, or
   # Close and reopen Expo Go app
   ```

---

#### Issue 2: Backend Error (Backend Logs Show Request)

**Symptom:**
- Frontend shows error from backend
- Backend logs show: `POST /auth/register 400` or `500`
- App shows specific error message

**Cause:** Backend rejected the request

**Common errors:**

**A) "Email already registered"**
```
❌ API Error: 400 /auth/register { detail: 'Email already registered' }
```
**Solution:** Email is already used. Try:
- Different email
- Login instead of register
- Or delete the user from database

**B) "Invalid content" / 422 error**
```
❌ API Error: 422 /auth/register { detail: 'Invalid content' }
```
**Solution:** Request format issue
- Check frontend is sending all required fields
- Backend expects: first_name, last_name, email, password

**C) Database connection error**
```
❌ API Error: 500 /auth/register
```
Backend terminal shows database error
**Solution:** 
- Check PostgreSQL is running
- Check .env database credentials in Backend folder

---

#### Issue 3: CORS Error (Web Browser Only)

**Symptom:** Browser console shows CORS error

**Solution:** Already fixed! CORS middleware is added to backend.

---

### 4. Test Backend Directly

**From your computer:**
```bash
# Test backend is running
curl http://10.225.130.98:8000/

# Test registration endpoint
curl -X POST http://10.225.130.98:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test123@example.com",
    "password": "password123"
  }'
```

**Expected response:**
```json
{"message":"User registered successfully","user_id":1}
```

---

### 5. View Logs in Real-Time

**Setup (Recommended):**

Split your terminal or use two terminal windows:

**Terminal 1 - Backend:**
```bash
cd /Users/vedantchandgude/Desktop/Margdarshak_Codeamble/Backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd /Users/vedantchandgude/Desktop/Margdarshak_Codeamble/Frontend/MargdarshakApp
npm start
```

Now watch both terminals when you try to register!

---

### 6. New Error Message in App

The app will now show much better error messages:

**Before:**
```
Registration Failed
Unable to create your account right now.
```

**Now:**
```
Registration Failed
Cannot connect to server. Please check your internet connection and make sure backend is running.
```

Or:
```
Registration Failed
Email already registered
```

---

### 7. Debugging Checklist

When registration fails, check in order:

- [ ] **Backend terminal shows:** `Uvicorn running on http://0.0.0.0:8000` ✅
- [ ] **Browser test works:** `http://10.225.130.98:8000/` returns JSON ✅
- [ ] **Phone and computer on same WiFi** ✅
- [ ] **.env has correct IP:** `API_BASE_URL=http://10.225.130.98:8000` ✅
- [ ] **Frontend Metro bundler running** ✅
- [ ] **Try registration** → Watch Terminal 2 for logs
- [ ] **If you see `🌐 API Request`** → Frontend is trying to connect ✅
- [ ] **Check Terminal 1** → Does backend receive the request?
  - **YES** → Backend issue (check error message)
  - **NO** → Network issue (check WiFi, IP, firewall)

---

## Quick Test Script

Run this to verify everything:

```bash
# 1. Test backend health
curl http://10.225.130.98:8000/

# 2. Test registration (use unique email)
curl -X POST http://10.225.130.98:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Debug",
    "last_name": "Test",
    "email": "debug'$(date +%s)'@test.com",
    "password": "test123"
  }'

# 3. If both work, problem is frontend → backend connection
# 4. If both fail, problem is backend
```

---

## Next Steps After You Try Again

1. **Try to register again** on your phone
2. **Copy the logs** from Terminal 2 (Metro bundler)
3. **Copy the logs** from Terminal 1 (Backend) 
4. **Share both logs** so I can see exactly what's happening

The enhanced logging will show us exactly where the problem is! 🔍

# 🚀 Quick API Reference Card

One-page cheat sheet for Margdarshak API services.

---

## 📥 Import

```typescript
import { authService, userService, emergencyContactService, reportService } from '@/services/api';
```

---

## 🔐 Auth Service

```typescript
// Register
await authService.register({ first_name, last_name, email, password, phone_number, date_of_birth });

// Login
await authService.login(email, password);

// Logout
await authService.logout();

// Check auth
const isAuth = await authService.isAuthenticated();
```

---

## 👤 User Service

```typescript
// Get profile
const profile = await userService.getProfile();

// Update profile
await userService.updateProfile({ first_name, last_name, phone_number });

// Change password
await userService.changePassword({ current_password, new_password });

// Delete account
await userService.deleteAccount();
```

---

## 📞 Emergency Contact Service

```typescript
// List contacts
const contacts = await emergencyContactService.getContacts();

// Create contact
await emergencyContactService.createContact({ name, phone_number });

// Update contact
await emergencyContactService.updateContact({ contact_id, name, phone_number });

// Delete contact
await emergencyContactService.deleteContact(contactId);
```

---

## 📊 Report Service

```typescript
// Get categories
const categories = await reportService.getCategories();
```

---

## 🔧 Configuration

### .env
```env
API_BASE_URL=http://YOUR_IP:8000
```

### Get your IP
```bash
ipconfig                    # Windows
ifconfig | grep inet        # Mac/Linux
```

---

## 🧪 Test

1. Start backend: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
2. Start frontend: `npm start`
3. Open app → Dashboard → Tap API icon (🔌)
4. Tap "Run All Tests"

---

## 🐛 Error Handling

```typescript
try {
  await authService.login(email, password);
} catch (error: any) {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;
  
  if (status === 401) {
    Alert.alert('Error', 'Invalid credentials');
  } else if (status === 400) {
    Alert.alert('Error', detail);
  } else {
    Alert.alert('Error', 'Something went wrong');
  }
}
```

---

## 📱 Complete Example

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { authService } from '@/services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await authService.login(email, password);
      navigation.navigate('Dashboard');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
```

---

## 🎯 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/expired token) |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔄 Token Flow

1. Login → Tokens stored automatically
2. API calls → Token auto-attached
3. 401 error → Token auto-refreshed
4. Logout → Tokens cleared

---

## 📚 Docs

- Full Guide: `API_INTEGRATION.md`
- Usage Examples: `API_SERVICES_USAGE.md`
- Testing: `BACKEND_FRONTEND_TEST.md`
- Backend API: http://localhost:8000/docs

---

**That's it! You're ready to build. 🚀**

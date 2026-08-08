# 🔌 API Services Usage Guide

Quick reference for using API services in your React Native components.

---

## 📥 Import Services

```typescript
import { 
  authService, 
  userService, 
  emergencyContactService, 
  reportService 
} from '@/services/api';
```

---

## 🔐 Authentication Examples

### Register New User

```typescript
import { authService } from '@/services/api';
import { Alert } from 'react-native';

const handleRegister = async () => {
  try {
    const result = await authService.register({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      phone_number: '+1234567890',
      date_of_birth: '1990-01-01'
    });
    
    Alert.alert('Success', 'Account created!');
    console.log('User ID:', result.user_id);
  } catch (error: any) {
    Alert.alert('Error', error.response?.data?.detail || 'Registration failed');
  }
};
```

### Login User

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const result = await authService.login(email, password);
    // Tokens are automatically stored in SecureStore
    
    console.log('Logged in!', result.token_type);
    navigation.navigate('Dashboard');
  } catch (error: any) {
    Alert.alert('Error', error.response?.data?.detail || 'Login failed');
  }
};
```

### Logout User

```typescript
const handleLogout = async () => {
  try {
    await authService.logout();
    // Tokens are automatically cleared
    
    navigation.navigate('Login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

### Check Authentication Status

```typescript
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);

  return isAuthenticated ? <DashboardScreen /> : <LoginScreen />;
}
```

---

## 👤 User Profile Examples

### Get User Profile

```typescript
import { userService } from '@/services/api';
import { useEffect, useState } from 'react';

function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Name: {profile.first_name} {profile.last_name}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>Phone: {profile.phone_number}</Text>
    </View>
  );
}
```

### Update User Profile

```typescript
const handleUpdateProfile = async (data) => {
  try {
    const result = await userService.updateProfile({
      first_name: data.firstName,
      last_name: data.lastName,
      phone_number: data.phone,
    });
    
    Alert.alert('Success', 'Profile updated!');
  } catch (error: any) {
    Alert.alert('Error', error.response?.data?.detail || 'Update failed');
  }
};
```

### Change Password

```typescript
const handleChangePassword = async (current: string, newPass: string) => {
  try {
    await userService.changePassword({
      current_password: current,
      new_password: newPass,
    });
    
    Alert.alert('Success', 'Password changed successfully');
  } catch (error: any) {
    if (error.response?.status === 400) {
      Alert.alert('Error', 'Current password is incorrect');
    } else {
      Alert.alert('Error', 'Failed to change password');
    }
  }
};
```

---

## 📞 Emergency Contacts Examples

### Get Emergency Contacts

```typescript
import { emergencyContactService } from '@/services/api';

function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await emergencyContactService.getContacts();
      setContacts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  return (
    <FlatList
      data={contacts}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.phone_number}</Text>
        </View>
      )}
    />
  );
}
```

### Add Emergency Contact

```typescript
const handleAddContact = async (name: string, phone: string) => {
  try {
    const result = await emergencyContactService.createContact({
      name: name,
      phone_number: phone,
    });
    
    Alert.alert('Success', 'Contact added!');
    console.log('Contact ID:', result.contact_id);
    
    // Reload contacts
    loadContacts();
  } catch (error: any) {
    if (error.response?.status === 400) {
      Alert.alert('Error', 'Contact already exists');
    } else {
      Alert.alert('Error', 'Failed to add contact');
    }
  }
};
```

### Update Emergency Contact

```typescript
const handleUpdateContact = async (contactId: number, name: string, phone: string) => {
  try {
    await emergencyContactService.updateContact({
      contact_id: contactId,
      name: name,
      phone_number: phone,
    });
    
    Alert.alert('Success', 'Contact updated!');
    loadContacts();
  } catch (error) {
    Alert.alert('Error', 'Failed to update contact');
  }
};
```

### Delete Emergency Contact

```typescript
const handleDeleteContact = async (contactId: number) => {
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this contact?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await emergencyContactService.deleteContact(contactId);
            Alert.alert('Success', 'Contact deleted');
            loadContacts();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete contact');
          }
        },
      },
    ]
  );
};
```

---

## 📊 Reports Examples

### Get Report Categories

```typescript
import { reportService } from '@/services/api';

function ReportIncidentScreen() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await reportService.getCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  return (
    <Picker
      selectedValue={selectedCategory}
      onValueChange={(value) => setSelectedCategory(value)}
    >
      {categories.map((cat) => (
        <Picker.Item
          key={cat.category_id}
          label={cat.name}
          value={cat.category_id}
        />
      ))}
    </Picker>
  );
}
```

---

## 🎣 React Query Integration (Recommended)

Using React Query for better data management:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, emergencyContactService } from '@/services/api';

// Get user profile with caching
function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
  });
}

// Update profile with auto-refetch
function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Usage in component
function ProfileScreen() {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();

  const handleUpdate = (data) => {
    updateProfile.mutate(data);
  };

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading profile</Text>;

  return (
    <View>
      <Text>{profile.first_name} {profile.last_name}</Text>
      <Button title="Update" onPress={() => handleUpdate({ first_name: 'New Name' })} />
    </View>
  );
}
```

---

## 🔄 Handling Loading States

```typescript
function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.getProfile();
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading && <ActivityIndicator />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {data && <Text>{data.email}</Text>}
    </View>
  );
}
```

---

## 🚨 Error Handling Best Practices

```typescript
const handleApiCall = async () => {
  try {
    const result = await someApiCall();
    // Handle success
  } catch (error: any) {
    // Network error (no response from server)
    if (error.request && !error.response) {
      Alert.alert('Network Error', 'Please check your internet connection');
      return;
    }

    // HTTP errors (response from server)
    if (error.response) {
      const status = error.response.status;
      const detail = error.response.data?.detail;

      switch (status) {
        case 400:
          Alert.alert('Invalid Input', detail || 'Please check your data');
          break;
        case 401:
          Alert.alert('Unauthorized', 'Please login again');
          // Redirect to login
          navigation.navigate('Login');
          break;
        case 404:
          Alert.alert('Not Found', detail || 'Resource not found');
          break;
        case 500:
          Alert.alert('Server Error', 'Please try again later');
          break;
        default:
          Alert.alert('Error', detail || 'Something went wrong');
      }
    }
  }
};
```

---

## 💾 Persisting User Data

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save user data locally
const saveUserData = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

// Load user data
const loadUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load user data:', error);
    return null;
  }
};

// Clear user data on logout
const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to clear user data:', error);
  }
};
```

---

## 📱 Complete Login Flow Example

```typescript
import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { authService } from '@/services/api';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // Login (tokens stored automatically)
      await authService.login(email, password);
      
      // Success - navigate to dashboard
      navigation.replace('Dashboard');
    } catch (error: any) {
      // Handle errors
      const detail = error.response?.data?.detail || 'Login failed';
      Alert.alert('Login Failed', detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
```

---

## 🎯 Summary

**All API services are ready to use!**

Just import and call:
- `authService` - Login, register, logout
- `userService` - Profile, update, delete
- `emergencyContactService` - CRUD operations
- `reportService` - Categories

**Features:**
✅ Auto token management
✅ Auto token refresh
✅ Secure storage
✅ Error handling
✅ TypeScript types
✅ Ready for production

Happy coding! 🚀

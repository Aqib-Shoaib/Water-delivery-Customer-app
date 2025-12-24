import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    // use getExpoPushTokenAsync instead of getDevicePushTokenAsync for Expo notifications
    token = (await Notifications.getExpoPushTokenAsync({
       projectId: process.env.EXPO_PUBLIC_PROJECT_ID 
       // Note: projectId is needed for Expo Go or non-EAS builds sometimes, 
       // but strictly speaking standard expo-notifications might infer it if configured in app.json. 
       // For now, let's call it without config or assume default.
    })).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

const AuthContext = createContext(null);

// Mock data for demo mode
const MOCK_USERS = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0321-1234567',
    address: '123 Main St, Karachi',
    role: 'customer',
    createdAt: '2023-01-15T00:00:00.000Z'
  },
  {
    _id: '2', 
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '0333-9876543',
    address: '456 Park Ave, Lahore',
    role: 'customer',
    createdAt: '2023-03-20T00:00:00.000Z'
  }
];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('token');
        const u = await AsyncStorage.getItem('user');
        const demo = await AsyncStorage.getItem('demoMode');
        
        if (demo === 'true') {
          setDemoMode(true);
        }
        
        if (t) setToken(t);
        if (u) setUser(JSON.parse(u));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ email, password }) => {
    // Check if demo mode or backend is unavailable
    if (demoMode || API_BASE.includes('localhost')) {
      // Mock login
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (!mockUser || password !== 'password') {
        throw new Error('Invalid credentials. Use john@example.com with password "password"');
      }
      
      const mockToken = `mock_token_${mockUser._id}_${Date.now()}`;
      setToken(mockToken);
      setUser(mockUser);
      await AsyncStorage.setItem('token', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('demoMode', 'true');
      return;
    }

    // Real backend login
    const url = `${API_BASE}/api/auth/login`;
    console.log(url)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  };

  // Register a new customer account
  const register = async ({ name, email, password, cnic }) => {
    // Mock registration
    if (demoMode || API_BASE.includes('localhost')) {
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      const newUser = {
        _id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        phone: '',
        address: '',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      
      const mockToken = `mock_token_${newUser._id}_${Date.now()}`;
      setToken(mockToken);
      setUser(newUser);
      await AsyncStorage.setItem('token', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('demoMode', 'true');
      return;
    }

    // Real backend registration
    const url = `${API_BASE}/api/auth/register`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, cnic }),
    });
    const json = await res.json();
    console.log(json)
    if (!res.ok) {
      throw new Error(json.message || 'Registration failed');
    }
    setToken(json.token);
    setUser(json.user);
    await AsyncStorage.setItem('token', json.token);
    await AsyncStorage.setItem('user', JSON.stringify(json.user));
  };

  // Request a password reset token (OTP-like token)
  const requestPasswordReset = async ({ email }) => {
    // Mock password reset
    if (demoMode || API_BASE.includes('localhost')) {
      const mockUser = MOCK_USERS.find(u => u.email === email);
      if (!mockUser) {
        throw new Error('Email not found');
      }
      return { success: true, token: 'mock_reset_token' };
    }

    const url = `${API_BASE}/api/password-resets/request`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to request reset');
    }
    return res.json(); // { success, token? }
  };

  // Confirm reset by providing token and the new password
  const confirmPasswordReset = async ({ token, password }) => {
    // Mock password reset confirmation
    if (demoMode || API_BASE.includes('localhost')) {
      if (token !== 'mock_reset_token') {
        throw new Error('Invalid or expired token');
      }
      return { success: true };
    }

    const url = `${API_BASE}/api/password-resets/confirm`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to reset password');
    }
    return res.json(); // { success }
  };

  // Fetch current user details
  const fetchMe = async () => {
    if (!token) return;
    
    // Mock fetch user
    if (demoMode || API_BASE.includes('localhost')) {
      if (user) {
        return user;
      }
      const mockUser = MOCK_USERS[0]; // Default to first user
      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    }

    const url = `${API_BASE}/api/auth/me`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load profile');
    const data = await res.json();
    setUser(data.user);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    // Register push token
    registerForPushNotificationsAsync().then(pushToken => {
      if (pushToken && pushToken !== data.user.pushToken) {
        updateMe({ pushToken }).catch(console.error);
      }
    });

    return data.user;
  };

  // Update profile fields (name, phone, address)
  const updateMe = async (patch) => {
    if (!token) throw new Error('Not authenticated');
    
    // Mock update user
    if (demoMode || API_BASE.includes('localhost')) {
      const updatedUser = { ...user, ...patch };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }

    const url = `${API_BASE}/api/auth/me`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update profile');
    }
    const data = await res.json();
    setUser(data.user);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  // Change password with current and new password
  const changePassword = async ({ currentPassword, newPassword }) => {
    if (!token) throw new Error('Not authenticated');
    
    // Mock password change
    if (demoMode || API_BASE.includes('localhost')) {
      if (currentPassword !== 'password') {
        throw new Error('Current password is incorrect');
      }
      return { success: true };
    }

    const url = `${API_BASE}/api/auth/change-password`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to change password');
    }
    return res.json();
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setDemoMode(false);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('demoMode');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      register,
      requestPasswordReset,
      confirmPasswordReset,
      fetchMe,
      updateMe,
      changePassword,
      logout,
      loading,
      isAuthed: !!token,
      demoMode,
    }),
    [token, user, loading, demoMode]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


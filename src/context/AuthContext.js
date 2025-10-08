import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('token');
        const u = await AsyncStorage.getItem('user');
        if (t) setToken(t);
        if (u) setUser(JSON.parse(u));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
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
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, cnic }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  };

  // Request a password reset token (OTP-like token)
  const requestPasswordReset = async ({ email }) => {
    const res = await fetch(`${API_BASE}/api/password-resets/request`, {
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
    const res = await fetch(`${API_BASE}/api/password-resets/confirm`, {
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
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load profile');
    const data = await res.json();
    setUser(data.user);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  // Update profile fields (name, phone, address)
  const updateMe = async (patch) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${API_BASE}/api/auth/me`, {
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

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
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
      logout,
      loading,
      isAuthed: !!token,
    }),
    [token, user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


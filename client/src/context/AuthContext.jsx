import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.data?.data?.user) {
        setUser(res.data.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.data.user);
      showToast(res.data.message || 'Signed in successfully.', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      setUser(res.data.data.user);
      showToast(res.data.message || 'Account created successfully!', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      showToast('Logged out successfully.', 'info');
    } catch (err) {
      setUser(null);
    }
  };

  const sendOtp = async (mobile) => {
    try {
      const res = await api.post('/auth/send-otp', { mobile });
      showToast(res.data.message, 'info');
      return { success: true, data: res.data.data };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const verifyOtp = async (mobile, otpCode, name) => {
    try {
      const res = await api.post('/auth/verify-otp', { mobile, otpCode, name });
      setUser(res.data.data.user);
      showToast(res.data.message, 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const googleAuth = async (googleData) => {
    try {
      const res = await api.post('/auth/google', googleData);
      setUser(res.data.data.user);
      showToast(res.data.message || 'Google authentication successful.', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/auth/profile', updates);
      setUser(res.data.data.user);
      showToast('Profile preferences updated.', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const seedDemoData = async () => {
    try {
      const res = await api.post('/auth/seed-demo');
      showToast('Realistic financial sample data loaded successfully!', 'success');
      return { success: true, data: res.data.data };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // 1-Click Instant Demo Login for Evaluator
  const loginAsDemo = async () => {
    try {
      // First try to login with demo credentials
      const loginRes = await api.post('/auth/login', {
        email: 'krish.verma@arthafinance.in',
        password: 'Password123!',
      }).catch(() => null);

      if (loginRes?.data?.data?.user) {
        setUser(loginRes.data.data.user);
        showToast('Logged in as Krish Verma (Demo Fintech Account).', 'success');
        return { success: true };
      }

      // If doesn't exist, create demo account
      const regRes = await api.post('/auth/register', {
        name: 'Krish Verma',
        email: 'krish.verma@arthafinance.in',
        password: 'Password123!',
        preferredLanguage: 'en',
        preferredTheme: 'system',
      });

      setUser(regRes.data.data.user);
      // Auto-populate demo transactions
      await api.post('/auth/seed-demo');
      showToast('Created and populated demo account for Krish Verma!', 'success');
      return { success: true };
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        sendOtp,
        verifyOtp,
        googleAuth,
        updateProfile,
        seedDemoData,
        loginAsDemo,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

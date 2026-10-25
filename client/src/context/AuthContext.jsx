import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ecoconnect_token') || null);
  const [loading, setLoading] = useState(true);
  const [storageStatus, setStorageStatus] = useState(null);

  // Check health and get logged in user profile on start
  useEffect(() => {
    const initAuth = async () => {
      // Check server health
      try {
        const health = await api.getHealth();
        setStorageStatus(health.database);
      } catch (err) {
        console.warn('Backend server not connected yet:', err.message);
      }

      const storedToken = localStorage.getItem('ecoconnect_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('ecoconnect_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('ecoconnect_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('ecoconnect_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(prev => ({ ...prev, ...res.user }));
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    storageStatus,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

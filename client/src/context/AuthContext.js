// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const client = useApolloClient();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    // Sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        initializeAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    client.resetStore();
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading // Expose loading state
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children when auth is initialized */}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getAuthToken, setAuthToken, getUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (token) {
        // Verify token is still valid by fetching user data
        const userData = await getUser();
        if (userData) {
          setUser(userData);
          setAuthenticated(true);
        } else {
          // Token is invalid, clear it
          logout();
        }
      } else {
        setAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    setAuthenticated(true);
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    authenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

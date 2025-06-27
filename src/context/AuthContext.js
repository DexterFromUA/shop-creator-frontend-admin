import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../utils/graphql';

const AUTH_KEY = 'shop_admin_auth';
const TOKEN_KEY = 'shop_admin_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem(TOKEN_KEY);
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      console.log('RESPONSE', response);
      const userData = response.client;
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, response.token);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await authService.register(email, password, name);
      const userData = response.client;
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, response.token);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  // Keep localStorage in sync if user object changes elsewhere
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
  }, [user, isAuthenticated]);

  const updateUser = (userData) => {
    setUser(userData);
    if (isAuthenticated) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      login, 
      register, 
      logout,
      updateUser 
    }}>
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
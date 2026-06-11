import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../utils/graphql';

const TOKEN_KEY = 'shop_admin_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);

      setIsAuthenticated(true);
      localStorage.setItem(TOKEN_KEY, response.token);
      setUser(response.client);

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

      setIsAuthenticated(true);
      localStorage.setItem(TOKEN_KEY, response.token);

      const userData = await authService.getCurrentUser();
      setUser(userData);

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
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const refreshUser = async () => {
    if (!isAuthenticated) return;

    try {
      const fresh = await authService.getCurrentUser();
      setUser(fresh);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        try {
          setLoading(true);
          const userData = await authService.getCurrentUser();
          console.log(userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      }

      setInitializing(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        initializing,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
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

import React, { createContext, useState, useContext, useEffect } from 'react';

const AUTH_KEY = 'shop_admin_auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem(AUTH_KEY));

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  // Keep localStorage in sync if user object changes elsewhere
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
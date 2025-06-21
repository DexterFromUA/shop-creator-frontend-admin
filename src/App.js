import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import OrderPreview from './pages/OrderPreview';
import AppSettings from './pages/AppSettings';
import PhoneAuth from './pages/auth/PhoneAuth';
import VerifyCode from './pages/auth/VerifyCode';
import Users from './pages/Users';
import Notifications from './pages/Notifications';
import WebNotifications from './pages/WebNotifications';
import Settings from './pages/Settings';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<PhoneAuth />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderPreview />} />
              <Route path="app-settings" element={<AppSettings />} />
              <Route path="users" element={<Users />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="web-notifications" element={<WebNotifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

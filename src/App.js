import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout/Layout';
import './App.css';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderPreview = lazy(() => import('./pages/OrderPreview'));
const AppSettings = lazy(() => import('./pages/AppSettings'));
const PhoneAuth = lazy(() => import('./pages/auth/PhoneAuth'));
const VerifyCode = lazy(() => import('./pages/auth/VerifyCode'));
const Notifications = lazy(() => import('./pages/Notifications'));
const WebNotifications = lazy(() => import('./pages/WebNotifications'));
const Settings = lazy(() => import('./pages/Settings'));
const Team = lazy(() => import('./pages/Team'));
const Users = lazy(() => import('./pages/Users'));
const Billing = lazy(() => import('./pages/Billing'));
const ProductView = lazy(() => import('./pages/ProductView'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <ToastProvider>
            <Suspense fallback={null}>
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
                  <Route path="products/:id" element={<ProductView />} />
                  <Route path="app-settings" element={<AppSettings />} />
                  <Route path="team" element={<Team />} />
                  <Route path="users" element={<Users />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="web-notifications" element={<WebNotifications />} />
                  <Route path="billing" element={<Billing />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Suspense>
          </ToastProvider>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;

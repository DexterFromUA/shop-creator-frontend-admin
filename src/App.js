import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout/Layout';
import './App.css';
import Auth from './pages/auth/Auth';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderPreview = lazy(() => import('./pages/OrderPreview'));
const AppSettings = lazy(() => import('./pages/AppSettings'));
const VerifyCode = lazy(() => import('./pages/auth/VerifyCode'));
const Notifications = lazy(() => import('./pages/Notifications'));
const WebNotifications = lazy(() => import('./pages/WebNotifications'));
const Settings = lazy(() => import('./pages/Settings'));
const Team = lazy(() => import('./pages/Team'));
const Users = lazy(() => import('./pages/Users'));
const Billing = lazy(() => import('./pages/Billing'));
const ProductView = lazy(() => import('./pages/ProductView'));
const StoreSelection = lazy(() => import('./pages/StoreSelection'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const StoreProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <ToastProvider>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/verify" element={<VerifyCode />} />
                <Route 
                  path="/stores" 
                  element={
                    <ProtectedRoute>
                      <StoreSelection />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<Navigate to="/stores" replace />} />
                <Route
                  path="/store/:storeId/*"
                  element={
                    <StoreProtectedRoute>
                      <StoreProvider>
                        <Layout />
                      </StoreProvider>
                    </StoreProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
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

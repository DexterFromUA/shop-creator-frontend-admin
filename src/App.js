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
const Payouts = lazy(() => import('./pages/Payouts'));
const ProductView = lazy(() => import('./pages/ProductView'));
const StoreSelection = lazy(() => import('./pages/StoreSelection'));
const CreateStore = lazy(() => import('./pages/CreateStore'));
const CreateApp = lazy(() => import('./pages/CreateApp'));
const Subscription = lazy(() => import('./pages/Subscription'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializing } = useAuth();
  
  // Показываем загрузку пока инициализируется
  if (initializing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--color-bg-secondary)'
      }}>
        <div style={{ fontSize: 18, color: 'var(--color-text)' }}>Loading...</div>
      </div>
    );
  }
  
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
                <Route 
                  path="/stores/create" 
                  element={
                    <ProtectedRoute>
                      <CreateStore />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/subscription" 
                  element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<Navigate to="/stores" replace />} />
                <Route
                  path="/store/:storeId/*"
                  element={
                    <ProtectedRoute>
                      <StoreProvider>
                        <Layout />
                      </StoreProvider>
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="orders/:id" element={<OrderPreview />} />
                  <Route path="products/:id" element={<ProductView />} />
                  <Route path="create-app" element={<CreateApp />} />
                  <Route path="app-settings" element={<AppSettings />} />
                  <Route path="team" element={<Team />} />
                  <Route path="users" element={<Users />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="web-notifications" element={<WebNotifications />} />
                  <Route path="payouts" element={<Payouts />} />
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

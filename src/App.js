import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { StoreProvider, useStore } from './context/StoreContext';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import './App.css';
import Auth from './pages/auth/Auth';
import SimpleLayout from './components/Layout/SimpleLayout';
import composeProviders from './utils/composeProviders';

const EditStore = lazy(() => import('./pages/EditStore'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderPreview = lazy(() => import('./pages/OrderPreview'));
const AppSettings = lazy(() => import('./pages/AppSettings'));
// const VerifyCode = lazy(() => import('./pages/auth/VerifyCode'));
const Notifications = lazy(() => import('./pages/Notifications'));
const WebNotifications = lazy(() => import('./pages/WebNotifications'));
// const Settings = lazy(() => import('./pages/Settings'));
const Team = lazy(() => import('./pages/Team'));
const Users = lazy(() => import('./pages/Users'));
const Payouts = lazy(() => import('./pages/Payouts'));
const ProductView = lazy(() => import('./pages/ProductView'));
const StoreSelection = lazy(() => import('./pages/StoreSelection'));
const CreateStore = lazy(() => import('./pages/CreateStore'));
const CreateApp = lazy(() => import('./pages/CreateApp'));
const Subscription = lazy(() => import('./pages/Subscription'));
const InvitePage = lazy(() => import('./pages/InvitePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'var(--color-bg-secondary)',
        }}
      >
        <div style={{ fontSize: 18, color: 'var(--color-text)' }}>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const StoreProtectedRoute = ({ roleMin = 0, roleMax = 10, subLvl = 0 }) => {
  const { roleCheck, subscriptionCheck } = useStore();

  return roleCheck >= roleMin && roleCheck <= roleMax && subscriptionCheck >= subLvl ? (
    <Outlet />
  ) : (
    <Navigate to="/stores" />
  );
};

const Providers = composeProviders([
  AuthProvider,
  ThemeProvider,
  ToastProvider,
  Router,
  [
    Suspense,
    {
      fallback: (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #111827',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
        </div>
      ),
    },
  ],
]);

function App() {
  return (
    <Providers>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/stores" replace />} />
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="/verify" element={<VerifyCode />} /> */}
        <Route path="/invite/:token" element={<InvitePage />} />
        <Route
          path="/stores"
          element={
            <ProtectedRoute>
              <SimpleLayout>
                <StoreSelection />
              </SimpleLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores/create"
          element={
            <ProtectedRoute>
              <SimpleLayout>
                <CreateStore />
              </SimpleLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <SimpleLayout>
                <Subscription />
              </SimpleLayout>
            </ProtectedRoute>
          }
        />
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
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderPreview />} />
          <Route path="web-notifications" element={<WebNotifications />} />

          <Route path="*" element={<StoreProtectedRoute roleMin={10} />}>
            <Route path="payouts" element={<Payouts />} />
            <Route path="create-app" element={<CreateApp />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="*" element={<StoreProtectedRoute roleMin={10} subLvl={3} />}>
            <Route path="app-settings" element={<AppSettings />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="*" element={<StoreProtectedRoute roleMin={2} />}>
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<AddProduct />} />
            <Route path="products/:id" element={<ProductView />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<EditStore />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="*" element={<StoreProtectedRoute roleMin={2} subLvl={3} />}>
            <Route path="team" element={<Team />} />
            <Route path="notifications" element={<Notifications />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Global catch-all route for any unmatched URLs */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Providers>
  );
}

export default App;

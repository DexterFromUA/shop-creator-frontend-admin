import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppHeader from './AppHeader';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/app-settings', label: 'App Settings', icon: '📱' },
  ];

  const scrollablePages = ['/app-settings', '/dashboard', '/notifications'];
  const isPageScrollable = scrollablePages.some(page => location.pathname.startsWith(page));

  return (
    <div className="layout-root">
      <AppHeader />
      <div className={`layout ${isPageScrollable ? 'is-scrollable' : ''}`}>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 
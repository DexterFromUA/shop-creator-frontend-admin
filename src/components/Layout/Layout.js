import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import './Layout.css';

const Layout = () => {
  const location = useLocation();

  const scrollablePages = ['app-settings', 'dashboard', 'notifications', 'payouts', 'create-app', 'products/add'];
  const isPageScrollable = scrollablePages.some(page => location.pathname.includes(`/${page}`));

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
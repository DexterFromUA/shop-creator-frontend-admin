import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import SimpleLayout from './SimpleLayout';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-root">
      <AppHeader />
      <main className="layout main-content">
        <SimpleLayout>
          <div style={{ height: '64px' }} />
          <Outlet />
        </SimpleLayout>
      </main>
    </div>
  );
};

export default Layout;

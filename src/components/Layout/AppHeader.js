import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './AppHeader.css';
import { NavLink, useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/products', label: 'Products', icon: '📦' },
    { to: '/orders', label: 'Orders', icon: '🛒' },
    { to: '/users', label: 'Users', icon: '👥' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
  ];
  const menuRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const location = window.location.pathname;
  const getActiveMenuIndex = () => menuItems.findIndex(item =>
    location === item.to || location.startsWith(item.to + '/')
  );
  const activeMenuIndex = getActiveMenuIndex();

  useEffect(() => {
    if (activeMenuIndex !== -1 && menuRefs.current[activeMenuIndex]) {
      const el = menuRefs.current[activeMenuIndex];
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth
      });
    } else {
      setIndicatorStyle({ left: 0, width: 0 });
    }
  }, [location]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-header-title">Shop Admin</span>
        <div className="app-header-center">
          <div className="app-header-menu-container small">
            <nav className="app-header-menu">
              <span className="app-header-menu-indicator" style={{ left: indicatorStyle.left, width: indicatorStyle.width, opacity: activeMenuIndex !== -1 ? 1 : 0 }} />
              {menuItems.map((item, idx) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    "app-header-menu-item" +
                    (idx === activeMenuIndex ? " active" : "")
                  }
                  ref={el => menuRefs.current[idx] = el}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="app-header-right">
        <button
          className="header-icon-btn"
          aria-label="Notifications"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" />
          </svg>
        </button>
        <div className="user-menu-wrapper" ref={dropdownRef}>
          <button
            className="header-icon-btn user-avatar"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="User menu"
          >
            <img src="https://ui-avatars.com/api/?name=John+Doe&background=ececff&color=6d28d9&size=32" alt="User avatar" style={{ width: 32, height: 32, borderRadius: '8px', objectFit: 'cover' }} />
          </button>
          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-item" onClick={() => { toggleTheme(); setDropdownOpen(false); }}>
                {theme === 'dark' ? '🌙 Light Theme' : '☀️ Dark Theme'}
              </div>
              <div className="user-dropdown-item" onClick={() => { navigate('/app-settings'); setDropdownOpen(false); }}>📱 App Settings</div>
              <div className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>👤 Profile</div>
              <div className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>⚙️ Settings</div>
              <div className="user-dropdown-item" style={{ color: '#ef4444' }} onClick={() => setDropdownOpen(false)}>🚪 Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader; 
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import './AppHeader.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const AppHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { currentStore, storeId, loading } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef();
  const notificationsRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #12345 has been placed by John Doe',
      time: '2 minutes ago',
      read: false,
      type: 'order'
    },
    {
      id: 2,
      title: 'Payment Successful',
      message: 'Payment for order #12344 has been processed',
      time: '15 minutes ago',
      read: false,
      type: 'payment'
    },
    {
      id: 3,
      title: 'Low Stock Alert',
      message: 'Product "Wireless Headphones" is running low on stock',
      time: '1 hour ago',
      read: true,
      type: 'stock'
    },
    {
      id: 4,
      title: 'System Update',
      message: 'New dashboard features are now available',
      time: '2 hours ago',
      read: true,
      type: 'system'
    }
  ]);

  const menuItems = storeId ? [
    { to: `/store/${storeId}/dashboard`, label: 'Dashboard', icon: '📊' },
    { to: `/store/${storeId}/orders`, label: 'Orders', icon: '🛒' },
    { to: `/store/${storeId}/products`, label: 'Products', icon: '📦' },
    { to: `/store/${storeId}/notifications`, label: 'Notifications', icon: '🔔' },
  ] : [];
  
  const menuRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const getActiveMenuIndex = () => menuItems.findIndex(item =>
    location.pathname === item.to || location.pathname.startsWith(item.to + '/')
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
  }, [location.pathname, activeMenuIndex]);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    }
    if (dropdownOpen || notificationsOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen, notificationsOpen]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '🛒';
      case 'payment': return '💳';
      case 'stock': return '⚠️';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  return (
    <header className="app-header">
      <div className="app-header-left">
        <span className="app-header-title">
          {loading ? 'Loading...' : (currentStore?.name || 'Shop Admin')}
        </span>
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
            <div className="app-header-right" style={{ gap: 12 }}>
        <button
          className="header-icon-btn"
          onClick={() => navigate('/stores', { state: { fromStorePage: true } })}
          aria-label="View all stores"
          title="View all stores"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '0 12px',
            fontSize: 14,
            fontWeight: 500,
            minWidth: 'auto',
            width: 'auto'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Stores
        </button>
        <div className="notifications-wrapper" ref={notificationsRef}>
          <button
            className="header-icon-btn notifications-btn"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(v => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16z" />
            </svg>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          {notificationsOpen && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--color-accent)', 
                      fontSize: 14, 
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                      {!notification.read && <div className="notification-dot" />}
                    </div>
                  ))
                )}
              </div>
              <div className="notifications-footer">
                <button 
                  onClick={() => { navigate(storeId ? `/store/${storeId}/web-notifications` : '/web-notifications'); setNotificationsOpen(false); }}
                  style={{ 
                    width: '100%', 
                    padding: '8px 16px', 
                    background: 'var(--color-bg-secondary)', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: 8, 
                    color: 'var(--color-text)', 
                    cursor: 'pointer',
                    fontSize: 14
                  }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="user-menu-wrapper" ref={dropdownRef}>
          <button
            className="header-icon-btn user-avatar"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="User menu"
          >
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=ececff&color=6d28d9&size=32`} 
              alt="User avatar" 
              style={{ width: 32, height: 32, borderRadius: '8px', objectFit: 'cover' }} 
            />
          </button>
          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-item" onClick={() => { toggleTheme(); setDropdownOpen(false); }}>
                 {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
               </div>
               <div className="user-dropdown-item" onClick={() => { navigate(storeId ? `/store/${storeId}/team` : '/team'); setDropdownOpen(false); }}>Team</div>
               <div className="user-dropdown-item" onClick={() => { navigate(storeId ? `/store/${storeId}/users` : '/users'); setDropdownOpen(false); }}>Users</div>
               <div className="user-dropdown-item" onClick={() => { navigate(storeId ? `/store/${storeId}/payouts` : '/payouts'); setDropdownOpen(false); }}>Payouts</div>
               <div className="user-dropdown-item" onClick={() => { navigate(storeId ? `/store/${storeId}/app-settings` : '/app-settings'); setDropdownOpen(false); }}>App Settings</div>
               <div className="user-dropdown-item" onClick={() => { navigate(storeId ? `/store/${storeId}/settings` : '/settings'); setDropdownOpen(false); }}>Settings</div>
               <div className="user-dropdown-item" style={{ color: '#ef4444' }} onClick={() => { logout(); setDropdownOpen(false); navigate('/auth'); }}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader; 
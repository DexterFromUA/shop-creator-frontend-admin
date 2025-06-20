import React, { useState } from 'react';
import './WebNotifications.css';

const WebNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #12345 has been placed by John Doe',
      time: '2 minutes ago',
      read: false,
      type: 'order',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Payment Successful',
      message: 'Payment for order #12344 has been processed',
      time: '15 minutes ago',
      read: false,
      type: 'payment',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Low Stock Alert',
      message: 'Product "Wireless Headphones" is running low on stock',
      time: '1 hour ago',
      read: true,
      type: 'stock',
      priority: 'high'
    },
    {
      id: 4,
      title: 'System Update',
      message: 'New dashboard features are now available',
      time: '2 hours ago',
      read: true,
      type: 'system',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Customer Support Request',
      message: 'New support ticket from customer@example.com',
      time: '3 hours ago',
      read: false,
      type: 'support',
      priority: 'medium'
    },
    {
      id: 6,
      title: 'Inventory Update',
      message: 'Product "Bluetooth Speaker" stock has been updated',
      time: '4 hours ago',
      read: true,
      type: 'inventory',
      priority: 'low'
    },
    {
      id: 7,
      title: 'Failed Payment',
      message: 'Payment failed for order #12340 - insufficient funds',
      time: '5 hours ago',
      read: false,
      type: 'payment',
      priority: 'high'
    },
    {
      id: 8,
      title: 'New User Registration',
      message: 'New user "jane.smith@email.com" has registered',
      time: '6 hours ago',
      read: true,
      type: 'user',
      priority: 'low'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '🛒';
      case 'payment': return '💳';
      case 'stock': return '⚠️';
      case 'system': return '⚙️';
      case 'support': return '🎧';
      case 'inventory': return '📦';
      case 'user': return '👤';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Unknown';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      notification.type === filter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
    setSelectedNotifications([]);
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(n => n !== id)
        : [...prev, id]
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 0' }}>
        {/* Search and Filter Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: '24px 32px', marginBottom: 32, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', minWidth: 140, maxWidth: 220, flex: 1 }}>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.7rem 1rem 0.7rem 2.5rem',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                fontSize: 15,
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                width: '100%',
                minWidth: 0,
                maxWidth: 220
              }}
            />
            <span style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
              fontSize: '1.1rem',
              pointerEvents: 'none'
            }}>🔍</span>
          </div>
          <div style={{ flex: 1 }} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
              padding: '0.7rem 2.5rem 0.7rem 1rem',
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              fontSize: 15,
              minWidth: 140,
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '18px'
            }}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="order">Orders</option>
            <option value="payment">Payments</option>
            <option value="stock">Stock Alerts</option>
            <option value="system">System</option>
            <option value="support">Support</option>
            <option value="inventory">Inventory</option>
            <option value="user">Users</option>
          </select>
        </div>

        {/* Notifications Content Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 0, width: '100%', maxHeight: '70vh', overflowY: 'auto' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ color: '#aaa', padding: '32px 0', textAlign: 'center' }}>No notifications found</div>
          ) : (
            <>
              {/* Header with actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid var(--color-bg-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: 'var(--color-text)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={toggleSelectAll}
                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <span>Select All</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 8,
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-text)',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
                      opacity: unreadCount === 0 ? 0.5 : 1
                    }}
                  >
                    Mark All as Read
                  </button>
                  {selectedNotifications.length > 0 && (
                    <button 
                      onClick={deleteSelected}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #fecaca',
                        borderRadius: 8,
                        background: '#fee2e2',
                        color: '#dc2626',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      Delete Selected ({selectedNotifications.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications list */}
              {filteredNotifications.map((notification, i) => (
                <React.Fragment key={notification.id}>
                  <div
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 16, 
                      padding: '20px 32px', 
                      cursor: 'pointer', 
                      transition: 'background 0.15s',
                      background: !notification.read ? 'rgba(139, 92, 246, 0.05)' : 'transparent'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                    onMouseOut={e => e.currentTarget.style.background = !notification.read ? 'rgba(139, 92, 246, 0.05)' : 'transparent'}
                  >
                    <div style={{ marginTop: 4 }}>
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleSelectNotification(notification.id)}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                    </div>
                    
                    <div style={{ fontSize: 24, marginTop: 2 }}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>
                          {notification.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span 
                            style={{ 
                              padding: '4px 8px', 
                              borderRadius: 4, 
                              color: 'white', 
                              fontSize: 11, 
                              fontWeight: 600, 
                              textTransform: 'uppercase', 
                              letterSpacing: 0.5,
                              backgroundColor: getPriorityColor(notification.priority)
                            }}
                          >
                            {getPriorityLabel(notification.priority)}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {notification.message}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                          style={{
                            width: 32,
                            height: 32,
                            border: 'none',
                            borderRadius: 6,
                            background: 'var(--color-bg-secondary)',
                            color: 'var(--color-text)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'var(--color-border)'}
                          onMouseOut={e => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete notification"
                        style={{
                          width: 32,
                          height: 32,
                          border: 'none',
                          borderRadius: 6,
                          background: 'var(--color-bg-secondary)',
                          color: 'var(--color-text)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'var(--color-bg-secondary)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  {i !== filteredNotifications.length - 1 && <div style={{ borderBottom: '1px solid var(--color-bg-secondary)', margin: '0 32px' }} />}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebNotifications; 
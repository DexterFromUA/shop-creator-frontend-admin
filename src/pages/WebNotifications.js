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
    <div className="web-notifications-page">
      <div className="web-notifications-header">
        <div className="web-notifications-title">
          <h1>Web Notifications</h1>
          <span className="notification-count">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="web-notifications-actions">
          <button 
            className="btn btn-secondary"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </button>
          {selectedNotifications.length > 0 && (
            <button 
              className="btn btn-danger"
              onClick={deleteSelected}
            >
              Delete Selected ({selectedNotifications.length})
            </button>
          )}
        </div>
      </div>

      <div className="web-notifications-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
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
      </div>

      <div className="web-notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No notifications found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="notifications-list">
            <div className="list-header">
              <label className="select-all-checkbox">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={toggleSelectAll}
                />
                <span>Select All</span>
              </label>
            </div>
            
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-card ${!notification.read ? 'unread' : ''}`}
              >
                <div className="notification-select">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleSelectNotification(notification.id)}
                  />
                </div>
                
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <div className="notification-meta">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      >
                        {getPriorityLabel(notification.priority)}
                      </span>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                </div>
                
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="action-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    className="action-btn delete"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete notification"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebNotifications; 
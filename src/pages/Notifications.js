import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './Dashboard.css';

const NotificationForm = ({ type, onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    message: '',
    recipients: 'all',
    scheduled: false,
    scheduledTime: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, type });
    setForm({ title: '', message: '', recipients: 'all', scheduled: false, scheduledTime: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Title</label>
        <input
          required
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder={`Enter ${type} title...`}
          style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Message</label>
        <textarea
          required
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder={`Enter ${type} message...`}
          rows={4}
          style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15, resize: 'vertical' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Recipients</label>
        <select
          value={form.recipients}
          onChange={e => setForm(f => ({ ...f, recipients: e.target.value }))}
          style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }}
        >
          <option value="all">All Users</option>
          <option value="managers">Managers Only</option>
          <option value="couriers">Couriers Only</option>
          <option value="custom">Custom Selection</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="checkbox"
          id={`scheduled-${type}`}
          checked={form.scheduled}
          onChange={e => setForm(f => ({ ...f, scheduled: e.target.checked }))}
          style={{ width: 18, height: 18 }}
        />
        <label htmlFor={`scheduled-${type}`} style={{ fontSize: 15, cursor: 'pointer' }}>Schedule for later</label>
      </div>
      {form.scheduled && (
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Schedule Time</label>
          <input
            type="datetime-local"
            value={form.scheduledTime}
            onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))}
            style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }}
          />
        </div>
      )}
      <button
        type="submit"
        style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}
      >
        Send {type === 'email' ? 'Email' : 'Push'} Notification
      </button>
    </form>
  );
};

const NotificationHistory = ({ notifications, type }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-secondary)' }}>
          No {type} notifications sent yet
        </div>
      ) : (
        notifications.map((notification, index) => (
          <div
            key={index}
            style={{
              padding: 16,
              border: '1px solid var(--color-border)',
              borderRadius: 12,
              background: 'var(--color-bg-secondary)',
              borderLeft: `4px solid ${notification.status === 'sent' ? '#10b981' : notification.status === 'failed' ? '#ef4444' : '#f59e0b'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{notification.title}</h4>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  background: notification.status === 'sent' ? '#dcfce7' : notification.status === 'failed' ? '#fee2e2' : '#fef3c7',
                  color: notification.status === 'sent' ? '#166534' : notification.status === 'failed' ? '#991b1b' : '#92400e'
                }}
              >
                {notification.status}
              </span>
            </div>
            <p style={{ margin: '8px 0', fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              {notification.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--color-text-secondary)' }}>
              <span>To: {notification.recipients}</span>
              <span>{notification.timestamp}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const Notifications = () => {
  const { currentStore } = useStore();
  const navigate = useNavigate();

  const [emailHistory, setEmailHistory] = useState([
    {
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM. Please save your work.',
      recipients: 'All Users',
      status: 'sent',
      timestamp: '2 hours ago'
    },
    {
      title: 'New Feature Available',
      message: 'Check out our new dashboard analytics feature!',
      recipients: 'Managers Only',
      status: 'sent',
      timestamp: '1 day ago'
    }
  ]);

  const [pushHistory, setPushHistory] = useState([
    {
      title: 'Order Update',
      message: 'Order #12345 has been delivered successfully.',
      recipients: 'Couriers Only',
      status: 'sent',
      timestamp: '30 minutes ago'
    },
    {
      title: 'Payment Failed',
      message: 'Payment for order #12340 failed. Please check payment method.',
      recipients: 'All Users',
      status: 'failed',
      timestamp: '2 hours ago'
    }
  ]);

  const handleEmailSubmit = (emailData) => {
    const newEmail = {
      ...emailData,
      status: 'sent',
      timestamp: 'Just now'
    };
    setEmailHistory([newEmail, ...emailHistory]);
  };

  const handlePushSubmit = (pushData) => {
    const newPush = {
      ...pushData,
      status: 'sent',
      timestamp: 'Just now'
    };
    setPushHistory([newPush, ...pushHistory]);
  };

  // Проверяем подписку владельца стора
  const isOwnerProOrUnlimited = currentStore?.owner?.subscriptionType === 'PRO' || 
                                 currentStore?.owner?.subscriptionType === 'UNLIMITED';

  // Если подписка не подходит, показываем сообщение об ограничении
  if (!isOwnerProOrUnlimited) {
    return (
      <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: '48px 16px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 800, width: '100%', margin: '0 auto' }}>
          <div className="dashboard-card" style={{ 
            background: 'var(--color-bg)', 
            borderRadius: 28, 
            boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
            padding: 48,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🔒</div>
            <h1 style={{ margin: '0 0 16px 0', fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
              Premium Feature
            </h1>
            <p style={{ margin: '0 0 32px 0', fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Notifications management is available for stores with PRO subscriptions. 
              The store owner needs to upgrade their subscription to access this feature.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={() => navigate(`/store/${currentStore?.id}/dashboard`)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/stores')}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#111827',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Manage Stores
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: '48px 16px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Notifications
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Create and manage email and push notifications for your users
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24 }}>
          {/* Email Notifications */}
          <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--color-text)' }}>Email Notifications</h2>
            <NotificationForm type="email" onSubmit={handleEmailSubmit} />
          </div>

          {/* Push Notifications */}
          <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--color-text)' }}>Push Notifications</h2>
            <NotificationForm type="push" onSubmit={handlePushSubmit} />
          </div>

          {/* Email History */}
          <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--color-text)' }}>Email History</h2>
            <NotificationHistory notifications={emailHistory} type="email" />
          </div>

          {/* Push History */}
          <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--color-text)' }}>Push History</h2>
            <NotificationHistory notifications={pushHistory} type="push" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 
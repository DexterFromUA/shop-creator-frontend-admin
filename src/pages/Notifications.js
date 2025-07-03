import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css';

const NotificationForm = ({ onSubmit, notificationType }) => {
  const [form, setForm] = useState({
    title: '',
    message: '',
    recipients: 'all',
    scheduled: false,
    scheduledTime: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, type: notificationType });
    setForm({
      title: '',
      message: '',
      recipients: 'all',
      scheduled: false,
      scheduledTime: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>
          Title
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder={`Enter ${notificationType} title...`}
          style={{
            boxSizing: 'border-box',
            width: '100%',
            padding: '0.8rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            fontSize: 15,
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>
          Message
        </label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder={`Enter ${notificationType} message...`}
          rows={4}
          style={{
            boxSizing: 'border-box',
            width: '100%',
            padding: '0.8rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            fontSize: 15,
            resize: 'vertical',
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>
          Recipients
        </label>
        <select
          value={form.recipients}
          onChange={(e) => setForm((f) => ({ ...f, recipients: e.target.value }))}
          style={{
            boxSizing: 'border-box',
            width: '100%',
            padding: '0.8rem 1rem',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
            fontSize: 15,
          }}
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
          id="scheduled-notification"
          checked={form.scheduled}
          onChange={(e) => setForm((f) => ({ ...f, scheduled: e.target.checked }))}
          style={{ width: 18, height: 18 }}
        />
        <label htmlFor="scheduled-notification" style={{ fontSize: 15, cursor: 'pointer' }}>
          Schedule for later
        </label>
      </div>
      {form.scheduled && (
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>
            Schedule Time
          </label>
          <input
            type="datetime-local"
            value={form.scheduledTime}
            onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
            style={{
              boxSizing: 'border-box',
              width: '100%',
              padding: '0.8rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              fontSize: 15,
            }}
          />
        </div>
      )}
      <Button
        filled
        type="submit"
        style={{ padding: '0.8rem 1.4rem', fontSize: 15, marginTop: 8 }}
      >
        Send {notificationType === 'email' ? 'Email' : 'Push'} Notification
      </Button>
    </form>
  );
};

const NotificationHistory = ({ notifications }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {notifications.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: 'var(--color-text-secondary)',
          }}
        >
          No notifications sent yet
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
              borderLeft: `4px solid ${notification.status === 'sent' ? '#10b981' : notification.status === 'failed' ? '#ef4444' : '#f59e0b'}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{notification.title}</h4>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 500,
                    background: notification.type === 'email' ? '#eff6ff' : '#fdf4ff',
                    color: notification.type === 'email' ? '#1d4ed8' : '#7c2d92',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {notification.type}
                </span>
              </div>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  background:
                    notification.status === 'sent'
                      ? '#dcfce7'
                      : notification.status === 'failed'
                        ? '#fee2e2'
                        : '#fef3c7',
                  color:
                    notification.status === 'sent'
                      ? '#166534'
                      : notification.status === 'failed'
                        ? '#991b1b'
                        : '#92400e',
                }}
              >
                {notification.status}
              </span>
            </div>
            <p
              style={{
                margin: '8px 0',
                fontSize: 14,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.4,
              }}
            >
              {notification.message}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}
            >
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
  
  // Состояние для типа уведомления
  const [notificationType, setNotificationType] = useState('email');

  const [allHistory, setAllHistory] = useState([
    {
      type: 'push',
      title: 'Order Update',
      message: 'Order #12345 has been delivered successfully.',
      recipients: 'Couriers Only',
      status: 'sent',
      timestamp: '30 minutes ago',
    },
    {
      type: 'email',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM. Please save your work.',
      recipients: 'All Users',
      status: 'sent',
      timestamp: '2 hours ago',
    },
    {
      type: 'push',
      title: 'Payment Failed',
      message: 'Payment for order #12340 failed. Please check payment method.',
      recipients: 'All Users',
      status: 'failed',
      timestamp: '2 hours ago',
    },
    {
      type: 'email',
      title: 'New Feature Available',
      message: 'Check out our new dashboard analytics feature!',
      recipients: 'Managers Only',
      status: 'sent',
      timestamp: '1 day ago',
    },
  ]);

  const handleNotificationSubmit = (notificationData) => {
    const newNotification = {
      ...notificationData,
      status: 'sent',
      timestamp: 'Just now',
    };
    setAllHistory([newNotification, ...allHistory]);
  };

  // Проверяем подписку владельца стора
  const isOwnerProOrUnlimited =
    currentStore?.owner?.subscriptionType === 'PRO' ||
    currentStore?.owner?.subscriptionType === 'UNLIMITED';

  // Если подписка не подходит, показываем сообщение об ограничении
  if (!isOwnerProOrUnlimited) {
    return (
      <PageContainer
        withPadding
        isCenteredContent
        title="Premium Feature"
        style={{ maxWidth: 800, textAlign: 'center', padding: 48 }}
      >
        <div style={{ fontSize: 64, marginBottom: 24 }}>🔒</div>
        <h1
          style={{
            margin: '0 0 16px 0',
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-text)',
          }}
        >
          Premium Feature
        </h1>
        <p
          style={{
            margin: '0 0 32px 0',
            fontSize: 16,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          Notifications management is available for stores with PRO subscriptions. The store owner
          needs to upgrade their subscription to access this feature.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Button onClick={() => navigate(`/store/${currentStore?.id}/dashboard`)}>
            Back to Dashboard
          </Button>
          <Button filled onClick={() => navigate('/stores')}>
            Manage Stores
          </Button>
        </div>
      </PageContainer>
    );
  }

      return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Send Notification Form */}
        <PageContainer
          isStretch
          minHeight="auto"
          title="Notifications"
          description="Create and manage email and push notifications for your users"
          withBottomSpace
          withPadding
          RightContent={
            <div
              style={{
                position: 'relative',
                display: 'flex',
                background: 'var(--color-bg-secondary)',
                padding: 4,
                borderRadius: 8,
                border: '2px solid black',
                width: 120,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  bottom: 4,
                  width: 'calc(50% - 4px)',
                  left: notificationType === 'email' ? 4 : 'calc(50%)',
                  background: 'var(--color-bg)',
                  borderRadius: 6,
                  transition: 'left 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              />
              <button
                onClick={() => setNotificationType('email')}
                style={{
                  padding: '0.5rem 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'color 0.3s',
                  width: '50%',
                  fontSize: 14,
                  textAlign: 'center'
                }}
              >
                Email
              </button>
              <button
                onClick={() => setNotificationType('push')}
                style={{
                  padding: '0.5rem 0',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'color 0.3s',
                  width: '50%',
                  fontSize: 14,
                }}
              >
                Push
              </button>
            </div>
          }
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--color-text)' }}>
            Create notification
          </h2>
          <NotificationForm onSubmit={handleNotificationSubmit} notificationType={notificationType} />
        </PageContainer>

      {/* Notification History */}
      <PageContainer withPadding minHeight="80vh">
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--color-text)' }}>
          Notification History
        </h2>
        <NotificationHistory notifications={allHistory} />
      </PageContainer>
    </div>
  );
};

export default Notifications;

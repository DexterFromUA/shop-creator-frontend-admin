import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const StoreSelection = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Обновляем данные пользователя один раз при монтировании
  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) {
      // Объединяем все сторы пользователя с указанием роли
      const allStores = [
        ...(user.stores || []).map(store => ({ ...store, role: 'OWNER' })),
        ...(user.managingStores || []).map(store => ({ ...store, role: 'MANAGER' })),
        ...(user.deliveringStores || []).map(store => ({ ...store, role: 'COURIER' }))
      ];
      

      
      setStores(allStores);
      setLoading(false);
    } else {
      // Если нет пользователя, перенаправляем на страницу авторизации
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleStoreSelect = (store) => {
    // Навигация на страницу конкретного магазина
    navigate(`/store/${store.id}/dashboard`);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'OWNER': return '#10b981';
      case 'MANAGER': return '#3b82f6';
      case 'COURIER': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'OWNER': return 'Owner';
      case 'MANAGER': return 'Manager';
      case 'COURIER': return 'Courier';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--color-bg-secondary)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #111827', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>Loading your stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 16px', boxSizing: 'border-box' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
              {stores.length > 0 ? 'Select Your Store' : 'Your Stores'}
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
              {stores.length > 0 
                ? `You have ${stores.length} store${stores.length > 1 ? 's' : ''}. Choose one to manage.`
                : 'Get started by creating your first store.'
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate('/subscription')}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '2px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Subscription
            </button>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#111827',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 0, boxSizing: 'border-box', height: '80vh', overflowY: 'auto' }}>
          <div style={{ padding: 32 }}>
            {/* Stores List */}
            {stores.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gap: 24, 
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                marginBottom: 24
              }}>
                {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleStoreSelect(store)}
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '2px dashed var(--color-border)',
                    borderRadius: 18,
                    padding: 24,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#111827';
                    e.currentTarget.style.background = 'var(--color-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.background = 'var(--color-bg-secondary)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 8
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: 18, 
                        fontWeight: 700, 
                        color: 'var(--color-text)'
                      }}>
                        {store.name}
                      </h3>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: 12,
                        background: getRoleColor(store.role) + '20',
                        color: getRoleColor(store.role),
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {getRoleLabel(store.role)}
                      </div>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--color-text-secondary)', 
                      fontSize: 14
                    }}>
                      {store.description}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: 24,
                    alignItems: 'center'
                  }}>
                    <div style={{ 
                      textAlign: 'center',
                      minWidth: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4, lineHeight: 1.2 }}>
                        Created
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.1 }}>
                        {store.createdAt ? new Date(parseInt(store.createdAt)).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Unknown'}
                      </div>
                    </div>
                    {store.contactCity && (
                      <div style={{ 
                        textAlign: 'center',
                        minWidth: 80,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4, lineHeight: 1.2 }}>
                          Location
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.1 }}>
                          {store.contactCity}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{
                    padding: '12px 20px',
                    borderRadius: 12,
                    background: '#111827',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    whiteSpace: 'nowrap'
                  }}>
                    Manage →
                  </div>
                </div>
              ))}
              </div>
            )}

            {/* Create New Store Button */}
            <div style={{ 
              display: 'grid', 
              gap: 24, 
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
            }}>
              <div 
                onClick={() => navigate('/stores/create')}
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '2px dashed var(--color-border)',
                  borderRadius: 18,
                  padding: 32,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#111827';
                e.currentTarget.style.background = 'var(--color-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.background = 'var(--color-bg-secondary)';
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--color-text-secondary)' }}>+</div>
              <h3 style={{ 
                margin: 0, 
                fontSize: 16, 
                fontWeight: 600, 
                color: 'var(--color-text)',
                marginBottom: 4
              }}>
                Create New Store
              </h3>
              <p style={{ 
                margin: 0, 
                color: 'var(--color-text-secondary)', 
                fontSize: 14
              }}>
                Start a new store and begin selling your products
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSelection; 
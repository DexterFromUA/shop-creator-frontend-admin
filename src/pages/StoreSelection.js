import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storeService } from '../utils/graphql';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css';

const StoreSelection = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStoreLimit = (subscriptionType) => {
    switch (subscriptionType) {
      case 'BASIC':
        return 0;
      case 'ADVANCED':
        return 1;
      case 'PRO':
        return 3;
      case 'UNLIMITED':
        return Infinity;
      default:
        return 0;
    }
  };

  const handleCreateStoreClick = () => {
    const ownedStores = stores.filter((store) => store.permissions.includes('OWNER'));
    const storeLimit = getStoreLimit(user?.subscriptionType);

    if (user?.subscriptionType === 'BASIC') {
      navigate('/subscription');
      return;
    }

    if (ownedStores.length >= storeLimit) {
      addToast(
        `You can only own ${storeLimit} store${storeLimit > 1 ? 's' : ''}. Upgrade to create more stores.`,
        'info'
      );
      navigate('/subscription');
      return;
    }

    navigate('/stores/create');
  };

  useEffect(() => {
    const loadStores = async () => {
      if (user) {
        try {
          setLoading(true);

          const serverStores = await storeService.getMyStores();
          setStores([...serverStores]);

          const cameFromStore = location.state?.fromStorePage === true;

          if (serverStores.length === 1 && !cameFromStore) {
            const store = serverStores[0].storeId;
            navigate(`/store/${store}/dashboard`);
            return;
          }
        } catch (error) {
          console.error('Failed to load stores:', error);
          addToast('Failed to load stores', 'error');
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/auth');
      }
    };

    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleStoreSelect = (store) => {
    if (!store.store.isActive) {
      addToast('This store is currently inactive and unavailable', 'error');
      return;
    }
    if (user?.subscriptionType === 'BASIC' && store.permissions.includes('OWNER')) {
      addToast('Upgrade to a paid plan to access your owned stores', 'info');
      return;
    }
    navigate(`/store/${store.storeId}/dashboard`);
  };

  const getRoleColor = (permissions) => {
    const owner = permissions.includes('OWNER');
    if (owner) {
      return '#10b981';
    } else {
      return '#f59e0b';
    }
  };

  const getRoleLabel = (permissions) => {
    const owner = permissions.includes('OWNER');
    if (owner) {
      return 'Owner';
    } else {
      return '';
    }
  };

  return (
    <PageContainer
      title={'Your Stores'}
      description={
        stores.length > 0
          ? `You have ${stores.length} store${stores.length > 1 ? 's' : ''}. Choose one to manage.`
          : 'Get started by creating your first store.'
      }
      RightContent={
        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={() => navigate('/subscription')}>Subscription</Button>
          <Button onClick={logout} color={'#ef4444'}>
            Logout
          </Button>
        </div>
      }
      fixedSize
      minHeight={'80vh'}
      loading={loading}
      removeBorderSpace
    >
      <div style={{ padding: 32 }}>
        {stores.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              marginBottom: 24,
            }}
          >
            {stores.map((item) => {
              const isDisabled = !item.store.isActive;

              return (
                <div
                  key={item.store.id}
                  onClick={() => !isDisabled && handleStoreSelect(item)}
                  style={{
                    background: isDisabled
                      ? 'var(--color-bg-tertiary)'
                      : 'var(--color-bg-secondary)',
                    border: isDisabled ? '2px dashed #d1d5db' : '2px dashed var(--color-border)',
                    borderRadius: 18,
                    padding: 24,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    opacity: isDisabled ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.borderColor = '#111827';
                      e.currentTarget.style.background = 'var(--color-bg)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.background = 'var(--color-bg-secondary)';
                    }
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 8,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 18,
                          fontWeight: 700,
                          color: 'var(--color-text)',
                        }}
                      >
                        {item.store.name}
                      </h3>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: 12,
                          background: getRoleColor(item.permissions) + '20',
                          color: getRoleColor(item.permissions),
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {getRoleLabel(item.permissions)}
                      </div>
                      {isDisabled && (
                        <div
                          style={{
                            padding: '4px 12px',
                            borderRadius: 12,
                            background: '#ef444420',
                            color: '#ef4444',
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          INACTIVE
                        </div>
                      )}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: 'var(--color-text-secondary)',
                        fontSize: 14,
                      }}
                    >
                      {item.store.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 24,
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        minWidth: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--color-text-secondary)',
                          marginBottom: 4,
                          lineHeight: 1.2,
                        }}
                      >
                        Created
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--color-text)',
                          lineHeight: 1.1,
                        }}
                      >
                        {item.store.createdAt
                          ? new Date(parseInt(item.store.createdAt)).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Unknown'}
                      </div>
                    </div>
                    {item.store.contactCity && (
                      <div
                        style={{
                          textAlign: 'center',
                          minWidth: 80,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--color-text-secondary)',
                            marginBottom: 4,
                            lineHeight: 1.2,
                          }}
                        >
                          Location
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: 'var(--color-text)',
                            lineHeight: 1.1,
                          }}
                        >
                          {item.store.contactCity}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: '12px 20px',
                      borderRadius: 12,
                      background: isDisabled ? '#9ca3af' : '#111827',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 14,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isDisabled ? 'Store Inactive' : isDisabled ? 'Upgrade to Access' : 'Manage →'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <div
            onClick={handleCreateStoreClick}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '2px dashed var(--color-border)',
              borderRadius: 18,
              padding: 32,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
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
            {(() => {
              const ownedStores = stores.filter((store) => store.permissions.includes('OWNER'));
              const storeLimit = getStoreLimit(user?.subscriptionType);
              const isBasic = user?.subscriptionType === 'BASIC';
              const isLimitReached = ownedStores.length >= storeLimit && storeLimit !== Infinity;

              return (
                <>
                  <div
                    style={{
                      fontSize: 32,
                      marginBottom: 12,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {isBasic ? '⭐' : isLimitReached ? '🔒' : '+'}
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: 4,
                    }}
                  >
                    {isBasic
                      ? 'Upgrade to Create Store'
                      : isLimitReached
                        ? 'Upgrade for More Stores'
                        : 'Create New Store'}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: 'var(--color-text-secondary)',
                      fontSize: 14,
                    }}
                  >
                    {isBasic
                      ? 'Upgrade to a paid plan to start creating your own stores'
                      : isLimitReached
                        ? `You've reached your limit of ${storeLimit} store${storeLimit > 1 ? 's' : ''}. Upgrade to create more.`
                        : `You can create ${storeLimit === Infinity ? 'unlimited' : storeLimit - ownedStores.length} more store${storeLimit === Infinity || storeLimit - ownedStores.length > 1 ? 's' : ''} with your ${user?.subscriptionType} plan.`}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default StoreSelection;

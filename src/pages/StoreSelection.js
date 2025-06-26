import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

// Mock data - в реальном приложении это будет из GraphQL
const mockStores = [
  {
    id: '1',
    name: 'Tech Store',
    description: 'Electronics and gadgets store',
    role: 'OWNER',
    productsCount: 45,
    ordersCount: 123,
    revenue: '$12,540'
  },
  {
    id: '2', 
    name: 'Fashion Boutique',
    description: 'Clothing and accessories',
    role: 'MANAGER',
    productsCount: 89,
    ordersCount: 67,
    revenue: '$8,320'
  },
  {
    id: '3',
    name: 'Home & Garden',
    description: 'Furniture and home decor',
    role: 'OWNER',
    productsCount: 156,
    ordersCount: 234,
    revenue: '$24,870'
  },
  {
    id: '4',
    name: 'Sports World',
    description: 'Athletic gear and equipment',
    role: 'MANAGER',
    productsCount: 78,
    ordersCount: 145,
    revenue: '$15,720'
  },
  {
    id: '5',
    name: 'Book Corner',
    description: 'Books and educational materials',
    role: 'OWNER',
    productsCount: 234,
    ordersCount: 89,
    revenue: '$6,450'
  },
  {
    id: '6',
    name: 'Beauty Shop',
    description: 'Cosmetics and skincare products',
    role: 'COURIER',
    productsCount: 112,
    ordersCount: 298,
    revenue: '$18,960'
  },
  {
    id: '7',
    name: 'Pet Paradise',
    description: 'Pet supplies and accessories',
    role: 'MANAGER',
    productsCount: 67,
    ordersCount: 156,
    revenue: '$9,830'
  },
  {
    id: '8',
    name: 'Kitchen Pro',
    description: 'Kitchen appliances and cookware',
    role: 'OWNER',
    productsCount: 143,
    ordersCount: 187,
    revenue: '$21,340'
  }
];

const StoreSelection = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStores(mockStores);
      setLoading(false);
    }, 1000);
  }, []);

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
              Select Your Store
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
              Choose which store you&apos;d like to manage. You can switch between stores at any time.
            </p>
          </div>
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

        {/* Content Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 0, boxSizing: 'border-box', height: '80vh', overflowY: 'auto' }}>
          <div style={{ padding: 32 }}>
            {/* Stores List */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 16,
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
                    gap: 32,
                    alignItems: 'center'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                        Products
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                        {store.productsCount}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                        Orders
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                        {store.ordersCount}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                        Revenue
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>
                        {store.revenue}
                      </div>
                    </div>
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

            {/* Create New Store Button */}
            <div style={{
              background: 'var(--color-bg-secondary)',
              border: '2px dashed var(--color-border)',
              borderRadius: 18,
              padding: 32,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
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
  );
};

export default StoreSelection; 
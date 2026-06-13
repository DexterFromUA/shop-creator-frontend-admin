import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageContainer from '../components/common/PageContainer';
import './Dashboard.css';

const orders = [
  {
    id: '#10402',
    customer: 'Savannah Nguyen',
    total: '$299.00',
    status: 'Delivered',
    date: '12 min ago',
  },
  {
    id: '#10401',
    customer: 'Jerome Bell',
    total: '$189.00',
    status: 'Pending',
    date: '22 min ago',
  },
  { id: '#10400', customer: 'Jacob Jones', total: '$78.50', status: 'Shipped', date: '1 h ago' },
  {
    id: '#10399',
    customer: 'Kristin Watson',
    total: '$54.00',
    status: 'Delivered',
    date: '3 h ago',
  },
  { id: '#10398', customer: 'Cody Fisher', total: '$249.00', status: 'Pending', date: 'Yesterday' },
  {
    id: '#10397',
    customer: 'Leslie Alexander',
    total: '$129.95',
    status: 'Shipped',
    date: 'Yesterday',
  },
  {
    id: '#10396',
    customer: 'Darlene Robertson',
    total: '$56.00',
    status: 'Failed',
    date: '2 days ago',
  },
  {
    id: '#10395',
    customer: 'Annette Black',
    total: '$220.00',
    status: 'Delivered',
    date: '3 days ago',
  },
  {
    id: '#10394',
    customer: 'Marvin McKinney',
    total: '$156.75',
    status: 'Shipped',
    date: '4 days ago',
  },
  {
    id: '#10393',
    customer: 'Esther Howard',
    total: '$89.99',
    status: 'Delivered',
    date: '5 days ago',
  },
];

const statusBgColor = {
  Delivered: 'rgba(34,197,94,0.12)', // green
  Pending: 'rgba(245,158,11,0.12)', // yellow
  Shipped: 'rgba(139,92,246,0.12)', // purple
  Failed: 'rgba(239,68,68,0.12)', // red
};

const statusColor = {
  Delivered: 'var(--color-success)',
  Pending: 'var(--color-warning)',
  Shipped: 'var(--color-accent)',
  Failed: 'var(--color-error)',
};

const statusOptions = ['All', 'Delivered', 'Pending', 'Shipped', 'Failed'];

const Orders = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = orders.filter(
    (order) =>
      (status === 'All' || order.status === status) &&
      (order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Search and Filter Card */}
      <PageContainer
        title="Orders"
        description="Track and manage customer orders, deliveries, and payments"
      >
        <div
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ position: 'relative', minWidth: 140, maxWidth: 220, flex: 1 }}>
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '0.7rem 1rem 0.7rem 2.5rem',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                fontSize: 15,
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                width: '100%',
                minWidth: 0,
                maxWidth: 220,
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                fontSize: '1.1rem',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
              backgroundSize: '18px',
            }}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </PageContainer>
      <PageContainer minHeight="65vh" fixedSize removeBorderSpace removeBottomSpace>
        {filtered.length === 0 ? (
          <div style={{ color: '#aaa', padding: '32px 0', textAlign: 'center' }}>No orders</div>
        ) : (
          filtered.map((order, i) => (
            <React.Fragment key={order.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 32px',
                  gap: 16,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onClick={() => navigate(`/store/${storeId}/orders/${order.id.replace('#', '')}`)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    navigate(`/store/${storeId}/orders/${order.id.replace('#', '')}`);
                }}
                role="button"
                aria-label={`View order ${order.id}`}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = 'var(--color-bg-secondary)')
                }
                onMouseOut={(e) => (e.currentTarget.style.background = '')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span
                    style={{
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-accent)',
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: 10,
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {order.id.replace('#', '')}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>{order.customer}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
                      {order.date}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span
                    style={{
                      background: statusBgColor[order.status],
                      color: statusColor[order.status],
                      fontWeight: 600,
                      fontSize: 15,
                      borderRadius: 24,
                      padding: '0.35em 0',
                      display: 'inline-block',
                      width: 120,
                      textAlign: 'center',
                    }}
                  >
                    {order.status}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      fontSize: 17,
                      width: 100,
                      display: 'inline-block',
                      textAlign: 'right',
                    }}
                  >
                    {order.total}
                  </span>
                  <button
                    title="View"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: 'none',
                      borderRadius: 8,
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.18s',
                      color: 'var(--color-accent)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/store/${storeId}/orders/${order.id.replace('#', '')}`);
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l3 3" />
                    </svg>
                  </button>
                  <button
                    title="Delete"
                    style={{
                      background: 'var(--color-bg-secondary)',
                      border: 'none',
                      borderRadius: 8,
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.18s',
                      color: '#ef4444',
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="6" width="18" height="14" rx="2" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
              {i !== filtered.length - 1 && (
                <div
                  style={{ borderBottom: '1px solid var(--color-bg-secondary)', margin: '0 32px' }}
                />
              )}
            </React.Fragment>
          ))
        )}
      </PageContainer>
    </>
  );
};

export default Orders;

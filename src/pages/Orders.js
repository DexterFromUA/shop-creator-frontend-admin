import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageContainer from '../components/common/PageContainer';
import { orderService } from '../utils/graphql';
import { formatPrice } from '../utils/helpers';
import './Dashboard.css';

const statusBgColor = {
  PAID: 'rgba(34,197,94,0.12)',
  PENDING: 'rgba(245,158,11,0.12)',
  IN_PROGRESS: 'rgba(139,92,246,0.12)',
  READY_FOR_PICKUP: 'rgba(59,130,246,0.12)',
  DELIVERED: 'rgba(34,197,94,0.12)',
  CANCELLED_BY_USER: 'rgba(239,68,68,0.12)',
  CANCELLED_BY_STORE: 'rgba(239,68,68,0.12)',
};

const statusColor = {
  PAID: 'var(--color-success)',
  PENDING: 'var(--color-warning)',
  IN_PROGRESS: 'var(--color-accent)',
  READY_FOR_PICKUP: '#2563eb',
  DELIVERED: 'var(--color-success)',
  CANCELLED_BY_USER: 'var(--color-error)',
  CANCELLED_BY_STORE: 'var(--color-error)',
};

const statusOptions = [
  'All',
  'PAID',
  'PENDING',
  'IN_PROGRESS',
  'READY_FOR_PICKUP',
  'DELIVERED',
  'CANCELLED_BY_USER',
  'CANCELLED_BY_STORE',
];

const formatStatus = (status) => status.replaceAll('_', ' ').toLowerCase();

const formatOrderDate = (date) => {
  console.log(date);
  if (!date) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(Number(date)));
};

const Orders = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await orderService.getStoreOrders(storeId);
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      loadOrders();
    }
  }, [storeId]);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      const matchesStatus = status === 'All' || order.status === status;
      const matchesSearch =
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  return (
    <>
      <PageContainer
        title="Orders"
        description="Track and manage customer orders, deliveries, and payments"
        loading={loading}
        error={Boolean(error)}
        errorDescription={error}
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
          <div style={{ position: 'relative', minWidth: 140, maxWidth: 260, flex: 1 }}>
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
                maxWidth: 260,
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
              minWidth: 180,
            }}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'All' ? 'All' : formatStatus(opt)}
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
                onClick={() => navigate(`/store/${storeId}/orders/${order.id}`)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    navigate(`/store/${storeId}/orders/${order.id}`);
                }}
                role="button"
                aria-label={`View order ${order.id}`}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = 'var(--color-bg-secondary)')
                }
                onMouseOut={(e) => (e.currentTarget.style.background = '')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0 }}>
                  <span
                    style={{
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-accent)',
                      fontWeight: 700,
                      fontSize: 14,
                      borderRadius: 10,
                      width: 74,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {order.id.slice(0, 8)}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>{order.customerName}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
                      {formatOrderDate(order.createdAt)} · {order.customerPhone}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span
                    style={{
                      background: statusBgColor[order.status],
                      color: statusColor[order.status],
                      fontWeight: 600,
                      fontSize: 13,
                      borderRadius: 24,
                      padding: '0.35em 0',
                      display: 'inline-block',
                      width: 150,
                      textAlign: 'center',
                      textTransform: 'capitalize',
                    }}
                  >
                    {formatStatus(order.status)}
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
                    {formatPrice(order.totalPrice)}
                  </span>
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

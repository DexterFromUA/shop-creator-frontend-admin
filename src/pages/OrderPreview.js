import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import { orderService } from '../utils/graphql';
import { formatPrice } from '../utils/helpers';
import './Dashboard.css';

const statusOptions = [
  'PAID',
  'PENDING',
  'IN_PROGRESS',
  'READY_FOR_PICKUP',
  'DELIVERED',
  'CANCELLED_BY_USER',
  'CANCELLED_BY_STORE',
];

const statusClass = {
  PAID: 'status-badge status-delivered',
  PENDING: 'status-badge status-pending',
  IN_PROGRESS: 'status-badge status-shipped',
  READY_FOR_PICKUP: 'status-badge status-shipped',
  DELIVERED: 'status-badge status-delivered',
  CANCELLED_BY_USER: 'status-badge status-failed',
  CANCELLED_BY_STORE: 'status-badge status-failed',
};

const formatStatus = (status) => status.replaceAll('_', ' ').toLowerCase();

const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(Number(date)));
};

const OrderPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

  const handleStatusChange = async (event) => {
    const status = event.target.value;

    try {
      setUpdating(true);
      const data = await orderService.updateOrderStatus(order.id, status);
      setOrder(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (error && !order) {
    return (
      <div className="dashboard">
        <h2>Order not found</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <PageContainer
      title={order ? `Order #${order.id.slice(0, 8)}` : 'Order'}
      loading={loading}
      error={Boolean(error && !order)}
      errorDescription={error}
      LeftComponent={
        <Button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.8rem 1.2rem' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Button>
      }
      RightContent={
        order && (
          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updating}
            style={{
              padding: '0.7rem 1rem',
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              fontSize: 15,
              minWidth: 190,
              textTransform: 'capitalize',
            }}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        )
      }
      minHeight="auto"
    >
      {order && (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 32,
            }}
          >
            <div style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                {order.customerName}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
                {order.customerPhone}
              </div>
              {order.customerEmail && (
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
                  {order.customerEmail}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  {formatDate(order.createdAt)}
                </span>
                <span className={statusClass[order.status]} style={{ fontSize: 15 }}>
                  {formatStatus(order.status)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 160 }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 8 }}>
                Total
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: 24 }}>
                {formatPrice(order.totalPrice)}
              </div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 6 }}>
                {order.paymentMethod} · {order.paymentStatus}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              padding: 18,
              background: 'var(--color-bg-secondary)',
              borderRadius: 12,
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Delivery</div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              {[order.deliveryCountry, order.deliveryCity, order.deliveryAddress]
                .filter(Boolean)
                .join(', ') || 'No delivery details'}
            </div>
            {order.note && (
              <div style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
                Note: {order.note}
              </div>
            )}
            {order.shortLink?.code && (
              <div style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
                Source link: /q/{order.shortLink.code}
              </div>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <table
              className="dashboard-table"
              style={{ width: '100%', background: 'var(--color-bg)' }}
            >
              <thead>
                <tr>
                  <th style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>
                    Product
                  </th>
                  <th style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>Qty</th>
                  <th style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>
                    Unit
                  </th>
                  <th style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontSize: 16 }}>
                      <div style={{ fontWeight: 700 }}>{item.productName}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                        {item.optionName || 'Default'}
                        {item.isPreOrder ? ' · preorder' : ''}
                        {item.discountPercent > 0 ? ` · ${item.discountPercent}% off` : ''}
                      </div>
                    </td>
                    <td style={{ fontSize: 16 }}>{item.quantity}</td>
                    <td style={{ fontSize: 16 }}>{formatPrice(item.finalUnitPrice)}</td>
                    <td style={{ fontSize: 16 }}>{formatPrice(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default OrderPreview;

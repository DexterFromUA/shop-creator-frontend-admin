import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PageContainer from '../components/common/PageContainer';
import { orderService } from '../utils/graphql';
import { formatPrice } from '../utils/helpers';
import './Dashboard.css';

const Receipt = () => {
  const { code } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReceipt = async () => {
      try {
        setLoading(true);
        const data = await orderService.getReceipt(code);
        if (data) {
          setOrder(data);
        } else {
          setError('Receipt not found');
        }
      } catch (err) {
        console.error('Error loading receipt:', err);
        setError(err.message || 'Failed to load receipt');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      loadReceipt();
    }
  }, [code]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(Number(date)));
  };

  const getStatusLabel = (status) => {
    return status.replaceAll('_', ' ').toLowerCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
      case 'DELIVERED':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: 'var(--color-success, #22c55e)' };
      case 'PENDING':
        return { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--color-warning, #f59e0b)' };
      case 'IN_PROGRESS':
      case 'READY_FOR_PICKUP':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--color-accent, #3b82f6)' };
      default:
        return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--color-error, #ef4444)' };
    }
  };

  if (loading) {
    return (
      <PageContainer
        loading={true}
        title="Loading Receipt"
        description="Fetching receipt details..."
      >
        <div />
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer
        error={true}
        errorDescription={error || 'Receipt not found'}
        title="Receipt Error"
      >
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>
            We couldn&apos;t find the receipt you&apos;re looking for. Please double check the URL.
          </p>
        </div>
      </PageContainer>
    );
  }

  const statusStyle = getStatusColor(order.status);

  return (
    <PageContainer title="Order Receipt" description={`Receipt code: ${order.receiptCode}`}>
      <div style={{ maxWidth: 650, margin: '0 auto', padding: '10px 0' }}>
        {/* Receipt Header Card */}
        <div
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 20,
            padding: 32,
            textAlign: 'center',
            marginBottom: 24,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <h2
            style={{
              margin: '0 0 8px 0',
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--color-text)',
            }}
          >
            Thank you for your purchase!
          </h2>
          <p style={{ margin: '0 0 24px 0', color: 'var(--color-text-secondary)', fontSize: 15 }}>
            Your order has been received and processed successfully.
          </p>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 20,
              background: statusStyle.bg,
              color: statusStyle.text,
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {getStatusLabel(order.status)}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 20,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Store & Order ID Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Store
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
                {order.store?.name || 'Store'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Order ID
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
                #{order.id.slice(0, 8).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Date & Payment Method */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Date
              </div>
              <div style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 500 }}>
                {formatDate(order.createdAt)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Payment Method
              </div>
              <div style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 500 }}>
                {order.paymentMethod || 'MOCK_CARD'}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
            <div
              style={{
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Customer & Shipping Details
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                fontSize: 14,
                color: 'var(--color-text)',
              }}
            >
              <div>
                <strong style={{ fontWeight: 600 }}>Name:</strong> {order.customerName}
              </div>
              <div>
                <strong style={{ fontWeight: 600 }}>Phone:</strong> {order.customerPhone}
              </div>
              {order.customerEmail && (
                <div>
                  <strong style={{ fontWeight: 600 }}>Email:</strong> {order.customerEmail}
                </div>
              )}
              <div style={{ marginTop: 6 }}>
                <strong style={{ fontWeight: 600 }}>Address:</strong>{' '}
                {[order.deliveryCountry, order.deliveryCity, order.deliveryAddress]
                  .filter(Boolean)
                  .join(', ') || 'No delivery address'}
              </div>
              {order.note && (
                <div
                  style={{
                    marginTop: 6,
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <strong>Note:</strong> &quot;{order.note}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Items
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 14,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                      {item.productName}
                    </div>
                    <div
                      style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginTop: 2 }}
                    >
                      {item.optionName || 'Default'} x {item.quantity}
                      {item.discountPercent > 0 && (
                        <span style={{ color: 'var(--color-success)', marginLeft: 8 }}>
                          {item.discountPercent}% off
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                    {formatPrice(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div
            style={{
              borderTop: '2px solid var(--color-border)',
              paddingTop: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
              Total Paid
            </span>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#a78bfa' }}>
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Receipt;

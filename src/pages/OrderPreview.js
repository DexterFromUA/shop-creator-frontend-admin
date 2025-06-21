import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const orders = [
  { id: '10402', customer: 'Savannah Nguyen', total: '$299.00', status: 'Delivered', date: '12 min ago', items: [
    { name: 'Product A', qty: 1, price: '$199.00' },
    { name: 'Product B', qty: 2, price: '$50.00' },
  ] },
  { id: '10401', customer: 'Jerome Bell', total: '$189.00', status: 'Pending', date: '22 min ago', items: [
    { name: 'Product C', qty: 1, price: '$189.00' },
  ] },
  // ...add more mock orders as needed
];

const statusClass = {
  Delivered: 'status-badge status-delivered',
  Pending: 'status-badge status-pending',
  Shipped: 'status-badge status-shipped',
  Failed: 'status-badge status-failed',
};

const OrderPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return <div className="dashboard"><h2>Order not found</h2></div>;
  }

  return (
    <div className="dashboard" style={{ minHeight: '100vh', background: 'var(--color-bg-secondary)', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32 }}>
          <button
            onClick={() => navigate(-1)}
            className="order-back-btn"
            aria-label="Back"
            style={{ fontSize: 18 }}
          >
            <span style={{ fontSize: 20 }}>&larr;</span> Back
          </button>
          <span style={{ fontWeight: 800, fontSize: 32, color: 'var(--color-text)' }}>Order #{order.id}</span>
        </div>
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 0, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '32px 32px 0 32px', gap: 32 }}>
            <div style={{ minWidth: 220 }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{order.customer}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 8 }}>{order.date}</div>
              <span className={statusClass[order.status]} style={{ fontSize: 15 }}>{order.status}</span>
            </div>
            <div style={{ textAlign: 'right', minWidth: 120 }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 8 }}>Total</div>
              <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: 24 }}>{order.total}</div>
            </div>
          </div>
          <div style={{ padding: '0 32px 32px 32px', marginTop: 24 }}>
            <table className="dashboard-table" style={{ width: '100%', background: 'var(--color-bg)' }}>
              <thead>
                <tr>
                  <th style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>Product</th>
                  <th style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>Qty</th>
                  <th style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-text)' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontSize: 16 }}>{item.name}</td>
                    <td style={{ fontSize: 16 }}>{item.qty}</td>
                    <td style={{ fontSize: 16 }}>{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPreview; 
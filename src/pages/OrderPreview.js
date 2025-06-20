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
    <div className="dashboard" style={{ padding: 0 }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '16px' }}>
          <button
            onClick={() => navigate(-1)}
            className="order-back-btn"
            aria-label="Back"
          >
            <span style={{ fontSize: 20 }}>&larr;</span> Back
          </button>
          <h1 className="dashboard-header" style={{ margin: 0 }}>Order #{order.id}</h1>
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          <div className="dashboard-card dashboard-card--no-hover" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div>
                <strong>Customer:</strong> {order.customer}<br />
                <strong>Status:</strong> <span className={statusClass[order.status]}>{order.status}</span><br />
                <strong>Total:</strong> {order.total}<br />
                <strong>Date:</strong> {order.date}
              </div>
            </div>
            <table className="dashboard-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
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
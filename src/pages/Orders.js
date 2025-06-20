import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const orders = [
  { id: '#10402', customer: 'Savannah Nguyen', total: '$299.00', status: 'Delivered', date: '12 min ago' },
  { id: '#10401', customer: 'Jerome Bell', total: '$189.00', status: 'Pending', date: '22 min ago' },
  { id: '#10400', customer: 'Jacob Jones', total: '$78.50', status: 'Shipped', date: '1 h ago' },
  { id: '#10399', customer: 'Kristin Watson', total: '$54.00', status: 'Delivered', date: '3 h ago' },
  { id: '#10398', customer: 'Cody Fisher', total: '$249.00', status: 'Pending', date: 'Yesterday' },
  { id: '#10397', customer: 'Leslie Alexander', total: '$129.95', status: 'Shipped', date: 'Yesterday' },
  { id: '#10396', customer: 'Darlene Robertson', total: '$56.00', status: 'Failed', date: '2 days ago' },
  { id: '#10395', customer: 'Annette Black', total: '$220.00', status: 'Delivered', date: '3 days ago' },
  { id: '#10394', customer: 'Marvin McKinney', total: '$156.75', status: 'Shipped', date: '4 days ago' },
  { id: '#10393', customer: 'Esther Howard', total: '$89.99', status: 'Delivered', date: '5 days ago' },
  { id: '#10392', customer: 'Robert Fox', total: '$342.50', status: 'Pending', date: '6 days ago' },
  { id: '#10391', customer: 'Eleanor Pena', total: '$67.25', status: 'Failed', date: '1 week ago' },
  { id: '#10390', customer: 'Guy Hawkins', total: '$178.00', status: 'Delivered', date: '1 week ago' },
  { id: '#10389', customer: 'Jenny Wilson', total: '$445.75', status: 'Shipped', date: '1 week ago' },
  { id: '#10388', customer: 'Cameron Williamson', total: '$123.45', status: 'Pending', date: '1 week ago' },
  { id: '#10387', customer: 'Brooklyn Simmons', total: '$267.80', status: 'Delivered', date: '2 weeks ago' },
  { id: '#10386', customer: 'Theresa Webb', total: '$98.99', status: 'Shipped', date: '2 weeks ago' },
  { id: '#10385', customer: 'Ronald Richards', total: '$189.50', status: 'Failed', date: '2 weeks ago' },
  { id: '#10384', customer: 'Albert Flores', total: '$334.25', status: 'Delivered', date: '2 weeks ago' },
  { id: '#10383', customer: 'Kathryn Murphy', total: '$76.80', status: 'Pending', date: '2 weeks ago' },
  { id: '#10382', customer: 'Bessie Cooper', total: '$156.00', status: 'Shipped', date: '3 weeks ago' },
  { id: '#10381', customer: 'Arlene McCoy', total: '$289.75', status: 'Delivered', date: '3 weeks ago' },
  { id: '#10380', customer: 'Devon Lane', total: '$112.50', status: 'Failed', date: '3 weeks ago' },
  { id: '#10379', customer: 'Darrell Steward', total: '$198.25', status: 'Pending', date: '3 weeks ago' },
  { id: '#10378', customer: 'Floyd Miles', total: '$445.00', status: 'Delivered', date: '3 weeks ago' },
  { id: '#10377', customer: 'Courtney Henry', total: '$89.99', status: 'Shipped', date: '4 weeks ago' },
  { id: '#10376', customer: 'Wade Warren', total: '$167.80', status: 'Delivered', date: '4 weeks ago' },
  { id: '#10375', customer: 'Brett Cunningham', total: '$234.50', status: 'Failed', date: '4 weeks ago' },
  { id: '#10374', customer: 'Dianne Russell', total: '$78.25', status: 'Pending', date: '4 weeks ago' },
  { id: '#10373', customer: 'Ted Howard', total: '$345.75', status: 'Delivered', date: '1 month ago' },
  { id: '#10372', customer: 'Cameron Bell', total: '$123.45', status: 'Shipped', date: '1 month ago' },
];

const statusClass = {
  Delivered: 'status-badge status-delivered',
  Pending: 'status-badge status-pending',
  Shipped: 'status-badge status-shipped',
  Failed: 'status-badge status-failed',
};

const statusOptions = ['All', 'Delivered', 'Pending', 'Shipped', 'Failed'];

const Orders = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = orders.filter(order =>
    (status === 'All' || order.status === status) &&
    (order.customer.toLowerCase().includes(search.toLowerCase()) ||
     order.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard" style={{ padding: 0 }}>
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px' }}>
          <h1 className="dashboard-header">Orders</h1>
        </div>

        <div style={{ padding: '0 16px 16px 16px' }}>
          <div className="dashboard-card dashboard-card--no-hover" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ position: 'relative', width: '300px' }}>
                <input
                  type="text"
                  placeholder="Search orders by customer or order ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                    border: '2px solid var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    width: '100%'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '1.1rem',
                  pointerEvents: 'none'
                }}>
                  🔍
                </span>
              </div>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                style={{ 
                  padding: '0.875rem 2.5rem 0.875rem 1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.2em'
                }}
              >
                {statusOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <table className="dashboard-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}>
                    <td style={{ color: 'var(--color-accent)', fontWeight: '600' }}>{order.id}</td>
                    <td>{order.customer}</td>
                    <td style={{ fontWeight: '600' }}>{order.total}</td>
                    <td><span className={statusClass[order.status]}>{order.status}</span></td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{order.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-bg)', color: 'var(--color-text)', cursor: 'pointer' }}>View</button>
                        <button style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-error)', borderRadius: 6, background: 'var(--color-error-bg)', color: 'var(--color-error)', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
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

export default Orders; 
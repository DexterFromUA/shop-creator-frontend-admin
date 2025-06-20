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
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = orders.filter(order =>
    (status === 'All' || order.status === status) &&
    (order.customer.toLowerCase().includes(search.toLowerCase()) ||
     order.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ background: 'var(--color-bg-secondary)' }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 0' }}>
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 0, overflow: 'hidden', width: '100%' }}>
          {filtered.length === 0 ? (
            <div style={{ color: '#aaa', padding: '32px 0', textAlign: 'center' }}>No orders</div>
          ) : filtered.map((order, i) => (
            <React.Fragment key={order.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-accent)', fontWeight: 700, fontSize: 16, borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{order.id.replace('#', '')}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>{order.customer}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>{order.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span style={{
                    background: statusBgColor[order.status],
                    color: statusColor[order.status],
                    fontWeight: 600,
                    fontSize: 15,
                    borderRadius: 24,
                    padding: '0.35em 0',
                    display: 'inline-block',
                    width: 120,
                    textAlign: 'center',
                  }}>{order.status}</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 17, width: 100, display: 'inline-block', textAlign: 'right' }}>{order.total}</span>
                  <button title="View" style={{ background: 'var(--color-bg-secondary)', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.18s', color: 'var(--color-accent)' }} onClick={() => navigate(`/orders/${order.id.replace('#', '')}`)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  </button>
                  <button title="Delete" style={{ background: 'var(--color-bg-secondary)', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.18s', color: '#ef4444' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
              {i !== filtered.length - 1 && <div style={{ borderBottom: '1px solid var(--color-bg-secondary)', margin: '0 32px' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders; 
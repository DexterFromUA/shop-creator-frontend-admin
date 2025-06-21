import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css'; // reuse generic dashboard styles

const initialClients = [
  { id: 1, name: 'Olivia Brown', email: 'olivia@example.com', status: 'active' },
  { id: 2, name: 'Liam Smith', email: 'liam@example.com', status: 'active' },
  { id: 3, name: 'Emma Johnson', email: 'emma@example.com', status: 'blocked' },
  { id: 4, name: 'Noah Williams', email: 'noah@example.com', status: 'active' },
];

const MessageModal = ({ open, onClose, onSend, user }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            style={{ background: 'var(--color-bg)', padding: '24px 32px', borderRadius: 24, width: '100%', maxWidth: 480, position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Message {user?.name}</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0 }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <textarea
                autoFocus
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }}
              />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={onClose} style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Send</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Users = () => {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState({ open: false, user: null });

  const filtered = clients.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleBlock = id => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c));
  };

  const handleSendMessage = (userId, message) => {
    console.log(`Send to ${userId}: ${message}`);
    // placeholder for actual messaging logic
  };

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 16px', boxSizing: 'border-box' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Users
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            List of your shop clients
          </p>
        </div>

        {/* Toolbar */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: '24px 32px', marginBottom: 32, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', minWidth: 140, maxWidth: 220, flexShrink: 1 }}>
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '0.7rem 1rem 0.7rem 2.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  fontSize: 15,
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  width: '100%',
                }}
              />
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)', fontSize: '1.1rem', pointerEvents: 'none' }}>🔍</span>
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
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
                backgroundSize: '18px'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* List Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 0, width: '100%', height: '60vh', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ color: '#aaa', padding: '32px 0', textAlign: 'center' }}>No users found</div>
          ) : (
            <div style={{ padding: 0 }}>
              {filtered.map((user, idx) => (
                <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 100px auto', alignItems: 'center', padding: '18px 32px', borderBottom: idx !== filtered.length - 1 ? '1px solid var(--color-border)' : 'none', columnGap: 16 }}>
                  <div style={{ fontSize: 20 }}>{user.status === 'blocked' ? '⛔' : '🛍️'}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{user.name}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>{user.email}</div>
                  </div>
                  <span style={{ justifySelf: 'start', fontSize: 13, padding: '2px 8px', borderRadius: 6, background: user.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: user.status === 'active' ? '#10b981' : '#ef4444', fontWeight: 600, textTransform: 'capitalize' }}>
                    {user.status}
                  </span>
                  <div style={{ display: 'flex', gap: 8, justifySelf: 'end' }}>
                    <button
                      onClick={() => toggleBlock(user.id)}
                      style={{ padding: '0.5rem 0.8rem', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: 14 }}
                    >
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                    <button
                      onClick={() => setModal({ open: true, user })}
                      style={{ padding: '0.5rem 0.8rem', borderRadius: 8, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <MessageModal
        open={modal.open}
        user={modal.user}
        onClose={() => setModal({ open: false, user: null })}
        onSend={(msg) => handleSendMessage(modal.user.id, msg)}
      />
    </div>
  );
};

export default Users; 
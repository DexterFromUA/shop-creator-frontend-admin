import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './Dashboard.css';

const initialManagers = [
  { id: 1, name: 'Anna Goodwin', email: 'anna@market.io', role: 'manager', status: 'active' },
  { id: 2, name: 'Carlos Diaz', email: 'carlos@market.io', role: 'manager', status: 'active' },
  { id: 3, name: 'Sarah Johnson', email: 'sarah@market.io', role: 'manager', status: 'inactive' },
  { id: 4, name: 'Michael Chen', email: 'michael@market.io', role: 'manager', status: 'active' },
];

const initialCouriers = [
  { id: 1, name: 'Leila Patel', email: 'leila@market.io', role: 'courier', status: 'active' },
  { id: 2, name: 'Tomás Silva', email: 'tomas@market.io', role: 'courier', status: 'active' },
  { id: 3, name: 'Emma Wilson', email: 'emma@market.io', role: 'courier', status: 'active' },
  { id: 4, name: 'David Kim', email: 'david@market.io', role: 'courier', status: 'inactive' },
  { id: 5, name: 'Maria Garcia', email: 'maria@market.io', role: 'courier', status: 'active' },
];

const AddUserModal = ({ open, onClose, onAdd, role }) => {
  const [form, setForm] = useState({ name: '', email: '' });

  const handleClose = () => {
    setForm({ name: '', email: '' });
    onClose();
  };

  const handleSubmit = e => {
    e.preventDefault();
    onAdd(form);
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            style={{ background: 'var(--color-bg)', padding: '24px 32px', borderRadius: 24, width: '100%', maxWidth: 480, position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Add {role === 'manager' ? 'Manager' : 'Courier'}</h2>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0 }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Name</label>
                <input autoFocus required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}>Email</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ boxSizing: 'border-box', width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={handleClose} style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Add User</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Team = () => {
  const { currentStore } = useStore();
  const navigate = useNavigate();
  
  const [managers, setManagers] = useState(initialManagers);
  const [couriers, setCouriers] = useState(initialCouriers);
  const [modal, setModal] = useState({ open: false, role: null });
  const [search, setSearch] = useState('');

  const allUsers = [...managers, ...couriers];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  const handleAdd = (role, user) => {
    if (!user.name.trim() || !user.email.trim()) return;
    const newUser = { id: Date.now(), ...user, role, status: 'active' };
    if (role === 'manager') {
      setManagers([...managers, newUser]);
    } else {
      setCouriers([...couriers, newUser]);
    }
  };

  const handleDelete = (userId, role) => {
    if (role === 'manager') {
      setManagers(managers.filter(m => m.id !== userId));
    } else {
      setCouriers(couriers.filter(c => c.id !== userId));
    }
  };

  const handleStatusToggle = (userId, role) => {
    if (role === 'manager') {
      setManagers(managers.map(m => 
        m.id === userId ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
      ));
    } else {
      setCouriers(couriers.map(c => 
        c.id === userId ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
      ));
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#10b981' : '#6b7280';
  };

  const getStatusBgColor = (status) => {
    return status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)';
  };

  // Проверяем подписку владельца стора
  const isOwnerProOrUnlimited = currentStore?.owner?.subscriptionType === 'PRO' || 
                                 currentStore?.owner?.subscriptionType === 'UNLIMITED';

  // Если подписка не подходит, показываем сообщение об ограничении
  if (!isOwnerProOrUnlimited) {
    return (
      <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: '48px 16px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 800, width: '100%', margin: '0 auto' }}>
          <div className="dashboard-card" style={{ 
            background: 'var(--color-bg)', 
            borderRadius: 28, 
            boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', 
            padding: 48,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🔒</div>
            <h1 style={{ margin: '0 0 16px 0', fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
              Premium Feature
            </h1>
            <p style={{ margin: '0 0 32px 0', fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Team management is available for stores with PRO subscriptions. 
              The store owner needs to upgrade their subscription to access this feature.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={() => navigate(`/store/${currentStore?.id}/dashboard`)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate('/stores')}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#111827',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Manage Stores
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 16px', boxSizing: 'border-box' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Team
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Manage your team—admins, managers & couriers
          </p>
        </div>

        {/* Search and Filter Toolbar */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: '24px 32px', marginBottom: 32, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', minWidth: 140, maxWidth: 220, flexShrink: 1 }}>
            <input
              type="text"
              placeholder="Search team..."
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
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => setModal({ open: true, role: 'manager' })} 
              style={{ 
                background: 'var(--color-bg-secondary)', 
                color: 'var(--color-text)', 
                border: '1px solid var(--color-border)', 
                borderRadius: 10, 
                padding: '0.7rem 1.2rem', 
                fontWeight: 600, 
                fontSize: 15, 
                cursor: 'pointer' 
              }}
            >
              + Add Manager
            </button>
            <button 
              onClick={() => setModal({ open: true, role: 'courier' })} 
              style={{ 
                background: 'var(--color-bg-secondary)', 
                color: 'var(--color-text)', 
                border: '1px solid var(--color-border)', 
                borderRadius: 10, 
                padding: '0.7rem 1.2rem', 
                fontWeight: 600, 
                fontSize: 15, 
                cursor: 'pointer' 
              }}
            >
              + Add Courier
            </button>
          </div>
        </div>

        {/* Search and Filter Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', padding: 0, width: '100%', height: '60vh', overflowY: 'auto' }}>
          {filteredUsers.length === 0 ? (
            <div style={{ color: '#aaa', padding: '32px 0', textAlign: 'center' }}>No users found</div>
          ) : (
            <div style={{ padding: 0 }}>
              {filteredUsers.map((user, i) => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: i === filteredUsers.length - 1 ? 'none' : '1px solid var(--color-border)', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 220 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                      {user.role === 'manager' ? '👔' : '🚚'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{user.name}</h3>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>{user.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ background: getStatusBgColor(user.status), color: getStatusColor(user.status), padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{user.status}</span>
                    <button 
                      onClick={() => handleStatusToggle(user.id, user.role)}
                      style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 10px', fontSize: 13, cursor: 'pointer', color: 'var(--color-text)' }}
                    >
                      Toggle
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id, user.role)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: 18, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AddUserModal 
          open={modal.open}
          onClose={() => setModal({ open: false, role: null })}
          onAdd={(data) => handleAdd(modal.role, data)}
          role={modal.role}
        />
      </div>
    </div>
  );
};

export default Team; 
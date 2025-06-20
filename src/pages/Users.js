import React, { useState } from 'react';
import './Dashboard.css';

const initialManagers = [
  { id: 1, name: 'Anna Goodwin', email: 'anna@market.io' },
  { id: 2, name: 'Carlos Diaz', email: 'carlos@market.io' },
];

const initialCouriers = [
  { id: 1, name: 'Leila Patel', email: 'leila@market.io' },
  { id: 2, name: 'Tomás Silva', email: 'tomas@market.io' },
];

const AddUserModal = ({ open, onClose, onAdd, role }) => {
  const [form, setForm] = useState({ name: '', email: '' });
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <h2 style={{ marginTop: 0, marginBottom: 24 }}>Add {role === 'manager' ? 'Manager' : 'Courier'}</h2>
        <form onSubmit={e => { e.preventDefault(); onAdd(form); setForm({ name: '', email: '' }); onClose(); }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Name</label><br />
            <input autoFocus name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--color-border)', width: '100%' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 500 }}>Email</label><br />
            <input name="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--color-border)', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1.2rem', borderRadius: 8, background: 'var(--color-bg-secondary)', color: 'var(--color-text)', border: 'none', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '0.5rem 1.2rem', borderRadius: 8, background: 'var(--color-accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Users = () => {
  const [managers, setManagers] = useState(initialManagers);
  const [couriers, setCouriers] = useState(initialCouriers);
  const [modal, setModal] = useState({ open: false, role: null });

  const handleAdd = (role, user) => {
    if (!user.name.trim() || !user.email.trim()) return;
    if (role === 'manager') {
      setManagers([...managers, { id: Date.now(), ...user }]);
    } else {
      setCouriers([...couriers, { id: Date.now(), ...user }]);
    }
  };

  const renderUser = user => (
    <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ececff&color=6d28d9&size=48`} alt={user.name} style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', background: '#ececff' }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 20 }}>{user.name}</div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 16 }}>{user.email}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button title="Edit" style={{ background: 'var(--color-bg-secondary)', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.18s', color: 'var(--color-accent)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.474 5.474l2.052 2.052a1.5 1.5 0 0 1 0 2.121l-9.193 9.193-3.182.424.424-3.182 9.193-9.193a1.5 1.5 0 0 1 2.121 0z"/>
            <path d="M15 7l2 2"/>
          </svg>
        </button>
        <button title="Delete" style={{ background: 'var(--color-bg-secondary)', border: 'none', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.18s' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="18" height="14" rx="2"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-secondary)', padding: '48px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {[{ title: 'Managers', users: managers, role: 'manager' }, { title: 'Couriers', users: couriers, role: 'courier' }].map(block => (
          <div key={block.role} style={{ background: 'var(--color-bg)', borderRadius: 28, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', flex: '1 1 0', maxWidth: 500, padding: 36, position: 'relative', margin: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontWeight: 800, fontSize: 32 }}>{block.title}</span>
              <button onClick={() => setModal({ open: true, role: block.role })} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }} aria-label={`Add ${block.title.slice(0, -1)}`}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="14" cy="11" r="5" stroke="#fff" strokeWidth="2" />
                  <path d="M6 23c0-2.5 5-4 8-4s8 1.5 8 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <g>
                    <circle cx="21" cy="7" r="3" fill="#a78bfa" stroke="#fff" strokeWidth="1.5" />
                    <line x1="21" y1="6" x2="21" y2="8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="20" y1="7" x2="22" y2="7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                </svg>
              </button>
            </div>
            <div>
              {block.users.length === 0 ? <div style={{ color: '#aaa', padding: '32px 0', textAlign: 'center' }}>No {block.title.toLowerCase()}</div> :
                block.users.map((u, i) => (
                  <React.Fragment key={u.id}>
                    {renderUser(u)}
                    {i !== block.users.length - 1 && <div style={{ borderBottom: '1px solid #ececff', margin: '0 0' }} />}
                  </React.Fragment>
                ))}
            </div>
          </div>
        ))}
      </div>
      <AddUserModal
        open={modal.open}
        role={modal.role}
        onClose={() => setModal({ open: false, role: null })}
        onAdd={user => handleAdd(modal.role, user)}
      />
    </div>
  );
};

export default Users; 
import React, { useState } from 'react';
import './Dashboard.css'; // reuse existing dashboard styles

const initialInvoices = [
  { id: 'INV-001', date: '2024-01-15', amount: '$29.99', status: 'paid' },
  { id: 'INV-002', date: '2024-02-15', amount: '$29.99', status: 'paid' },
  { id: 'INV-003', date: '2024-03-15', amount: '$29.99', status: 'due' },
  { id: 'INV-004', date: '2024-04-15', amount: '$29.99', status: 'paid' },
  { id: 'INV-005', date: '2024-05-15', amount: '$29.99', status: 'paid' },
  { id: 'INV-006', date: '2024-06-15', amount: '$29.99', status: 'paid' },
  { id: 'INV-007', date: '2024-07-15', amount: '$29.99', status: 'paid' },
  { id: 'INV-008', date: '2024-08-15', amount: '$29.99', status: 'due' },
];

const initialCards = [
  { id: 1, brand: 'Visa', last4: '4242', exp: '09/26' },
  { id: 2, brand: 'Mastercard', last4: '4444', exp: '12/25' }
];

// Example existing payout account (null means none added yet)
const initialBankAccount = {
  bankName: 'Chase Bank',
  iban: 'US••••••••7890'
};

const AddCardModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({ brand: 'Visa', number: '', exp: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.number.trim() || form.number.length < 4 || !form.exp.trim()) return;
    onAdd({ brand: form.brand, last4: form.number.slice(-4), exp: form.exp });
    onClose();
    setForm({ brand: 'Visa', number: '', exp: '' });
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--color-bg)', padding: '24px 32px', borderRadius: 24, width: '100%', maxWidth: 480 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Add Card</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Brand</label>
            <select
              value={form.brand}
              onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
              style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }}
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="Amex">Amex</option>
              <option value="Discover">Discover</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Card Number</label>
            <input required value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Expiry (MM/YY)</label>
            <input required value={form.exp} onChange={e => setForm(f => ({ ...f, exp: e.target.value }))} placeholder="09/26" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: 'var(--color-bg-secondary)', border: 'none', color: 'var(--color-text)', fontWeight: 600 }}>Cancel</button>
            <button type="submit" style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600 }}>Add Card</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddBankModal = ({ open, onClose, onSave, existing }) => {
  const [form, setForm] = useState(existing || { bankName: '', iban: '' });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.bankName.trim() || !form.iban.trim()) return;
    onSave(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--color-bg)', padding: '24px 32px', borderRadius: 24, width: '100%', maxWidth: 480 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{existing ? 'Update' : 'Add'} Bank Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Bank Name</label>
            <input required value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} placeholder="Bank of Mars" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>IBAN / Account Number</label>
            <input required value={form.iban} onChange={e => setForm(f => ({ ...f, iban: e.target.value }))} placeholder="GB33BUKB20201555555555" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)', fontSize: 15 }} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: 'var(--color-bg-secondary)', border: 'none', color: 'var(--color-text)', fontWeight: 600 }}>Cancel</button>
            <button type="submit" style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600 }}>{existing ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Billing = () => {
  const [invoices] = useState(initialInvoices);
  const [cards, setCards] = useState(initialCards);
  const [bankAccount, setBankAccount] = useState(initialBankAccount);
  const [modalOpen, setModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);

  const statusStyles = {
    paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    due: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
    processing: { bg: 'rgba(250, 204, 21, 0.15)', color: '#f59e0b' }
  };

  const [transactions] = useState([
    { id: 'TXN-101', date: '2024-03-21 10:12', customer: 'Olivia Brown', amount: '$129.99', status: 'paid' },
    { id: 'TXN-102', date: '2024-03-21 10:35', customer: 'Liam Smith', amount: '$199.99', status: 'paid' },
    { id: 'TXN-103', date: '2024-03-22 14:08', customer: 'Emma Johnson', amount: '$49.99', status: 'refunded' },
    { id: 'TXN-104', date: '2024-03-23 09:42', customer: 'Noah Williams', amount: '$89.99', status: 'paid' },
    { id: 'TXN-105', date: '2024-03-24 11:05', customer: 'Carlos Diaz', amount: '$79.99', status: 'paid' },
    { id: 'TXN-106', date: '2024-03-24 16:27', customer: 'Sarah Johnson', amount: '$159.99', status: 'paid' },
    { id: 'TXN-107', date: '2024-03-25 08:50', customer: 'Michael Chen', amount: '$34.99', status: 'paid' },
    { id: 'TXN-108', date: '2024-03-25 12:14', customer: 'Leila Patel', amount: '$24.99', status: 'paid' },
    { id: 'TXN-109', date: '2024-03-26 09:18', customer: 'Tomás Silva', amount: '$59.99', status: 'paid' },
    { id: 'TXN-110', date: '2024-03-26 13:45', customer: 'Emma Wilson', amount: '$189.99', status: 'paid' },
    { id: 'TXN-111', date: '2024-03-27 10:02', customer: 'David Kim', amount: '$99.99', status: 'refunded' },
    { id: 'TXN-112', date: '2024-03-27 15:33', customer: 'Maria Garcia', amount: '$69.99', status: 'paid' },
    { id: 'TXN-113', date: '2024-03-28 07:55', customer: 'Anna Goodwin', amount: '$119.99', status: 'paid' },
  ]);

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: '48px 16px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Billing
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Manage your subscription, payment methods, payout account, invoices & transactions
          </p>
        </div>

        {/* Subscription Card */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 32, marginBottom: 32, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>Current Plan</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <p style={{ margin: '4px 0', fontSize: 16, color: 'var(--color-text)' }}>Pro — <strong>$29.99 / month</strong></p>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>Renews on March 15, 2025</p>
            </div>
            <button style={{ padding: '0.8rem 1.4rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              Change Plan
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 32, marginBottom: 32, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>Payment Methods</h2>
            <button onClick={() => setModalOpen(true)} style={{ padding: '0.6rem 1.2rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>+ Add Card</button>
          </div>
          {cards.length === 0 ? (
            <div style={{ padding: '16px 0', color: 'var(--color-text-secondary)', fontSize: 15 }}>No cards added.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cards.map(card => (
                <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', border: '1px solid var(--color-border)', borderRadius: 12, background: 'var(--color-bg-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{card.brand} ending in {card.last4}</span>
                    <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Exp {card.exp}</span>
                  </div>
                  <button style={{ padding: '0.4rem 0.8rem', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: 14 }}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payout Bank Account */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 32, marginBottom: 32, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>Payout Bank Account</h2>
            <button onClick={() => setBankModalOpen(true)} style={{ padding: '0.6rem 1.2rem', borderRadius: 10, background: '#111827', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>{bankAccount ? 'Change' : '+ Add'} Account</button>
          </div>
          {bankAccount ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{bankAccount.bankName}</span>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{bankAccount.iban}</span>
            </div>
          ) : (
            <div style={{ padding: '16px 0', color: 'var(--color-text-secondary)', fontSize: 15 }}>No bank account added.</div>
          )}
        </div>

        {/* Invoices Table */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 0, marginBottom: 32, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>Invoices</h2>
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ padding: 16 }}>{inv.id}</td>
                    <td style={{ padding: 16 }}>{inv.date}</td>
                    <td style={{ padding: 16 }}>{inv.amount}</td>
                    <td style={{ padding: 16 }}>
                      <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: statusStyles[inv.status].bg, color: statusStyles[inv.status].color, textTransform: 'capitalize' }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: 16 }}>
                      <button style={{ padding: '0.4rem 0.8rem', borderRadius: 8, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: 14 }}>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions History */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 0, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)', marginBottom: 32 }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>Transactions History</h2>
          </div>
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td style={{ padding: 16 }}>{t.id}</td>
                    <td style={{ padding: 16 }}>{t.date}</td>
                    <td style={{ padding: 16 }}>{t.customer}</td>
                    <td style={{ padding: 16 }}>{t.amount}</td>
                    <td style={{ padding: 16 }}>
                      <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: statusStyles[t.status]?.bg || '#eee', color: statusStyles[t.status]?.color || '#555', textTransform: 'capitalize' }}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <AddCardModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={(card) => {
            setCards([...cards, card]);
            setModalOpen(false);
          }}
        />
      )}

      {bankModalOpen && (
        <AddBankModal
          open={bankModalOpen}
          existing={bankAccount}
          onClose={() => setBankModalOpen(false)}
          onSave={(acc) => {
            setBankAccount(acc);
            setBankModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Billing; 
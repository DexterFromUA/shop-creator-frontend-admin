import React, { useState } from 'react';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css'; // reuse existing dashboard styles

// Example existing payout account (null means none added yet)
const initialBankAccount = {
  bankName: 'Chase Bank',
  iban: 'US••••••••7890',
};

const AddBankModal = ({ open, onClose, onSave, existing }) => {
  const [form, setForm] = useState(existing || { bankName: '', iban: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.bankName.trim() || !form.iban.trim()) return;
    onSave(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'var(--color-bg)',
          padding: '24px 32px',
          borderRadius: 24,
          width: '100%',
          maxWidth: 480,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
          {existing ? 'Update' : 'Add'} Bank Account
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 24 }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Bank Name</label>
            <input
              required
              value={form.bankName}
              onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
              placeholder="Bank of Mars"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                fontSize: 15,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              IBAN / Account Number
            </label>
            <input
              required
              value={form.iban}
              onChange={(e) => setForm((f) => ({ ...f, iban: e.target.value }))}
              placeholder="GB33BUKB20201555555555"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                fontSize: 15,
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button filled type="submit">{existing ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Payouts = () => {
  const [bankAccount, setBankAccount] = useState(initialBankAccount);
  const [bankModalOpen, setBankModalOpen] = useState(false);

  const statusStyles = {
    paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    due: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
    processing: { bg: 'rgba(250, 204, 21, 0.15)', color: '#f59e0b' },
  };

  const [transactions] = useState([
    {
      id: 'TXN-101',
      date: '2024-03-21 10:12',
      customer: 'Olivia Brown',
      amount: '$129.99',
      status: 'paid',
    },
    {
      id: 'TXN-102',
      date: '2024-03-21 10:35',
      customer: 'Liam Smith',
      amount: '$199.99',
      status: 'paid',
    },
    {
      id: 'TXN-103',
      date: '2024-03-22 14:08',
      customer: 'Emma Johnson',
      amount: '$49.99',
      status: 'refunded',
    },
    {
      id: 'TXN-104',
      date: '2024-03-23 09:42',
      customer: 'Noah Williams',
      amount: '$89.99',
      status: 'paid',
    },
    {
      id: 'TXN-105',
      date: '2024-03-24 11:05',
      customer: 'Carlos Diaz',
      amount: '$79.99',
      status: 'paid',
    },
    {
      id: 'TXN-106',
      date: '2024-03-24 16:27',
      customer: 'Sarah Johnson',
      amount: '$159.99',
      status: 'paid',
    },
    {
      id: 'TXN-107',
      date: '2024-03-25 08:50',
      customer: 'Michael Chen',
      amount: '$34.99',
      status: 'paid',
    },
    {
      id: 'TXN-108',
      date: '2024-03-25 12:14',
      customer: 'Leila Patel',
      amount: '$24.99',
      status: 'paid',
    },
    {
      id: 'TXN-109',
      date: '2024-03-26 09:18',
      customer: 'Tomás Silva',
      amount: '$59.99',
      status: 'paid',
    },
    {
      id: 'TXN-110',
      date: '2024-03-26 13:45',
      customer: 'Emma Wilson',
      amount: '$189.99',
      status: 'paid',
    },
    {
      id: 'TXN-111',
      date: '2024-03-27 10:02',
      customer: 'David Kim',
      amount: '$99.99',
      status: 'refunded',
    },
    {
      id: 'TXN-112',
      date: '2024-03-27 15:33',
      customer: 'Maria Garcia',
      amount: '$69.99',
      status: 'paid',
    },
    {
      id: 'TXN-113',
      date: '2024-03-28 07:55',
      customer: 'Anna Goodwin',
      amount: '$119.99',
      status: 'paid',
    },
  ]);

  return (
    <>
      <PageContainer
        title="Payouts & Transactions"
        description="Manage your payout bank account and view transaction history"
        withPadding
        withBottomSpace
        isStretch
        minHeight="auto"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>
              Payout Bank Account
            </h2>
            <Button filled onClick={() => setBankModalOpen(true)}>
              {bankAccount ? 'Change' : '+ Add'} Account
            </Button>
          </div>
          {bankAccount ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{bankAccount.bankName}</span>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                {bankAccount.iban}
              </span>
            </div>
          ) : (
            <div style={{ padding: '16px 0', color: 'var(--color-text-secondary)', fontSize: 15 }}>
              No bank account added.
            </div>
          )}
        </div>
      </PageContainer>

      <PageContainer title="Transactions History" minHeight="80vh">
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
            {transactions.map((t) => (
              <tr key={t.id}>
                <td style={{ padding: 16 }}>{t.id}</td>
                <td style={{ padding: 16 }}>{t.date}</td>
                <td style={{ padding: 16 }}>{t.customer}</td>
                <td style={{ padding: 16 }}>{t.amount}</td>
                <td style={{ padding: 16 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      background: statusStyles[t.status]?.bg || '#eee',
                      color: statusStyles[t.status]?.color || '#555',
                      textTransform: 'capitalize',
                    }}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageContainer>

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
    </>
  );
};

export default Payouts;

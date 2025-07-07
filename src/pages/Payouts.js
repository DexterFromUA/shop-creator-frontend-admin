import React, { useState } from 'react';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css'; // reuse existing dashboard styles

// Example existing payout account (null means none added yet)
const initialBankAccount = {
  bankAccountNumber: '29000000000000000000000000123',
  bankAccountHolder: 'John\'s Store LLC',
  bankName: 'PrivatBank',
  bankIban: 'UA213223130000026007233566001',
  bankSwiftCode: 'PBANUA2X',
};

const AddBankModal = ({ open, onClose, onSave, existing }) => {
  const [form, setForm] = useState(existing || {
    bankAccountNumber: '',
    bankAccountHolder: '',
    bankName: '',
    bankIban: '',
    bankSwiftCode: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.bankAccountNumber.trim() || !form.bankAccountHolder.trim() || !form.bankName.trim()) return;
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
          maxWidth: 520,
          maxHeight: '90vh',
          overflow: 'auto',
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
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Account Holder Name *
            </label>
            <input
              required
              value={form.bankAccountHolder}
              onChange={(e) => setForm((f) => ({ ...f, bankAccountHolder: e.target.value }))}
              placeholder="John's Store LLC"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Bank Name *
            </label>
            <input
              required
              value={form.bankName}
              onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
              placeholder="PrivatBank"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Account Number *
            </label>
            <input
              required
              value={form.bankAccountNumber}
              onChange={(e) => setForm((f) => ({ ...f, bankAccountNumber: e.target.value }))}
              placeholder="29000000000000000000000000123"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              IBAN (for international transfers)
            </label>
            <input
              value={form.bankIban}
              onChange={(e) => setForm((f) => ({ ...f, bankIban: e.target.value }))}
              placeholder="UA213223130000026007233566001"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              SWIFT Code (for international transfers)
            </label>
            <input
              value={form.bankSwiftCode}
              onChange={(e) => setForm((f) => ({ ...f, bankSwiftCode: e.target.value }))}
              placeholder="PBANUA2X"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
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
    PENDING: { bg: 'rgba(250, 204, 21, 0.15)', color: '#f59e0b' },
    PROCESSING: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
    COMPLETED: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    FAILED: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
    CANCELLED: { bg: 'rgba(156, 163, 175, 0.1)', color: '#6b7280' },
    DISPUTED: { bg: 'rgba(245, 101, 101, 0.1)', color: '#f56565' },
  };

  const typeStyles = {
    SALE: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    PAYOUT: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
    REFUND: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
    FEE: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
    CHARGEBACK: { bg: 'rgba(245, 101, 101, 0.1)', color: '#f56565' },
    ADJUSTMENT: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
  };

  const [transactions] = useState([
    {
      id: 'txn_1',
      type: 'SALE',
      status: 'COMPLETED',
      amount: 129.99,
      currency: 'UAH',
      description: 'Order #ORD-101 - Nike Air Max',
      referenceOrderId: 'ORD-101',
      processingFee: 3.90,
      netAmount: 126.09,
      paymentMethod: 'stripe',
      createdAt: '2024-03-21T10:12:00Z',
      processedAt: '2024-03-21T10:15:00Z',
    },
    {
      id: 'txn_2',
      type: 'PAYOUT',
      status: 'COMPLETED',
      amount: -500.00,
      currency: 'UAH',
      description: 'Weekly payout to bank account',
      processingFee: 15.00,
      netAmount: -515.00,
      paymentMethod: 'bank_transfer',
      createdAt: '2024-03-21T18:00:00Z',
      processedAt: '2024-03-22T09:30:00Z',
    },
    {
      id: 'txn_3',
      type: 'REFUND',
      status: 'COMPLETED',
      amount: -49.99,
      currency: 'UAH',
      description: 'Refund for Order #ORD-98',
      referenceOrderId: 'ORD-98',
      processingFee: 1.50,
      netAmount: -51.49,
      paymentMethod: 'stripe',
      createdAt: '2024-03-22T14:08:00Z',
      processedAt: '2024-03-22T14:10:00Z',
    },
    {
      id: 'txn_4',
      type: 'SALE',
      status: 'COMPLETED',
      amount: 89.99,
      currency: 'UAH',
      description: 'Order #ORD-102 - Adidas Sneakers',
      referenceOrderId: 'ORD-102',
      processingFee: 2.70,
      netAmount: 87.29,
      paymentMethod: 'stripe',
      createdAt: '2024-03-23T09:42:00Z',
      processedAt: '2024-03-23T09:45:00Z',
    },
    {
      id: 'txn_5',
      type: 'FEE',
      status: 'COMPLETED',
      amount: -25.00,
      currency: 'UAH',
      description: 'Monthly platform fee',
      processingFee: 0,
      netAmount: -25.00,
      paymentMethod: 'platform',
      createdAt: '2024-03-24T00:00:00Z',
      processedAt: '2024-03-24T00:01:00Z',
    },
    {
      id: 'txn_6',
      type: 'SALE',
      status: 'PROCESSING',
      amount: 159.99,
      currency: 'UAH',
      description: 'Order #ORD-103 - Premium Package',
      referenceOrderId: 'ORD-103',
      processingFee: 4.80,
      netAmount: 155.19,
      paymentMethod: 'stripe',
      createdAt: '2024-03-24T16:27:00Z',
      processedAt: null,
    },
    {
      id: 'txn_7',
      type: 'CHARGEBACK',
      status: 'DISPUTED',
      amount: -79.99,
      currency: 'UAH',
      description: 'Chargeback for Order #ORD-95',
      referenceOrderId: 'ORD-95',
      processingFee: 15.00,
      netAmount: -94.99,
      paymentMethod: 'stripe',
      createdAt: '2024-03-25T11:20:00Z',
      processedAt: null,
    },
  ]);

  const formatAmount = (amount, currency = 'UAH') => {
    const symbol = currency === 'UAH' ? '₴' : '$';
    const formatted = Math.abs(amount).toFixed(2);
    return amount >= 0 ? `+${symbol}${formatted}` : `-${symbol}${formatted}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{bankAccount.bankAccountHolder}</span>
                <span style={{ fontWeight: 500, fontSize: 15, color: 'var(--color-text-secondary)' }}>
                  {bankAccount.bankName}
                </span>
                <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                  ••••••••••••••••••••••••{bankAccount.bankAccountNumber.slice(-4)}
                </span>
                {bankAccount.bankIban && (
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    IBAN: {bankAccount.bankIban}
                  </span>
                )}
                {bankAccount.bankSwiftCode && (
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    SWIFT: {bankAccount.bankSwiftCode}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px 0', color: 'var(--color-text-secondary)', fontSize: 15 }}>
              No bank account added.
            </div>
          )}
        </div>
      </PageContainer>

      <PageContainer title="Transaction History" minHeight="80vh">
        <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Fee</th>
              <th>Net</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td style={{ padding: 16, fontFamily: 'monospace', fontSize: 13 }}>{t.id}</td>
                <td style={{ padding: 16 }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      background: typeStyles[t.type]?.bg || '#eee',
                      color: typeStyles[t.type]?.color || '#555',
                    }}
                  >
                    {t.type}
                  </span>
                </td>
                <td style={{ padding: 16, maxWidth: 200 }}>
                  <div style={{ fontSize: 14 }}>{t.description}</div>
                  {t.referenceOrderId && (
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {t.referenceOrderId}
                    </div>
                  )}
                </td>
                <td style={{ 
                  padding: 16, 
                  fontFamily: 'monospace',
                  color: t.amount >= 0 ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                }}>
                  {formatAmount(t.amount, t.currency)}
                </td>
                <td style={{ 
                  padding: 16, 
                  fontFamily: 'monospace',
                  fontSize: 13,
                  color: 'var(--color-text-secondary)',
                }}>
                  {t.processingFee ? `₴${t.processingFee.toFixed(2)}` : '-'}
                </td>
                <td style={{ 
                  padding: 16, 
                  fontFamily: 'monospace',
                  color: t.netAmount >= 0 ? '#10b981' : '#ef4444',
                  fontWeight: 600,
                }}>
                  {formatAmount(t.netAmount, t.currency)}
                </td>
                <td style={{ padding: 16 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      background: statusStyles[t.status]?.bg || '#eee',
                      color: statusStyles[t.status]?.color || '#555',
                    }}
                  >
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: 16, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {formatDate(t.createdAt)}
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

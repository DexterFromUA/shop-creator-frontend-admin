import React, { useState } from 'react';
import './Dashboard.css'; // reuse existing dashboard styles

const initialInvoices = [
  { id: 'INV-001', date: '2024-01-15', amount: '$29.99', status: 'paid' },
  { id: 'INV-002', date: '2024-02-15', amount: '$29.99', status: 'paid' },
  { id: 'INV-003', date: '2024-03-15', amount: '$29.99', status: 'due' },
];

const Billing = () => {
  const [invoices] = useState(initialInvoices);

  const statusStyles = {
    paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
    due: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  };

  return (
    <div className="dashboard" style={{ background: 'var(--color-bg-secondary)', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '48px 0' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Billing
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Manage your subscription and view invoices
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

        {/* Invoices Table */}
        <div className="dashboard-card" style={{ background: 'var(--color-bg)', borderRadius: 28, padding: 0, boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-text)' }}>Invoices</h2>
          </div>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
      </div>
    </div>
  );
};

export default Billing; 
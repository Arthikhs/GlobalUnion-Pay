import React from 'react';

const bankData = {
  accountHolder: 'SecureBank Employee',
  accountNumber: '1234 5678 9012',
  accountType: 'Savings',
  balance: '₹ 1,25,000.00',
  ifsc: 'SECB0001234',
  branch: 'Main Branch, Chennai',
  bankName: 'SecureBank Ltd.',
  openedOn: '01 Jan 2022',
};

export default function BankDetails({ onBack }) {
  return (
    <div>
      <button onClick={onBack} style={backBtnStyle}>← Back to Dashboard</button>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Bank Details</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>Your account information at a glance.</p>

      <div style={{
        background: 'white', borderRadius: 16, padding: 32,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 600,
      }}>
        {/* Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          borderRadius: 14, padding: '24px 28px', marginBottom: 28, color: 'white',
        }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 6 }}>Available Balance</p>
          <p style={{ fontSize: '2rem', fontWeight: 800 }}>{bankData.balance}</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: 8 }}>
            A/C: {bankData.accountNumber}
          </p>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { label: 'Account Holder', value: bankData.accountHolder },
            { label: 'Account Type', value: bankData.accountType },
            { label: 'IFSC Code', value: bankData.ifsc },
            { label: 'Branch', value: bankData.branch },
            { label: 'Bank Name', value: bankData.bankName },
            { label: 'Account Opened', value: bankData.openedOn },
          ].map((item) => (
            <div key={item.label} style={{
              background: '#f8fafc', borderRadius: 10, padding: '14px 16px',
              border: '1px solid #e2e8f0',
            }}>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {item.label}
              </p>
              <p style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 600 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const backBtnStyle = {
  background: 'none', border: 'none', color: '#1d4ed8',
  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
  marginBottom: 20, padding: 0, display: 'flex', alignItems: 'center', gap: 4,
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccountsApi, getTransactionsApi, getLoansApi } from '../api';

const bankInfo = {
  name: 'GlobalUnion Pay',
  accountNumber: '1234 5678 9012',
  ifsc: 'GLUP0001234',
  branch: 'Main Branch, Chennai',
  openedOn: '01 Jan 2022',
};

const backBtn = { background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 20, padding: 0 };
const card = { background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' };
const infoBox = { background: '#f8fafc', borderRadius: 10, padding: '14px 16px', border: '1px solid #e2e8f0' };
const infoLabel = { fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 };
const infoValue = { fontSize: '0.95rem', color: '#1e293b', fontWeight: 600, margin: 0 };
const td = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', color: '#1e293b' };

const SectionTitle = ({ children }) => (
  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>{children}</h3>
);

export default function BankDetails() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    getAccountsApi().then(r => r.json()).then(setAccounts).catch(() => {});
    getTransactionsApi().then(r => r.json()).then(setTransactions).catch(() => {});
    getLoansApi().then(r => r.json()).then(setLoans).catch(() => {});
  }, []);

  const totalDeposits = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + (t.amount || 0), 0) - transactions.filter(t => t.type === 'debit').reduce((s, t) => s + (t.amount || 0), 0);
  const totalLoans = loans.filter(l => l.status === 'ACTIVE').reduce((s, l) => s + (l.loanAmount || 0), 0);

  return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Bank Details</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>Complete overview of bank operations.</p>

      {/* Bank Info */}
      <SectionTitle>🏦 Bank Information</SectionTitle>
      <div style={{ ...card, marginBottom: 28 }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', borderRadius: 14, padding: '24px 28px', marginBottom: 24, color: 'white' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 4 }}>Bank Name</p>
          <p style={{ fontSize: '1.6rem', fontWeight: 800 }}>{bankInfo.name}</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: 8 }}>A/C: {bankInfo.accountNumber}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'IFSC Code', value: bankInfo.ifsc },
            { label: 'Branch', value: bankInfo.branch },
            { label: 'Established', value: bankInfo.openedOn },
            { label: 'Total Customers', value: accounts.length },
          ].map(item => (
            <div key={item.label} style={infoBox}>
              <p style={infoLabel}>{item.label}</p>
              <p style={infoValue}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total Amount Overview */}
      <SectionTitle>💰 Total Amount Overview</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Deposits', value: totalDeposits, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
          { label: 'Active Loans', value: totalLoans, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
        ].map(item => (
          <div key={item.label} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 14, padding: '20px 18px' }}>
            <p style={{ fontSize: '0.78rem', color: item.color, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>{item.label}</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>₹{item.value.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Transactions */}
      <SectionTitle>📊 Revenue & Transactions</SectionTitle>
      <div style={{ marginBottom: 28 }}>
        {transactions.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No transactions yet.</p>
        ) : (
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Transaction ID', 'Account', 'Description', 'Amount', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={t.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={td}><span style={{ fontFamily: 'monospace', color: '#059669', fontWeight: 600 }}>{t.id}</span></td>
                    <td style={td}>{t.accountNumber}</td>
                    <td style={td}>{t.desc}</td>
                    <td style={td}><span style={{ color: t.type === 'debit' ? '#dc2626' : '#059669', fontWeight: 700 }}>{t.type === 'debit' ? '-' : '+'}₹{t.amount?.toLocaleString('en-IN')}</span></td>
                    <td style={td}>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

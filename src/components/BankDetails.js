import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccountsApi, deleteAccountApi, getTransactionsApi, getLoansApi, createLoanApi, closeLoanApi } from '../api';

const bankInfo = {
  name: 'GlobalUnion Pay',
  accountNumber: '1234 5678 9012',
  ifsc: 'GLUP0001234',
  branch: 'Main Branch, Chennai',
  openedOn: '01 Jan 2022',
};

export default function BankDetails() {
  const navigate = useNavigate();
  const goBack = () => navigate('/dashboard');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loanForm, setLoanForm] = useState({ accountNumber: '', accountHolder: '', loanType: 'Home Loan', loanAmount: '', interestRate: '', tenureMonths: '' });
  const [showLoanForm, setShowLoanForm] = useState(false);

  const load = () => {
    getAccountsApi().then(r => r.json()).then(setAccounts).catch(() => {});
    getTransactionsApi().then(r => r.json()).then(setTransactions).catch(() => {});
    getLoansApi().then(r => r.json()).then(setLoans).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this account?')) return;
    await deleteAccountApi(id);
    load();
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    await createLoanApi({ ...loanForm, loanAmount: Number(loanForm.loanAmount), interestRate: Number(loanForm.interestRate), tenureMonths: Number(loanForm.tenureMonths) });
    setLoanForm({ accountNumber: '', accountHolder: '', loanType: 'Home Loan', loanAmount: '', interestRate: '', tenureMonths: '' });
    setShowLoanForm(false);
    load();
  };

  const handleCloseLoan = async (id) => {
    if (!window.confirm('Mark this loan as closed?')) return;
    await closeLoanApi(id);
    load();
  };

  const totalDeposits = accounts.reduce((s, a) => s + (a.initialDeposit || 0), 0);
  const totalRevenue = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const totalLoans = loans.filter(l => l.status === 'ACTIVE').reduce((s, l) => s + (l.loanAmount || 0), 0);

  return (
    <div>
      <button onClick={goBack} style={backBtn}>← Back to Dashboard</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Bank Details</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>Complete overview of bank operations.</p>

      {/* ── SECTION 1: Bank Info ── */}
      <SectionTitle>🏦 Bank Information</SectionTitle>
      <div style={{ ...card, maxWidth: 700, marginBottom: 28 }}>
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

      {/* ── SECTION 2: Total Amount ── */}
      <SectionTitle>💰 Total Amount Overview</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 700, marginBottom: 28 }}>
        {[
          { label: 'Total Deposits', value: totalDeposits, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
          { label: 'Total Revenue', value: totalRevenue, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
          { label: 'Active Loans', value: totalLoans, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
        ].map(item => (
          <div key={item.label} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 14, padding: '20px 18px' }}>
            <p style={{ fontSize: '0.78rem', color: item.color, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>{item.label}</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>₹{item.value.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>

      {/* ── SECTION 3: Customer Accounts ── */}
      <SectionTitle>👤 Customer Accounts</SectionTitle>
      <div style={{ maxWidth: 700, marginBottom: 28 }}>
        {accounts.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No accounts created yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {accounts.map((acc) => (
              <div key={acc.accountNumber} style={{ ...card, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', margin: 0 }}>{acc.fullName}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{acc.accountType}</span>
                    <button onClick={() => handleDelete(acc.id)} style={removeBtn}>Remove</button>
                  </div>
                </div>
                <p style={{ fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 700, fontSize: '1rem', margin: '0 0 8px' }}>{acc.accountNumber}</p>
                <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                  <span>📞 {acc.phone}</span>
                  <span>💰 ₹{acc.initialDeposit.toLocaleString('en-IN')}</span>
                  <span>📅 {acc.createdOn}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 4: Revenue / Transactions ── */}
      <SectionTitle>📊 Revenue & Transactions</SectionTitle>
      <div style={{ maxWidth: 700, marginBottom: 28 }}>
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
                    <td style={td}><span style={{ color: '#059669', fontWeight: 700 }}>+₹{t.amount?.toLocaleString('en-IN')}</span></td>
                    <td style={td}>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── SECTION 5: Loan Details ── */}
      <SectionTitle>🏛️ Loan Details</SectionTitle>
      <div style={{ maxWidth: 700, marginBottom: 40 }}>
        <button onClick={() => setShowLoanForm(!showLoanForm)} style={{ ...primaryBtn, marginBottom: 16 }}>
          {showLoanForm ? 'Cancel' : '+ Issue New Loan'}
        </button>

        {showLoanForm && (
          <form onSubmit={handleLoanSubmit} style={{ ...card, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Account Number', name: 'accountNumber', type: 'text', placeholder: 'ACC...' },
                { label: 'Account Holder', name: 'accountHolder', type: 'text', placeholder: 'Full name' },
                { label: 'Loan Amount (₹)', name: 'loanAmount', type: 'number', placeholder: 'e.g. 500000' },
                { label: 'Interest Rate (%)', name: 'interestRate', type: 'number', placeholder: 'e.g. 8.5' },
                { label: 'Tenure (Months)', name: 'tenureMonths', type: 'number', placeholder: 'e.g. 60' },
              ].map(f => (
                <div key={f.name}>
                  <label style={infoLabel}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={loanForm[f.name]}
                    onChange={e => setLoanForm({ ...loanForm, [e.target.name]: e.target.value })}
                    name={f.name} required style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={infoLabel}>Loan Type</label>
                <select name="loanType" value={loanForm.loanType} onChange={e => setLoanForm({ ...loanForm, loanType: e.target.value })} style={inputStyle}>
                  <option>Home Loan</option>
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                  <option>Education Loan</option>
                  <option>Vehicle Loan</option>
                </select>
              </div>
            </div>
            <button type="submit" style={{ ...primaryBtn, marginTop: 16, width: '100%' }}>Issue Loan</button>
          </form>
        )}

        {loans.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No loans issued yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loans.map(loan => (
              <div key={loan.id} style={{ ...card, padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>{loan.accountHolder}</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      background: loan.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4',
                      color: loan.status === 'ACTIVE' ? '#dc2626' : '#059669',
                      fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    }}>{loan.status}</span>
                    {loan.status === 'ACTIVE' && (
                      <button onClick={() => handleCloseLoan(loan.id)} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#059669', borderRadius: 8, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Close</button>
                    )}
                  </div>
                </div>
                <p style={{ fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 700, margin: '0 0 8px' }}>{loan.accountNumber}</p>
                <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                  <span>🏷️ {loan.loanType}</span>
                  <span>💰 ₹{loan.loanAmount?.toLocaleString('en-IN')}</span>
                  <span>📈 {loan.interestRate}% p.a.</span>
                  <span>⏳ {loan.tenureMonths} months</span>
                  <span>📅 {loan.issuedOn}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const SectionTitle = ({ children }) => (
  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>{children}</h3>
);

const backBtn = { background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 20, padding: 0 };
const card = { background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' };
const infoBox = { background: '#f8fafc', borderRadius: 10, padding: '14px 16px', border: '1px solid #e2e8f0' };
const infoLabel = { fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 };
const infoValue = { fontSize: '0.95rem', color: '#1e293b', fontWeight: 600, margin: 0 };
const removeBtn = { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const primaryBtn = { background: '#1d4ed8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' };
const td = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', color: '#1e293b' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '0.9rem', outline: 'none', background: '#f9fafb', color: '#1e293b', boxSizing: 'border-box' };

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccountsApi, deleteAccountApi, getTransactionsApi, getLoansApi } from '../api';

const backBtn = { background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 20, padding: 0 };
const card = { background: 'white', borderRadius: 14, padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' };
const detailsBtn = { background: '#1d4ed8', border: 'none', color: 'white', borderRadius: 8, padding: '5px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const removeBtn = { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '5px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const lbl = { fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 };
const val = { fontSize: '0.95rem', color: '#1e293b', fontWeight: 600, margin: 0 };
const td = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', color: '#1e293b' };

export default function CustomerDetails() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const load = () => {
    getAccountsApi().then(r => r.json()).then(setAccounts).catch(() => {});
    getTransactionsApi().then(r => r.json()).then(setTransactions).catch(() => {});
    getLoansApi().then(r => r.json()).then(setLoans).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently remove this account?')) return;
    await deleteAccountApi(id);
    setSelectedAcc(null);
    load();
  };

  const accTxns = selectedAcc ? transactions.filter(t => t.accountNumber === selectedAcc.accountNumber) : [];
  const accLoans = selectedAcc ? loans.filter(l => l.accountNumber === selectedAcc.accountNumber) : [];
  const totalCredit = accTxns.filter(t => t.type === 'credit').reduce((s, t) => s + (t.amount || 0), 0);
  const totalDebit = accTxns.filter(t => t.type === 'debit').reduce((s, t) => s + (t.amount || 0), 0);

  if (selectedLoan) {
    const r = selectedLoan.interestRate / 1200;
    const n = selectedLoan.tenureMonths;
    const emi = Math.round((selectedLoan.loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const total = emi * n;
    const interest = total - selectedLoan.loanAmount;
    return (
      <div>
        <button onClick={() => setSelectedLoan(null)} style={backBtn}>← Back to Customer Details</button>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Loan Full Details</h2>
        <div style={{ ...card, maxWidth: 600 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{selectedLoan.loanType}</h3>
            <span style={{ background: selectedLoan.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4', color: selectedLoan.status === 'ACTIVE' ? '#dc2626' : '#059669', fontSize: '0.78rem', fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>{selectedLoan.status}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Account Holder', value: selectedLoan.accountHolder },
              { label: 'Account Number', value: selectedLoan.accountNumber },
              { label: 'Loan Type', value: selectedLoan.loanType },
              { label: 'Loan Amount', value: `₹${selectedLoan.loanAmount?.toLocaleString('en-IN')}` },
              { label: 'Interest Rate', value: `${selectedLoan.interestRate}% p.a.` },
              { label: 'Tenure', value: `${selectedLoan.tenureMonths} months` },
              { label: 'Issued On', value: selectedLoan.issuedOn },
              { label: 'Status', value: selectedLoan.status },
              { label: 'Purpose', value: selectedLoan.purpose || '—', fullWidth: true },
            ].map(item => (
              <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0', ...(item.fullWidth ? { gridColumn: '1 / -1' } : {}) }}>
                <p style={lbl}>{item.label}</p>
                <p style={val}>{item.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '16px 18px', marginTop: 20 }}>
            <p style={{ fontWeight: 700, color: '#1d4ed8', marginBottom: 12, fontSize: '0.9rem' }}>📊 EMI Breakdown</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[{ label: 'Monthly EMI', value: `₹${emi.toLocaleString('en-IN')}`, color: '#1d4ed8' },
                { label: 'Total Interest', value: `₹${interest.toLocaleString('en-IN')}`, color: '#dc2626' },
                { label: 'Total Payable', value: `₹${total.toLocaleString('en-IN')}`, color: '#059669' }].map(e => (
                <div key={e.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{e.label}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: e.color }}>{e.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedAcc) return (
    <div>
      <button onClick={() => setSelectedAcc(null)} style={backBtn}>← Back to Customers</button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Profile Picture */}
          <div style={{ position: 'relative' }}>
            <img
              src={selectedAcc.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAcc.fullName)}&background=1d4ed8&color=fff&size=80`}
              alt="profile"
              style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
            />
            <label style={{ position: 'absolute', bottom: 0, right: 0, background: '#1d4ed8', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ color: 'white', fontSize: 12 }}>✏️</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch(`http://localhost:8090/api/upload/profile/${selectedAcc.id}`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.url) {
                  setSelectedAcc(prev => ({ ...prev, profilePicture: data.url }));
                  load();
                }
              }} />
            </label>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{selectedAcc.fullName}</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{selectedAcc.accountNumber} · {selectedAcc.accountType}</p>
          </div>
        </div>
      </div>

      {/* Full Info Card */}
      <div style={{ ...card, marginBottom: 24 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>👤 Personal Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Full Name', value: selectedAcc.fullName },
            { label: "Mother's Name", value: selectedAcc.motherName },
            { label: "Father's Name", value: selectedAcc.fatherName },
            { label: 'Date of Birth', value: selectedAcc.dob },
            { label: 'Phone', value: selectedAcc.phone },
            { label: 'Email', value: selectedAcc.email },
            { label: 'Occupation', value: selectedAcc.occupation },
            { label: 'Address', value: selectedAcc.address },
          ].map(item => (
            <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
              <p style={lbl}>{item.label}</p>
              <p style={val}>{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Account Info Card */}
      <div style={{ ...card, marginBottom: 24 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>🏦 Account Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Account Number', value: selectedAcc.accountNumber },
            { label: 'Account Type', value: selectedAcc.accountType },
            { label: 'Current Balance', value: `₹${(selectedAcc.balance ?? selectedAcc.initialDeposit).toLocaleString('en-IN')}` },
            { label: 'Opened On', value: selectedAcc.createdOn },
            { label: 'Total Credited', value: `₹${totalCredit.toLocaleString('en-IN')}` },
            { label: 'Total Debited', value: `₹${totalDebit.toLocaleString('en-IN')}` },
          ].map(item => (
            <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
              <p style={lbl}>{item.label}</p>
              <p style={{ ...val, color: item.label === 'Current Balance' || item.label === 'Total Credited' ? '#059669' : item.label === 'Total Debited' ? '#dc2626' : '#1e293b' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loans Section */}
      {accLoans.length > 0 && (
        <div style={{ ...card, marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>🏦 Loan Details ({accLoans.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {accLoans.map(loan => (
              <div key={loan.id} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 14, fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{loan.loanType}</span>
                  <span style={{ background: loan.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4', color: loan.status === 'ACTIVE' ? '#dc2626' : '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{loan.status}</span>
                  <span>💰 ₹{loan.loanAmount?.toLocaleString('en-IN')}</span>
                  <span>📅 {loan.issuedOn}</span>
                </div>
                <button onClick={() => setSelectedLoan(loan)} style={{ ...detailsBtn, whiteSpace: 'nowrap', marginLeft: 12 }}>View Loan Details</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>📊 Transaction History ({accTxns.length})</h3>
      {accTxns.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No transactions found.</p>
      ) : (
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Transaction ID', 'Description', 'Amount', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accTxns.map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td style={td}><span style={{ fontFamily: 'monospace', color: '#059669', fontWeight: 600 }}>{t.id}</span></td>
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
  );

  return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Customer Details</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>All registered customer accounts.</p>

      {accounts.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No accounts created yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {accounts.map((acc) => (
            <div key={acc.accountNumber} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b', margin: '0 0 2px' }}>{acc.fullName}</p>
                  <p style={{ fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{acc.accountNumber}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{acc.accountType}</span>
                  <button onClick={() => setSelectedAcc(acc)} style={detailsBtn}>View Details</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                <span>📞 {acc.phone}</span>
                <span>💰 ₹{(acc.balance ?? acc.initialDeposit).toLocaleString('en-IN')}</span>
                <span>📅 {acc.createdOn}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

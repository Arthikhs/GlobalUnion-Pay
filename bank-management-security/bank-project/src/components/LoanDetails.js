import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoansApi, createLoanApi, closeLoanApi, getAccountByNumberApi } from '../api';

const backBtn = { background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 20, padding: 0 };
const card = { background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' };
const lbl = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '0.9rem', outline: 'none', background: '#f9fafb', color: '#1e293b', boxSizing: 'border-box' };
const primaryBtn = { background: '#1d4ed8', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' };

const LOAN_TYPES = [
  { key: 'Education Loan', icon: '🎓', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', desc: 'Fund your studies, tuition fees, and educational expenses.' },
  { key: 'Business Loan', icon: '💼', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', desc: 'Grow your business with flexible financing options.' },
  { key: 'Vehicle Loan', icon: '🚗', color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'Finance your dream car, bike, or commercial vehicle.' },
  { key: 'Agriculture Loan', icon: '🌾', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', desc: 'Support farming, equipment, and agricultural needs.' },
  { key: 'Property Loan', icon: '🏠', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', desc: 'Buy, build, or renovate your home or property.' },
];

const INTEREST_RATES = {
  'Education Loan': 7.5,
  'Business Loan': 10.5,
  'Vehicle Loan': 9.0,
  'Agriculture Loan': 6.5,
  'Property Loan': 8.5,
};

export default function LoanDetails() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState({ accountNumber: '', purpose: '', loanAmount: '', tenureMonths: '' });
  const [accInfo, setAccInfo] = useState(null);
  const [accError, setAccError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const load = () => getLoansApi().then(r => r.json()).then(setLoans).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleAccBlur = async () => {
    if (!form.accountNumber.trim()) { setAccInfo(null); return; }
    setAccError('');
    try {
      const res = await getAccountByNumberApi(form.accountNumber.trim());
      if (!res.ok) { setAccInfo(null); setAccError('Account not found.'); return; }
      setAccInfo(await res.json());
    } catch { setAccError('Failed to connect to server.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!accInfo) { setError('Please enter a valid account number.'); return; }
    try {
      const res = await createLoanApi({
        accountNumber: form.accountNumber,
        accountHolder: accInfo.fullName,
        loanType: selectedType.key,
        purpose: form.purpose,
        loanAmount: Number(form.loanAmount),
        interestRate: INTEREST_RATES[selectedType.key],
        tenureMonths: Number(form.tenureMonths),
      });
      const data = await res.json();
      setSuccess({ name: accInfo.fullName, amount: form.loanAmount, type: selectedType.key });
      setForm({ accountNumber: '', purpose: '', loanAmount: '', tenureMonths: '' });
      setAccInfo(null);
      setSelectedType(null);
      load();
    } catch { setError('Failed to connect to server.'); }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Mark this loan as closed?')) return;
    await closeLoanApi(id);
    load();
  };

  const totalActive = loans.filter(l => l.status === 'ACTIVE').reduce((s, l) => s + (l.loanAmount || 0), 0);

  // Success screen
  if (success) return (
    <div>
      <button onClick={() => setSuccess(null)} style={backBtn}>← Back to Loan Details</button>
      <div style={{ ...card, maxWidth: 480, textAlign: 'center', margin: '0 auto' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Loan Issued!</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          <strong>{success.type}</strong> of <strong>₹{Number(success.amount).toLocaleString('en-IN')}</strong> issued to <strong>{success.name}</strong>.
        </p>
        <button onClick={() => setSuccess(null)} style={{ ...primaryBtn, width: '100%' }}>View All Loans</button>
      </div>
    </div>
  );

  // Loan form screen
  if (selectedType) return (
    <div>
      <button onClick={() => { setSelectedType(null); setForm({ accountNumber: '', purpose: '', loanAmount: '', tenureMonths: '' }); setAccInfo(null); setAccError(''); setError(''); }} style={backBtn}>← Back to Loan Types</button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: selectedType.bg, border: `1.5px solid ${selectedType.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
          {selectedType.icon}
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{selectedType.key}</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Interest Rate: <strong style={{ color: selectedType.color }}>{INTEREST_RATES[selectedType.key]}% p.a.</strong></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={card}>
        {/* Account Number */}
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>Account Number</label>
          <input type="text" placeholder="e.g. ACC1234567890" value={form.accountNumber}
            onChange={e => setForm({ ...form, accountNumber: e.target.value })}
            onBlur={handleAccBlur} required style={inputStyle} />
          {accError && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: 6 }}>⚠️ {accError}</p>}
        </div>

        {/* Account Info */}
        {accInfo && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
            <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{accInfo.fullName}</p>
            <div style={{ display: 'flex', gap: 20, fontSize: '0.83rem', color: '#64748b', flexWrap: 'wrap' }}>
              <span>🏦 {accInfo.accountType}</span>
              <span>📞 {accInfo.phone}</span>
              <span>💰 Balance: ₹{(accInfo.balance ?? accInfo.initialDeposit)?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Purpose */}
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>Purpose of Loan</label>
          <textarea placeholder={`Describe why you need the ${selectedType.key}...`}
            value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}
            required rows={3} style={{ ...inputStyle, resize: 'none' }} />
        </div>

        {/* Amount & Tenure */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <label style={lbl}>Loan Amount (₹)</label>
            <input type="number" placeholder="e.g. 500000" min="1000"
              value={form.loanAmount} onChange={e => setForm({ ...form, loanAmount: e.target.value })}
              required style={inputStyle} onWheel={e => e.target.blur()} />
          </div>
          <div>
            <label style={lbl}>Tenure (Months)</label>
            <input type="number" placeholder="e.g. 60" min="1" max="360"
              value={form.tenureMonths} onChange={e => setForm({ ...form, tenureMonths: e.target.value })}
              required style={inputStyle} onWheel={e => e.target.blur()} />
          </div>
        </div>

        {/* EMI Preview */}
        {form.loanAmount && form.tenureMonths && (
          <div style={{ background: selectedType.bg, border: `1px solid ${selectedType.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ fontSize: '0.82rem', color: selectedType.color, fontWeight: 600 }}>
              Estimated EMI: ₹{Math.round((Number(form.loanAmount) * (INTEREST_RATES[selectedType.key] / 1200) * Math.pow(1 + INTEREST_RATES[selectedType.key] / 1200, Number(form.tenureMonths))) / (Math.pow(1 + INTEREST_RATES[selectedType.key] / 1200, Number(form.tenureMonths)) - 1)).toLocaleString('en-IN')} / month
            </p>
          </div>
        )}

        {error && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.875rem', marginBottom: 16 }}>⚠️ {error}</div>}
        <button type="submit" style={{ ...primaryBtn, background: selectedType.color, width: '100%' }}>Submit Loan Application</button>
      </form>
    </div>
  );

  // Main screen
  return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Loan Details</h2>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>Select a loan type to issue a new loan.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Loans', value: loans.length, color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
          { label: 'Active Loans', value: loans.filter(l => l.status === 'ACTIVE').length, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
          { label: 'Active Loan Amount', value: `₹${totalActive.toLocaleString('en-IN')}`, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
        ].map(item => (
          <div key={item.label} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 14, padding: '20px 18px' }}>
            <p style={{ fontSize: '0.78rem', color: item.color, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>{item.label}</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Loan Type Cards */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Select Loan Type</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 36 }}>
        {LOAN_TYPES.map(lt => (
          <div key={lt.key} onClick={() => setSelectedType(lt)}
            style={{ background: 'white', border: `1.5px solid ${lt.border}`, borderRadius: 16, padding: '24px 20px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: lt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 14 }}>{lt.icon}</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>{lt.key}</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, marginBottom: 12 }}>{lt.desc}</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: lt.color }}>{INTEREST_RATES[lt.key]}% p.a. → Apply</p>
          </div>
        ))}
      </div>

      {/* Issued Loans */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Issued Loans</h3>
      {loans.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No loans issued yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loans.map(loan => (
            <div key={loan.id} style={{ ...card, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>{loan.accountHolder}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ background: loan.status === 'ACTIVE' ? '#fef2f2' : '#f0fdf4', color: loan.status === 'ACTIVE' ? '#dc2626' : '#059669', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{loan.status}</span>
                  {loan.status === 'ACTIVE' && (
                    <button onClick={() => handleClose(loan.id)} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#059669', borderRadius: 8, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Close</button>
                  )}
                </div>
              </div>
              <p style={{ fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 700, margin: '0 0 8px' }}>{loan.accountNumber}</p>
              <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
                <span>🏷️ {loan.loanType}</span>
                <span>💰 ₹{loan.loanAmount?.toLocaleString('en-IN')}</span>
                <span>📈 {loan.interestRate}% p.a.</span>
                <span>⏳ {loan.tenureMonths} months</span>
                {loan.purpose && <span>📝 {loan.purpose}</span>}
                <span>📅 {loan.issuedOn}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { depositApi, withdrawApi, getAccountByNumberApi } from '../api';

const emptyForm = { accountNumber: '', accountHolder: '', amount: '', note: '' };

export default function Deposit() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('deposit');
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [error, setError] = useState('');
  const [accInfo, setAccInfo] = useState(null);
  const [accError, setAccError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAccNumberBlur = async () => {
    if (!form.accountNumber.trim()) { setAccInfo(null); return; }
    setAccError('');
    try {
      const res = await getAccountByNumberApi(form.accountNumber.trim());
      if (!res.ok) { setAccInfo(null); setAccError('Account not found.'); return; }
      const data = await res.json();
      setAccInfo(data);
      setForm(f => ({ ...f, accountHolder: data.fullName }));
    } catch { setAccError('Failed to connect to server.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isDeposit && accInfo) {
      const available = accInfo.balance ?? accInfo.initialDeposit ?? 0;
      if (Number(form.amount) > available) {
        setError(`Insufficient balance. Available: ₹${available.toLocaleString('en-IN')}`);
        return;
      }
    }
    try {
      const api = tab === 'deposit' ? depositApi : withdrawApi;
      const payload = { ...form, amount: Number(form.amount) };
      if (!payload.note) payload.note = isDeposit ? 'Cash Deposit' : 'Cash Withdrawal';
      const res = await api(payload);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Transaction failed.'); return; }
      if (!data.id) { setError('Transaction failed. Please try again.'); return; }
      setTxnId(data.id);
      setSubmitted(true);
    } catch {
      setError('Failed to connect to server.');
    }
  };

  const isDeposit = tab === 'deposit';
  const color = isDeposit ? '#d97706' : '#dc2626';
  const successBg = isDeposit ? '#f0fdf4' : '#fef2f2';
  const successBorder = isDeposit ? '#bbf7d0' : '#fecaca';
  const successColor = isDeposit ? '#059669' : '#dc2626';

  if (submitted) return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{isDeposit ? '💰' : '🏧'}</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
          {isDeposit ? 'Deposit Successful!' : 'Withdrawal Successful!'}
        </h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          ₹{Number(form.amount).toLocaleString('en-IN')} {isDeposit ? 'deposited to' : 'withdrawn from'} <strong>{form.accountNumber}</strong>
        </p>
        <div style={{ background: successBg, border: `1px solid ${successBorder}`, borderRadius: 12, padding: '16px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 4 }}>Transaction ID</p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: successColor, fontFamily: 'monospace' }}>{txnId}</p>
        </div>
        <button onClick={() => { setSubmitted(false); setForm(emptyForm); }} style={{ ...primaryBtn, background: color }}>
          New Transaction
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '100%' }}>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '2px solid #e2e8f0', maxWidth: 500 }}>
        {[{ key: 'deposit', label: '💰 Deposit' }, { key: 'withdraw', label: '🏧 Withdrawal' }].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setForm(emptyForm); setError(''); setAccInfo(null); setAccError(''); }} style={{
            flex: 1, padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.9rem',
            color: tab === t.key ? (t.key === 'deposit' ? '#d97706' : '#dc2626') : '#64748b',
            borderBottom: tab === t.key ? `2px solid ${t.key === 'deposit' ? '#d97706' : '#dc2626'}` : '2px solid transparent',
            marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
        {isDeposit ? 'Deposit Funds' : 'Withdraw Funds'}
      </h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>
        {isDeposit ? 'Enter account details and deposit amount.' : 'Enter account details and withdrawal amount.'}
      </p>

      <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: '100%' }}>
        {/* Account Number with lookup */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Account Number</label>
          <input type="text" name="accountNumber" placeholder="e.g. ACC1234567890"
            value={form.accountNumber} onChange={handle} onBlur={handleAccNumberBlur}
            required style={inputStyle} />
          {accError && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: 6 }}>⚠️ {accError}</p>}
        </div>

        {/* Account Info Card */}
        {accInfo && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
            <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>{accInfo.fullName}</p>
            <div style={{ display: 'flex', gap: 20, fontSize: '0.83rem', color: '#64748b', flexWrap: 'wrap' }}>
              <span>🏦 {accInfo.accountType}</span>
              <span>📞 {accInfo.phone}</span>
              <span>💰 Balance: ₹{(accInfo.balance ?? accInfo.initialDeposit)?.toLocaleString('en-IN')}</span>
              <span>📅 {accInfo.createdOn}</span>
            </div>
          </div>
        )}

        {/* Account Holder (auto-filled) */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Account Holder Name</label>
          <input type="text" name="accountHolder" placeholder="Full name"
            value={form.accountHolder} onChange={handle} required style={{ ...inputStyle, background: accInfo ? '#f0fdf4' : '#f9fafb' }} />
        </div>

        {/* Amount & Note */}
        {[
          { label: `${isDeposit ? 'Deposit' : 'Withdrawal'} Amount (₹)`, name: 'amount', type: 'number', placeholder: 'Enter amount' },
          { label: 'Note (Optional)', name: 'note', type: 'text', placeholder: `e.g. ${isDeposit ? 'Cash deposit' : 'Cash withdrawal'}` },
        ].map((f) => (
          <div key={f.name} style={{ marginBottom: 20 }}>
            <label style={labelStyle}>{f.label}</label>
            <input type={f.type} name={f.name} placeholder={f.placeholder}
              value={form[f.name]} onChange={handle}
              required={f.name !== 'note'}
              min={f.name === 'amount' ? 1 : undefined}
              max={f.name === 'amount' && !isDeposit && accInfo ? (accInfo.balance ?? accInfo.initialDeposit) : undefined}
              onWheel={f.name === 'amount' ? (e) => e.target.blur() : undefined}
              style={inputStyle} />
            {f.name === 'amount' && !isDeposit && accInfo && (
              <p style={{ fontSize: '0.8rem', marginTop: 6, color: Number(form.amount) > (accInfo.balance ?? accInfo.initialDeposit) ? '#dc2626' : '#059669', fontWeight: 600 }}>
                Available Balance: ₹{(accInfo.balance ?? accInfo.initialDeposit)?.toLocaleString('en-IN')}
                {Number(form.amount) > (accInfo.balance ?? accInfo.initialDeposit) && ' — Amount exceeds balance!'}
              </p>
            )}
          </div>
        ))}
        {error && <div style={errorBox}>⚠️ {error}</div>}
        <button type="submit" style={{ ...primaryBtn, background: color, width: '100%', marginTop: 8 }}>
          {isDeposit ? 'Deposit Now' : 'Withdraw Now'}
        </button>
      </form>
    </div>
  );
}

const backBtn = { background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 20, padding: 0 };
const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '0.9rem', outline: 'none', background: '#f9fafb', color: '#1e293b', boxSizing: 'border-box' };
const primaryBtn = { color: 'white', border: 'none', padding: '13px 28px', borderRadius: 12, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' };
const errorBox = { marginTop: 8, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.875rem' };

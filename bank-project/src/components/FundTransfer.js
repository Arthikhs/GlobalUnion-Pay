import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccountByNumberApi, transferApi } from '../api';

const backBtn = { background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 20, padding: 0 };
const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '0.9rem', outline: 'none', background: '#f9fafb', color: '#1e293b', boxSizing: 'border-box' };
const primaryBtn = { background: '#4F46E5', color: 'white', border: 'none', padding: '13px 28px', borderRadius: 12, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' };
const errorBox = { marginTop: 8, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.875rem' };

const emptyForm = { fromAccount: '', toAccount: '', amount: '', note: '' };

export default function FundTransfer() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [fromInfo, setFromInfo] = useState(null);
  const [toInfo, setToInfo] = useState(null);
  const [fromError, setFromError] = useState('');
  const [toError, setToError] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [step, setStep] = useState(1); // 1=form, 2=confirm, 3=success

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const lookupAccount = async (accNumber, setInfo, setErr) => {
    if (!accNumber.trim()) { setInfo(null); return; }
    setErr('');
    try {
      const res = await getAccountByNumberApi(accNumber.trim());
      if (!res.ok) { setInfo(null); setErr('Account not found.'); return; }
      setInfo(await res.json());
    } catch { setErr('Failed to connect to server.'); }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    setError('');
    if (!fromInfo) { setError('Please enter a valid sender account.'); return; }
    if (!toInfo) { setError('Please enter a valid receiver account.'); return; }
    if (form.fromAccount === form.toAccount) { setError('Sender and receiver accounts cannot be the same.'); return; }
    const bal = fromInfo.balance ?? fromInfo.initialDeposit ?? 0;
    if (Number(form.amount) > bal) { setError(`Insufficient balance. Available: ₹${bal.toLocaleString('en-IN')}`); return; }
    setStep(2);
  };

  const handleConfirm = async () => {
    setError('');
    try {
      const res = await transferApi({
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        amount: Number(form.amount),
        note: form.note || 'Fund Transfer',
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Transfer failed.'); setStep(1); return; }
      setTxnId(data.id);
      setSubmitted(true);
      setStep(3);
    } catch { setError('Failed to connect to server.'); setStep(1); }
  };

  if (step === 3) return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 500, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Transfer Successful!</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>
          ₹{Number(form.amount).toLocaleString('en-IN')} transferred from <strong>{fromInfo?.fullName}</strong> to <strong>{toInfo?.fullName}</strong>
        </p>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '16px 24px', marginBottom: 24 }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 4 }}>Transaction ID</p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#4F46E5', fontFamily: 'monospace' }}>{txnId}</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setFromInfo(null); setToInfo(null); setStep(1); setSubmitted(false); }}
          style={{ ...primaryBtn, width: '100%' }}>New Transfer</button>
      </div>
    </div>
  );

  if (step === 2) return (
    <div>
      <button onClick={() => setStep(1)} style={backBtn}>← Back to Edit</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Confirm Transfer</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>Review the details before confirming.</p>

      <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 500 }}>
        {/* Transfer Arrow Visual */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ flex: 1, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>From</p>
            <p style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 2px' }}>{fromInfo?.fullName}</p>
            <p style={{ fontFamily: 'monospace', color: '#4F46E5', fontSize: '0.82rem', margin: 0 }}>{form.fromAccount}</p>
            <p style={{ fontSize: '0.8rem', color: '#059669', marginTop: 4 }}>Bal: ₹{(fromInfo?.balance ?? fromInfo?.initialDeposit)?.toLocaleString('en-IN')}</p>
          </div>
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 16px' }}>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>To</p>
            <p style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 2px' }}>{toInfo?.fullName}</p>
            <p style={{ fontFamily: 'monospace', color: '#059669', fontSize: '0.82rem', margin: 0 }}>{form.toAccount}</p>
          </div>
        </div>

        {[
          { label: 'Transfer Amount', value: `₹${Number(form.amount).toLocaleString('en-IN')}`, bold: true, color: '#4F46E5' },
          { label: 'Note', value: form.note || 'Fund Transfer' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.label}</span>
            <span style={{ fontWeight: item.bold ? 700 : 600, color: item.color || '#1e293b', fontSize: '0.9rem' }}>{item.value}</span>
          </div>
        ))}

        {error && <div style={{ ...errorBox, marginTop: 16 }}>⚠️ {error}</div>}

        <button onClick={handleConfirm} style={{ ...primaryBtn, width: '100%', marginTop: 24 }}>
          Confirm & Transfer
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Fund Transfer</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>Transfer funds between any two accounts instantly.</p>

      <form onSubmit={handleProceed} style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: '100%' }}>

        {/* From Account */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>From Account Number</label>
          <input type="text" name="fromAccount" placeholder="e.g. ACC1234567890"
            value={form.fromAccount} onChange={handle}
            onBlur={() => lookupAccount(form.fromAccount, setFromInfo, setFromError)}
            required style={inputStyle} />
          {fromError && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: 6 }}>⚠️ {fromError}</p>}
          {fromInfo && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', marginTop: 10 }}>
              <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{fromInfo.fullName}</p>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap' }}>
                <span>🏦 {fromInfo.accountType}</span>
                <span>💰 Balance: ₹{(fromInfo.balance ?? fromInfo.initialDeposit)?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        {/* To Account */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>To Account Number</label>
          <input type="text" name="toAccount" placeholder="e.g. ACC9876543210"
            value={form.toAccount} onChange={handle}
            onBlur={() => {
            if (form.toAccount.trim() && form.toAccount.trim() === form.fromAccount.trim()) {
              setToInfo(null); setToError('Sender and receiver accounts cannot be the same.');
            } else {
              lookupAccount(form.toAccount, setToInfo, setToError);
            }
          }}
            required style={inputStyle} />
          {toError && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: 6 }}>⚠️ {toError}</p>}
          {toInfo && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginTop: 10 }}>
              <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{toInfo.fullName}</p>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap' }}>
                <span>🏦 {toInfo.accountType}</span>
                <span>📞 {toInfo.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Transfer Amount (₹)</label>
          <input type="number" name="amount" placeholder="Enter amount" min="1"
            value={form.amount} onChange={handle} required style={inputStyle}
            onWheel={e => e.target.blur()}
            max={fromInfo ? (fromInfo.balance ?? fromInfo.initialDeposit) : undefined} />
          {form.amount && fromInfo && (
            <p style={{ fontSize: '0.8rem', marginTop: 6, fontWeight: 600, color: Number(form.amount) > (fromInfo.balance ?? fromInfo.initialDeposit) ? '#dc2626' : '#059669' }}>
              Available: ₹{(fromInfo.balance ?? fromInfo.initialDeposit)?.toLocaleString('en-IN')}
              {Number(form.amount) > (fromInfo.balance ?? fromInfo.initialDeposit) && ' — Exceeds balance!'}
            </p>
          )}
        </div>

        {/* Note */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Note (Optional)</label>
          <input type="text" name="note" placeholder="e.g. Rent payment, Family transfer"
            value={form.note} onChange={handle} style={inputStyle} />
        </div>

        {error && <div style={errorBox}>⚠️ {error}</div>}

        <button type="submit" style={{ ...primaryBtn, width: '100%', marginTop: 8 }}>
          Review Transfer →
        </button>
      </form>
    </div>
  );
}

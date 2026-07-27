import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { depositApi } from '../api';

export default function Deposit() {
  const navigate = useNavigate();
  const goBack = () => navigate('/dashboard');
  const [form, setForm] = useState({ accountNumber: '', accountHolder: '', amount: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [txnId, setTxnId] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await depositApi({ ...form, amount: Number(form.amount) });
      const data = await res.json();
      setTxnId(data.id);
      setSubmitted(true);
    } catch {
      alert('Failed to connect to server.');
    }
  };

  if (submitted) {
    return (
      <div>
        <button onClick={goBack} style={backBtnStyle}>← Back to Dashboard</button>
        <div style={{
          background: 'white', borderRadius: 16, padding: 40,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 480, textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💰</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
            Deposit Successful!
          </h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            ₹{Number(form.amount).toLocaleString('en-IN')} deposited to <strong>{form.accountNumber}</strong>
          </p>
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 12, padding: '16px 24px', marginBottom: 24,
          }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 4 }}>Transaction ID</p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#059669', fontFamily: 'monospace' }}>
              {txnId}
            </p>
          </div>
          <button onClick={goBack} style={primaryBtnStyle}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={goBack} style={backBtnStyle}>← Back to Dashboard</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Deposit Funds</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>
        Enter account details and deposit amount.
      </p>

      <form onSubmit={handleSubmit} style={{
        background: 'white', borderRadius: 16, padding: 32,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 500,
      }}>
        {[
          { label: 'Account Number', name: 'accountNumber', type: 'text', placeholder: 'e.g. ACC1234567890' },
          { label: 'Account Holder Name', name: 'accountHolder', type: 'text', placeholder: 'Full name' },
          { label: 'Deposit Amount (₹)', name: 'amount', type: 'number', placeholder: 'Enter amount' },
          { label: 'Note (Optional)', name: 'note', type: 'text', placeholder: 'e.g. Cash deposit' },
        ].map((f) => (
          <div key={f.name} style={{ marginBottom: 20 }}>
            <label style={labelStyle}>{f.label}</label>
            <input
              type={f.type} name={f.name} placeholder={f.placeholder}
              value={form[f.name]} onChange={handle}
              required={f.name !== 'note'}
              min={f.name === 'amount' ? 1 : undefined}
              onWheel={f.name === 'amount' ? (e) => e.target.blur() : undefined}
              style={inputStyle}
            />
          </div>
        ))}

        <button type="submit" style={{ ...primaryBtnStyle, width: '100%', marginTop: 8 }}>
          Deposit Now
        </button>
      </form>
    </div>
  );
}

const backBtnStyle = {
  background: 'none', border: 'none', color: '#1d4ed8',
  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
  marginBottom: 20, padding: 0,
};

const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600,
  color: '#374151', marginBottom: 6,
};

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  border: '1.5px solid #d1d5db', fontSize: '0.9rem',
  outline: 'none', background: '#f9fafb', color: '#1e293b',
  boxSizing: 'border-box',
};

const primaryBtnStyle = {
  background: '#d97706', color: 'white', border: 'none',
  padding: '13px 28px', borderRadius: 12, fontWeight: 600,
  fontSize: '0.95rem', cursor: 'pointer',
};

import React, { useState } from 'react';

export default function CreateAccount({ onBack, newCustomer }) {
  const [form, setForm] = useState({
    fullName: '', dob: '', phone: '', email: '',
    address: '', accountType: 'Savings', initialDeposit: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [accNumber] = useState(() => 'ACC' + Math.floor(1000000000 + Math.random() * 9000000000));

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <button onClick={onBack} style={backBtnStyle}>← Back to Dashboard</button>
        <div style={{
          background: 'white', borderRadius: 16, padding: 40,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 500, textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
            Account Created!
          </h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            New account has been successfully created for <strong>{form.fullName}</strong>.
          </p>
          <div style={{
            background: '#eff6ff', border: '1px solid #bfdbfe',
            borderRadius: 12, padding: '16px 24px', marginBottom: 24,
          }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 4 }}>Account Number</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace' }}>
              {accNumber}
            </p>
          </div>
          <button onClick={onBack} style={primaryBtnStyle}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={backBtnStyle}>← Back to Dashboard</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
        {newCustomer ? 'New Account Registration' : 'Create New Account'}
      </h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>
        Fill in the details to open a new bank account.
      </p>

      <form onSubmit={handleSubmit} style={{
        background: 'white', borderRadius: 16, padding: 32,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 600,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'John Doe' },
            { label: 'Date of Birth', name: 'dob', type: 'date', placeholder: '' },
            { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 9876543210' },
            { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@email.com' },
          ].map((f) => (
            <div key={f.name}>
              <label style={labelStyle}>{f.label}</label>
              <input
                type={f.type} name={f.name} placeholder={f.placeholder}
                value={form[f.name]} onChange={handle}
                required style={inputStyle}
              />
            </div>
          ))}

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Address</label>
            <textarea
              name="address" placeholder="Enter full address"
              value={form.address} onChange={handle}
              required rows={2}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Account Type</label>
            <select name="accountType" value={form.accountType} onChange={handle} style={inputStyle}>
              <option>Savings</option>
              <option>Current</option>
              <option>Fixed Deposit</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Initial Deposit (₹)</label>
            <input
              type="number" name="initialDeposit" placeholder="Min ₹500"
              value={form.initialDeposit} onChange={handle}
              required min="500" style={inputStyle}
            />
          </div>
        </div>

        <button type="submit" style={{ ...primaryBtnStyle, marginTop: 28, width: '100%' }}>
          Create Account
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
  background: '#1d4ed8', color: 'white', border: 'none',
  padding: '13px 28px', borderRadius: 12, fontWeight: 600,
  fontSize: '0.95rem', cursor: 'pointer',
};

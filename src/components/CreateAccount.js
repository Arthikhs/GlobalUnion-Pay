import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccountApi, getAccountByNumberApi, updateAccountApi } from '../api';

const emptyForm = {
  fullName: '', motherName: '', fatherName: '', dob: '', phone: '', email: '',
  address: '', occupation: '', accountType: 'Savings', initialDeposit: '',
};

const fields = [
  { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'John Doe' },
  { label: "Mother's Name", name: 'motherName', type: 'text', placeholder: "Mother's full name" },
  { label: "Father's Name", name: 'fatherName', type: 'text', placeholder: "Father's full name" },
  { label: 'Date of Birth', name: 'dob', type: 'date' },
  { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 9876543210' },
  { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@email.com' },
  { label: 'Occupation', name: 'occupation', type: '_select' },
];

export default function CreateAccount() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('create'); // 'create' | 'edit'

  // ── Create state ──
  const [createForm, setCreateForm] = useState(emptyForm);
  const [createError, setCreateError] = useState('');
  const [createDone, setCreateDone] = useState(false);
  const [newAccNumber, setNewAccNumber] = useState('');

  // ── Edit state ──
  const [searchAcc, setSearchAcc] = useState('');
  const [editForm, setEditForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editError, setEditError] = useState('');
  const [editDone, setEditDone] = useState(false);
  const [searchError, setSearchError] = useState('');

  // ── Create handlers ──
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      const res = await createAccountApi(createForm);
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error || 'Failed to create account.'); return; }
      setNewAccNumber(data.accountNumber);
      setCreateDone(true);
    } catch { setCreateError('Failed to connect to server.'); }
  };

  // ── Edit handlers ──
  const handleSearch = async () => {
    setSearchError('');
    setEditForm(null);
    if (!searchAcc.trim()) return;
    try {
      const res = await getAccountByNumberApi(searchAcc.trim());
      if (!res.ok) { setSearchError('Account not found.'); return; }
      const data = await res.json();
      setEditId(data.id);
      setEditForm({
        fullName: data.fullName, motherName: data.motherName, fatherName: data.fatherName,
        dob: data.dob, phone: data.phone, email: data.email,
        address: data.address, occupation: data.occupation, accountType: data.accountType,
      });
    } catch { setSearchError('Failed to connect to server.'); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      const res = await updateAccountApi(editId, editForm);
      const data = await res.json();
      if (!res.ok) { setEditError(data.error || 'Failed to update account.'); return; }
      setEditDone(true);
    } catch { setEditError('Failed to connect to server.'); }
  };

  const renderFields = (form, setForm, includeDeposit = false) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {fields.map((f) => (
        <div key={f.name}>
          <label style={labelStyle}>{f.label}</label>
          {f.type === '_select' ? (
            <select name={f.name} value={form[f.name]} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })} required style={inputStyle}>
              <option value="">Select occupation</option>
              <option>Student</option><option>Farmer</option>
              <option>Business</option><option>Employee</option><option>Other</option>
            </select>
          ) : (
            <input type={f.type} name={f.name} placeholder={f.placeholder || ''}
              value={form[f.name]} onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
              required style={inputStyle} />
          )}
        </div>
      ))}
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>Address</label>
        <textarea name="address" placeholder="Enter full address" value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          required rows={2} style={{ ...inputStyle, resize: 'none' }} />
      </div>
      <div>
        <label style={labelStyle}>Account Type</label>
        <select name="accountType" value={form.accountType} onChange={e => setForm({ ...form, accountType: e.target.value })} style={inputStyle}>
          <option>Savings</option><option>Business</option>
        </select>
      </div>
      {includeDeposit && (
        <div>
          <label style={labelStyle}>Initial Deposit (₹)</label>
          <input type="number" name="initialDeposit" placeholder="Min ₹500"
            value={form.initialDeposit} onChange={e => setForm({ ...form, initialDeposit: e.target.value })}
            required min="500" style={inputStyle} />
        </div>
      )}
    </div>
  );

  // ── Success screens ──
  if (createDone) return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <div style={successCard}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={successTitle}>Account Created!</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>New account created for <strong>{createForm.fullName}</strong>.</p>
        <div style={accBox}>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 4 }}>Account Number</p>
          <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace' }}>{newAccNumber}</p>
        </div>
        <button onClick={() => navigate('/dashboard')} style={primaryBtn}>Back to Dashboard</button>
      </div>
    </div>
  );

  if (editDone) return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <div style={successCard}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={successTitle}>Account Updated!</h2>
        <p style={{ color: '#64748b', marginBottom: 20 }}>Details saved for <strong>{editForm.fullName}</strong>.</p>
        <button onClick={() => { setEditDone(false); setEditForm(null); setSearchAcc(''); }} style={primaryBtn}>Edit Another</button>
      </div>
    </div>
  );

  return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '2px solid #e2e8f0', maxWidth: 400 }}>
        {[{ key: 'create', label: '➕ Create New Account' }, { key: 'edit', label: '✏️ Edit Account' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '12px 0', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.9rem',
            color: tab === t.key ? '#1d4ed8' : '#64748b',
            borderBottom: tab === t.key ? '2px solid #1d4ed8' : '2px solid transparent',
            marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── CREATE TAB ── */}
      {tab === 'create' && (
        <form onSubmit={handleCreate} style={formCard}>
          {renderFields(createForm, setCreateForm, true)}
          {createError && <div style={errorBox}>⚠️ {createError}</div>}
          <button type="submit" style={{ ...primaryBtn, marginTop: 28, width: '100%' }}>Create Account</button>
        </form>
      )}

      {/* ── EDIT TAB ── */}
      {tab === 'edit' && (
        <div>
          {/* Search bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, maxWidth: 500 }}>
            <input value={searchAcc} onChange={e => setSearchAcc(e.target.value)}
              placeholder="Enter Account Number (e.g. ACC1234567890)"
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            <button onClick={handleSearch} style={{ ...primaryBtn, whiteSpace: 'nowrap' }}>Search</button>
          </div>
          {searchError && <div style={{ ...errorBox, marginBottom: 16 }}>⚠️ {searchError}</div>}

          {editForm && (
            <form onSubmit={handleUpdate} style={formCard}>
              {renderFields(editForm, setEditForm, false)}
              {editError && <div style={errorBox}>⚠️ {editError}</div>}
              <button type="submit" style={{ ...primaryBtn, marginTop: 28, width: '100%', background: '#059669' }}>Save Changes</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

const backBtn = { background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 20, padding: 0 };
const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '0.9rem', outline: 'none', background: '#f9fafb', color: '#1e293b', boxSizing: 'border-box' };
const primaryBtn = { background: '#1d4ed8', color: 'white', border: 'none', padding: '13px 28px', borderRadius: 12, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' };
const formCard = { background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', width: '100%' };
const errorBox = { marginTop: 16, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.875rem' };
const successCard = { background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', maxWidth: 500, textAlign: 'center' };
const successTitle = { fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 };
const accBox = { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '16px 24px', marginBottom: 24 };

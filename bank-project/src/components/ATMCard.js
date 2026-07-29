import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccountByNumberApi } from '../api';
import jsPDF from 'jspdf';

const backBtn = { background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 20, padding: 0 };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #d1d5db', fontSize: '0.9rem', outline: 'none', background: '#f9fafb', color: '#1e293b', boxSizing: 'border-box' };
const primaryBtn = { background: '#1d4ed8', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' };

function formatCardNumber(accNumber) {
  const digits = accNumber.replace(/\D/g, '').padEnd(16, '0').slice(0, 16);
  return digits.match(/.{1,4}/g).join('  ');
}

function ATMCardPreview({ acc }) {
  const cardNum = formatCardNumber(acc.accountNumber);
  const expiry = '12/28';
  return (
    <div style={{
      width: 380, height: 220, borderRadius: 18,
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)',
      padding: '28px 28px 20px', boxSizing: 'border-box',
      boxShadow: '0 20px 60px rgba(29,78,216,0.4)',
      position: 'relative', overflow: 'hidden', color: 'white', fontFamily: 'monospace',
    }}>
      {/* Background circles */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
      <div style={{ position: 'absolute', bottom: -30, right: 60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

      {/* Bank name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: 1, fontFamily: 'Segoe UI, sans-serif' }}>GlobalUnion Pay</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.8, fontFamily: 'Segoe UI, sans-serif' }}>VISA</span>
      </div>

      {/* Chip */}
      <div style={{ width: 40, height: 30, background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: 6, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />

      {/* Card Number */}
      <div style={{ fontSize: '1.1rem', letterSpacing: 3, marginBottom: 16, fontWeight: 600 }}>{cardNum}</div>

      {/* Name & Expiry */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '0.6rem', opacity: 0.7, marginBottom: 2, fontFamily: 'Segoe UI, sans-serif' }}>CARD HOLDER</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Segoe UI, sans-serif' }}>{acc.fullName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.6rem', opacity: 0.7, marginBottom: 2, fontFamily: 'Segoe UI, sans-serif' }}>EXPIRES</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{expiry}</div>
        </div>
      </div>
    </div>
  );
}

export default function ATMCard() {
  const navigate = useNavigate();
  const [accNumber, setAccNumber] = useState('');
  const [accInfo, setAccInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(''); setAccInfo(null);
    if (!accNumber.trim()) return;
    setLoading(true);
    try {
      const res = await getAccountByNumberApi(accNumber.trim());
      if (!res.ok) { setError('Account not found. Please check the account number.'); setLoading(false); return; }
      setAccInfo(await res.json());
    } catch { setError('Failed to connect to server.'); }
    setLoading(false);
  };

  const handleDownload = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [86, 54] });
    const cardNum = formatCardNumber(accInfo.accountNumber);

    // Card background gradient simulation
    doc.setFillColor(30, 58, 138);
    doc.roundedRect(0, 0, 86, 54, 4, 4, 'F');

    // Decorative circles
    doc.setFillColor(255, 255, 255, 0.05);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.1);
    doc.setFillColor(50, 80, 160);
    doc.circle(75, 8, 18, 'F');
    doc.setFillColor(45, 75, 155);
    doc.circle(68, 46, 14, 'F');

    // Bank name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('GlobalUnion Pay', 6, 10);

    // VISA
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('VISA', 76, 10);

    // Chip
    doc.setFillColor(251, 191, 36);
    doc.roundedRect(6, 14, 12, 9, 1.5, 1.5, 'F');
    doc.setDrawColor(180, 130, 10);
    doc.setLineWidth(0.3);
    doc.line(12, 14, 12, 23);
    doc.line(6, 18.5, 18, 18.5);

    // Card Number
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('courier', 'bold');
    doc.text(cardNum, 6, 32);

    // Labels
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 210, 255);
    doc.text('CARD HOLDER', 6, 39);
    doc.text('EXPIRES', 65, 39);

    // Values
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(accInfo.fullName.toUpperCase().slice(0, 22), 6, 44);
    doc.text('12/28', 65, 44);

    // Account type badge
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 210, 255);
    doc.text(accInfo.accountType.toUpperCase() + ' ACCOUNT', 6, 50);
    doc.text(accInfo.accountNumber, 45, 50);

    doc.save(`ATM_Card_${accInfo.accountNumber}.pdf`);
  };

  return (
    <div>
      <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Generate ATM Card</h2>
      <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>Enter account number to generate and download ATM card.</p>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <input value={accNumber} onChange={e => setAccNumber(e.target.value)}
          placeholder="Enter Account Number (e.g. ACC1234567890)"
          style={{ ...inputStyle, flex: 1 }} />
        <button type="submit" style={{ ...primaryBtn, whiteSpace: 'nowrap' }} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.875rem', marginBottom: 24 }}>⚠️ {error}</div>}

      {accInfo && (
        <div>
          {/* Account Info */}
          <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', marginBottom: 32 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>👤 Account Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              {[
                { label: 'Full Name', value: accInfo.fullName },
                { label: 'Account Number', value: accInfo.accountNumber },
                { label: 'Account Type', value: accInfo.accountType },
                { label: 'Phone', value: accInfo.phone },
                { label: 'Email', value: accInfo.email },
                { label: 'Balance', value: `₹${(accInfo.balance ?? accInfo.initialDeposit)?.toLocaleString('en-IN')}` },
                { label: 'Opened On', value: accInfo.createdOn },
                { label: 'Occupation', value: accInfo.occupation },
              ].map(item => (
                <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, margin: 0 }}>{item.value || '—'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ATM Card Preview */}
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>💳 ATM Card Preview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
            <ATMCardPreview acc={accInfo} />
            <button onClick={handleDownload} style={{ ...primaryBtn, background: '#059669', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⬇️ Download ATM Card PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const employeeName = localStorage.getItem('employeeName') || 'Employee';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeId');
    navigate('/');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
      padding: '0 32px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 64,
      boxShadow: '0 2px 12px rgba(29,78,216,0.3)', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        <div style={{ background: 'white', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }} fill="none" viewBox="0 0 24 24" stroke="#1d4ed8" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V21H3V10.5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
          </svg>
        </div>
        <span style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', letterSpacing: 0.5 }}>GlobalUnion Bank</span>
      </div>
      <div style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
        👋 Welcome Back, <span style={{ color: '#bfdbfe' }}>{employeeName}</span>
      </div>
      <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
        Logout
      </button>
    </div>
  );
}

export function DashboardLayout() {
  useEffect(() => {
    document.body.classList.add('dashboard-page');
    return () => document.body.classList.remove('dashboard-page');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Segoe UI, sans-serif' }}>
      <Navbar />
      <div style={{ padding: '36px 32px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { id: 'bank-details', icon: '🏦', title: 'Bank Details', desc: 'View account balance, IFSC, branch and account info.', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
    { id: 'deposit', icon: '💰', title: 'Deposit & Withdrawal', desc: 'Deposit or withdraw funds from any account quickly and securely.', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { id: 'create-account', icon: '👤', title: 'Create & Edit Account', desc: 'Create a new customer account or edit an existing account.', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    { id: 'customer-details', icon: '🧑💼', title: 'Customer Details', desc: 'View and manage all registered customer accounts.', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { id: 'loan-details', icon: '🏛️', title: 'Loan Details', desc: 'Issue and manage customer loans, track active and closed loans.', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
    { id: 'atm-card', icon: '💳', title: 'Generate ATM Card', desc: 'Generate and download ATM card PDF for any customer account.', color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
    { id: 'fund-transfer', icon: '🔄', title: 'Fund Transfer', desc: 'Transfer funds instantly between any two customer accounts.', color: '#4F46E5', bg: '#eef2ff', border: '#c7d2fe' },
  ];

  return (
    <>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>Dashboard</h2>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: '0.95rem' }}>Select an option below to get started.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {cards.map((card) => (
          <div key={card.id} onClick={() => navigate(`/dashboard/${card.id}`)}
            style={{ background: 'white', border: `1.5px solid ${card.border}`, borderRadius: 16, padding: '28px 24px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: 16 }}>
              {card.icon}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>{card.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>{card.desc}</p>
            <div style={{ marginTop: 20, color: card.color, fontWeight: 600, fontSize: '0.85rem' }}>Open →</div>
          </div>
        ))}
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BankDetails from '../components/BankDetails';
import CreateAccount from '../components/CreateAccount';
import Deposit from '../components/Deposit';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const cards = [
    {
      id: 'bank-details',
      icon: '🏦',
      title: 'Bank Details',
      desc: 'View your account balance, IFSC, branch and account info.',
      color: '#1d4ed8',
      bg: '#eff6ff',
      border: '#bfdbfe',
    },
    {
      id: 'create-account',
      icon: '👤',
      title: 'Create New Account',
      desc: 'Open a new savings or current bank account instantly.',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
    },
    {
      id: 'deposit',
      icon: '💰',
      title: 'Deposit',
      desc: 'Deposit funds into any account quickly and securely.',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
    },
    {
      id: 'new-account',
      icon: '➕',
      title: 'New Account',
      desc: 'Register a brand new customer and assign an account number.',
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ddd6fe',
    },
  ];

  const renderSection = () => {
    if (activeSection === 'bank-details') return <BankDetails onBack={() => setActiveSection(null)} />;
    if (activeSection === 'create-account') return <CreateAccount onBack={() => setActiveSection(null)} />;
    if (activeSection === 'deposit') return <Deposit onBack={() => setActiveSection(null)} />;
    if (activeSection === 'new-account') return <CreateAccount onBack={() => setActiveSection(null)} newCustomer />;
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* TOP WELCOME BAR */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        boxShadow: '0 2px 12px rgba(29,78,216,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'white', borderRadius: '50%', width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }} fill="none"
              viewBox="0 0 24 24" stroke="#1d4ed8" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V21H3V10.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
            </svg>
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', letterSpacing: 0.5 }}>
            SecureBank
          </span>
        </div>

        <div style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
          👋 Welcome Back, <span style={{ color: '#bfdbfe' }}>EMP001</span>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: 'white', padding: '8px 18px', borderRadius: 8,
            cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
          onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: '36px 32px' }}>

        {!activeSection ? (
          <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
              Dashboard
            </h2>
            <p style={{ color: '#64748b', marginBottom: 32, fontSize: '0.95rem' }}>
              Select an option below to get started.
            </p>

            {/* CARDS GRID */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setActiveSection(card.id)}
                  style={{
                    background: 'white',
                    border: `1.5px solid ${card.border}`,
                    borderRadius: 16,
                    padding: '28px 24px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: card.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', marginBottom: 16,
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                    {card.desc}
                  </p>
                  <div style={{
                    marginTop: 20, display: 'inline-flex', alignItems: 'center',
                    gap: 6, color: card.color, fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    Open →
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          renderSection()
        )}

      </div>
    </div>
  );
}

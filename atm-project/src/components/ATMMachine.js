import React, { useState } from 'react';

// ─── Mock data — no backend needed ────────────────────────────────────────
const MOCK_ACCOUNTS_BY_PHONE = {
  '9876543210': { accountNumber: 'ACC001', fullName: 'Rahul Sharma', phone: '9876543210', balance: 50000, transactions: [
    { type: 'CREDIT', amount: 10000 }, { type: 'DEBIT', amount: 2000 },
    { type: 'CREDIT', amount: 5000 }, { type: 'DEBIT', amount: 1500 }, { type: 'CREDIT', amount: 3000 },
  ]},
  '9123456780': { accountNumber: 'ACC002', fullName: 'Priya Patel', phone: '9123456780', balance: 75000, transactions: [
    { type: 'CREDIT', amount: 20000 }, { type: 'DEBIT', amount: 5000 },
    { type: 'CREDIT', amount: 8000 }, { type: 'DEBIT', amount: 3000 }, { type: 'CREDIT', amount: 1000 },
  ]},
};

const fetchAccountByPhone = async (phone) => {
  await new Promise(r => setTimeout(r, 800));
  const acc = MOCK_ACCOUNTS_BY_PHONE[phone];
  if (!acc) return { ok: false };
  return { ok: true, json: async () => acc };
};

const postWithdraw = async () => {
  await new Promise(r => setTimeout(r, 600));
  return { ok: true };
};

// ─── Styles ────────────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: '100vh', width: '100vw',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Segoe UI, sans-serif', overflow: 'hidden',
  },
  body: {
    width: 420,
    background: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
    borderRadius: 28,
    boxShadow: '0 60px 120px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)',
    padding: '28px 28px 36px',
    position: 'relative',
    border: '2px solid #3a3a3a',
  },
  logoBar: {
    background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
    borderRadius: 12, padding: '10px 16px', marginBottom: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  screen: {
    background: '#0a0a0a', borderRadius: 12, padding: 0,
    border: '3px solid #111', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.9)',
    marginBottom: 16, overflow: 'hidden', position: 'relative',
  },
  screenInner: {
    background: 'linear-gradient(180deg, #0d1b2a 0%, #0a1628 100%)',
    padding: '20px 16px', minHeight: 200,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  glare: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
    borderRadius: '10px 10px 0 0', zIndex: 1, pointerEvents: 'none',
  },
  input: {
    width: '100%', background: '#0a1628', border: '1px solid #1e3a5f',
    borderRadius: 8, padding: '10px 12px', color: '#e2e8f0',
    fontSize: '1rem', outline: 'none', textAlign: 'center',
    letterSpacing: 2, boxSizing: 'border-box', marginTop: 10,
  },
  btn: (color = '#1d4ed8') => ({
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    border: 'none', borderRadius: 8, padding: '10px 20px',
    color: 'white', fontWeight: 700, fontSize: '0.85rem',
    cursor: 'pointer', marginTop: 12, width: '100%', letterSpacing: 0.5,
  }),
  menuItem: () => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', borderRadius: 8, marginBottom: 6, cursor: 'pointer',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid #1e3a5f',
    color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600,
  }),
  error: { color: '#f87171', fontSize: '0.75rem', marginTop: 8, textAlign: 'center' },
  keyBtn: {
    background: 'linear-gradient(180deg, #3a3a3a, #252525)',
    borderRadius: 8, padding: '10px 0', textAlign: 'center',
    color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 3px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
    border: '1px solid #444', userSelect: 'none',
  },
};

// ─── Keypad ────────────────────────────────────────────────────────────────
function Keypad({ onKey }) {
  return (
    <div style={{ background: '#111', borderRadius: 12, padding: 14, border: '1px solid #2a2a2a' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
        {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k => (
          <div key={k} style={{ ...S.keyBtn, color: k === '*' || k === '#' ? '#f59e0b' : '#e2e8f0' }}
            onClick={() => onKey(k)}>{k}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { label: 'CLR', color: '#f59e0b' },
          { label: 'ENTER', color: '#4ade80' },
          { label: 'CANCEL', color: '#f87171' },
        ].map(k => (
          <div key={k.label}
            style={{ background: 'linear-gradient(180deg, #2a2a2a, #1a1a1a)', borderRadius: 8, padding: '8px 0',
              textAlign: 'center', color: k.color, fontSize: '0.6rem', fontWeight: 800,
              cursor: 'pointer', letterSpacing: 0.5, boxShadow: '0 3px 6px rgba(0,0,0,0.5)',
              border: `1px solid ${k.color}44` }}
            onClick={() => onKey(k.label)}>
            {k.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ATM Machine ───────────────────────────────────────────────────────────
export default function ATMMachine() {
  const [screen, setScreen] = useState('welcome');

  const [amtInput, setAmtInput] = useState('');
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [phoneInput, setPhoneInput] = useState('');

  const reset = () => {
    setScreen('welcome'); setPinInput(''); setAmtInput(''); setAccount(null);
    setError(''); setLoading(false); setReceipt(null); setPhoneInput('');
  };

  // ── Phone lookup ───────────────────────────────────────────────────────
  const handlePhoneEnter = async () => {
    if (phoneInput.length !== 10) { setError('Enter 10-digit phone number'); return; }
    setError('');
    setLoading(true);
    const res = await fetchAccountByPhone(phoneInput);
    if (!res.ok) { setError('No account found for this number'); setLoading(false); return; }
    const data = await res.json();
    setAccount(data);
    setTransactions(data.transactions || []);
    setPhoneInput('');
    setScreen('menu');
    setLoading(false);
  };

  // ── Keypad handler ─────────────────────────────────────────────────────
  const handleKey = (k) => {
    if (k === 'CANCEL') { reset(); return; }
    if (k === '*' || k === '#') return;

    if (screen === 'phone') {
      if (k === 'CLR') { setPhoneInput(''); setError(''); return; }
      if (k === 'ENTER') { handlePhoneEnter(); return; }
      if (!isNaN(k) && phoneInput.length < 10) setPhoneInput(prev => prev + k);
      return;
    }

    if (screen === 'withdraw') {
      if (k === 'CLR') { setAmtInput(''); setError(''); return; }
      if (k === 'ENTER') { handleWithdraw(); return; }
      setAmtInput(prev => prev + k);
    }
  };



  const handleWithdraw = async () => {
    const amt = parseFloat(amtInput);
    if (!amt || amt <= 0) { setError('Enter valid amount'); return; }
    const bal = account?.balance ?? 0;
    if (amt > bal) { setError('Insufficient balance'); return; }
    if (amt % 100 !== 0) { setError('Amount must be multiple of ₹100'); return; }
    setLoading(true);
    try {
      const res = await postWithdraw({
        accountNumber: account.accountNumber,
        accountHolder: account.fullName || '',

        amount: amt,
        note: 'ATM Cash Withdrawal',
      });
      if (!res.ok) { setError('Withdrawal failed'); setLoading(false); return; }
      setAccount(prev => ({ ...prev, balance: bal - amt }));
      setReceipt({ type: 'Withdrawal', amount: amt, balance: bal - amt, time: new Date().toLocaleString() });
      setAmtInput('');
      setScreen('receipt');
    } catch { setError('Connection error'); }
    setLoading(false);
  };

  // ── Screens ────────────────────────────────────────────────────────────
  const screenContent = () => {
    switch (screen) {

      case 'welcome':
        return (
          <div style={S.screenInner}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💳</div>
            <p style={{ color: '#4ade80', fontSize: '1rem', fontWeight: 700, margin: 0, letterSpacing: 1 }}>WELCOME</p>
            <p style={{ color: '#60a5fa', fontSize: '0.72rem', margin: '6px 0 16px', opacity: 0.8 }}>GlobalUnion Pay ATM</p>
            <p style={{ color: '#94a3b8', fontSize: '0.68rem', margin: '0 0 12px', textAlign: 'center' }}>Please insert your card to continue</p>
            <button
              style={{ ...S.btn('#1d4ed8'), width: 'auto', padding: '12px 32px', marginTop: 0, fontSize: '0.9rem' }}
              onClick={() => { setError(''); setScreen('phone'); }}
            >
              💳 INSERT CARD
            </button>
            <p style={{ color: '#1e3a5f', fontSize: '0.58rem', marginTop: 10, textAlign: 'center' }}>
              Demo: 9876543210 &nbsp;|&nbsp; 9123456780
            </p>
          </div>
        );

      case 'phone':
        return (
          <div style={{ ...S.screenInner, alignItems: 'stretch' }}>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>📱</div>
              <p style={{ color: '#60a5fa', fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>ENTER PHONE NUMBER</p>
              <p style={{ color: '#475569', fontSize: '0.62rem', margin: '4px 0 0' }}>Registered mobile number</p>
            </div>
            <div style={{ ...S.input, fontSize: '1.1rem', letterSpacing: 4, textAlign: 'center' }}>
              {phoneInput ? '•'.repeat(phoneInput.length) : <span style={{ color: '#334155', letterSpacing: 1 }}>__________</span>}
            </div>
            <p style={{ color: '#334155', fontSize: '0.6rem', textAlign: 'center', marginTop: 4 }}>
              {phoneInput.length}/10 digits
            </p>
            {error && <p style={S.error}>{error}</p>}
            {loading && <p style={{ color: '#60a5fa', fontSize: '0.7rem', textAlign: 'center', marginTop: 6 }}>Verifying...</p>}
          </div>
        );





      case 'menu':
        return (
          <div style={{ ...S.screenInner, alignItems: 'stretch', padding: '16px' }}>
            <p style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', margin: '0 0 4px' }}>
              {account?.fullName?.toUpperCase()}
            </p>
            <p style={{ color: '#334155', fontSize: '0.6rem', textAlign: 'center', margin: '0 0 12px' }}>
              {account?.accountNumber}
            </p>
            {[
              { icon: '💰', label: 'Balance Inquiry', action: () => setScreen('balance') },
              { icon: '💵', label: 'Cash Withdrawal', action: () => { setAmtInput(''); setError(''); setScreen('withdraw'); } },
              { icon: '📋', label: 'Mini Statement', action: () => setScreen('miniStatement') },
              { icon: '🚪', label: 'Exit', action: reset },
            ].map((item, i) => (
              <div key={i} style={S.menuItem()} onClick={item.action}>
                <span>{item.icon} {item.label}</span>
                <span style={{ color: '#1d4ed8' }}>▶</span>
              </div>
            ))}
          </div>
        );

      case 'balance':
        return (
          <div style={S.screenInner}>
            <p style={{ color: '#94a3b8', fontSize: '0.7rem', margin: '0 0 4px' }}>Account Holder</p>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 16px' }}>{account?.fullName}</p>
            <p style={{ color: '#94a3b8', fontSize: '0.7rem', margin: '0 0 4px' }}>Available Balance</p>
            <p style={{ color: '#4ade80', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
              ₹{(account?.balance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p style={{ color: '#475569', fontSize: '0.65rem', marginTop: 8 }}>{account?.accountNumber}</p>
            <button style={{ ...S.btn('#1e3a8a'), marginTop: 16, width: 'auto', padding: '8px 24px' }}
              onClick={() => setScreen('menu')}>← BACK</button>
          </div>
        );

      case 'withdraw':
        return (
          <div style={{ ...S.screenInner, alignItems: 'stretch' }}>
            <p style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', margin: '0 0 4px' }}>CASH WITHDRAWAL</p>
            <p style={{ color: '#475569', fontSize: '0.65rem', textAlign: 'center', margin: '0 0 8px' }}>
              Balance: ₹{(account?.balance ?? 0).toLocaleString('en-IN')}
            </p>

            {/* Amount display */}
            <div style={{ ...S.input, minHeight: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {amtInput ? `₹ ${amtInput}` : <span style={{ color: '#334155' }}>Enter Amount</span>}
            </div>

            <p style={{ color: '#334155', fontSize: '0.6rem', textAlign: 'center', marginTop: 6 }}>Multiples of ₹100 only</p>
            {error && <p style={S.error}>{error}</p>}
            {loading && <p style={{ color: '#60a5fa', fontSize: '0.7rem', textAlign: 'center', marginTop: 8 }}>Processing...</p>}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button style={{ ...S.btn('#1e3a8a'), marginTop: 0, flex: 1 }} onClick={() => setScreen('menu')}>← BACK</button>
            </div>
          </div>
        );

      case 'miniStatement': {
        const recent = [...transactions].reverse().slice(0, 5);
        return (
          <div style={{ ...S.screenInner, alignItems: 'stretch', padding: '14px' }}>
            <p style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', margin: '0 0 10px' }}>MINI STATEMENT</p>
            {recent.length === 0
              ? <p style={{ color: '#475569', fontSize: '0.7rem', textAlign: 'center' }}>No transactions</p>
              : recent.map((t, i) => {
                  const type = t.type || t.transactionType || '';
                  const isCredit = type.toUpperCase() === 'CREDIT';
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #0f2a45' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.62rem' }}>{type}</span>
                      <span style={{ color: isCredit ? '#4ade80' : '#f87171', fontSize: '0.65rem', fontWeight: 700 }}>
                        {isCredit ? '+' : '-'}₹{t.amount}
                      </span>
                    </div>
                  );
                })
            }
            <button style={{ ...S.btn('#1e3a8a'), marginTop: 12, width: 'auto', padding: '7px 20px', alignSelf: 'center' }}
              onClick={() => setScreen('menu')}>← BACK</button>
          </div>
        );
      }

      case 'receipt':
        return (
          <div style={S.screenInner}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
            <p style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>TRANSACTION SUCCESSFUL</p>
            <div style={{ marginTop: 14, width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 16px' }}>
              {[
                { label: 'Type', value: receipt?.type, color: '#e2e8f0' },
                { label: 'Amount', value: `-₹${receipt?.amount}`, color: '#f87171' },
                { label: 'New Balance', value: `₹${receipt?.balance?.toLocaleString('en-IN')}`, color: '#4ade80' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < 2 ? 6 : 0 }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{r.label}</span>
                  <span style={{ color: r.color, fontSize: '0.7rem', fontWeight: 700 }}>{r.value}</span>
                </div>
              ))}
            </div>
            <p style={{ color: '#475569', fontSize: '0.6rem', marginTop: 8 }}>{receipt?.time}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={{ ...S.btn('#1d4ed8'), width: 'auto', padding: '8px 16px', marginTop: 0 }}
                onClick={() => setScreen('menu')}>MENU</button>
              <button style={{ ...S.btn('#dc2626'), width: 'auto', padding: '8px 16px', marginTop: 0 }}
                onClick={reset}>EXIT</button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={S.root}>
      <div style={S.body}>

        {/* Logo Bar */}
        <div style={S.logoBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🏦</div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', letterSpacing: 0.5 }}>GlobalUnion Pay</span>
          </div>
          <span style={{ color: '#bfdbfe', fontSize: '0.7rem', fontWeight: 600 }}>ATM</span>
        </div>

        {/* Screen */}
        <div style={S.screen}>
          <div style={S.glare} />
          {screenContent()}
        </div>

        {/* Side Buttons + Mini Menu */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'space-around' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 28, height: 18, background: 'linear-gradient(180deg, #555, #333)', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />
            ))}
          </div>
          <div style={{ flex: 1, background: '#050e1a', borderRadius: 8, padding: '10px 12px', border: '1px solid #1e3a5f' }}>
            {['Balance Inquiry', 'Cash Withdrawal', 'Mini Statement', 'Exit'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 3 ? '1px solid #0f2a45' : 'none' }}>
                <span style={{ color: '#60a5fa', fontSize: '0.65rem' }}>{item}</span>
                <span style={{ color: '#1e3a5f', fontSize: '0.6rem' }}>►</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'space-around' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 28, height: 18, background: 'linear-gradient(180deg, #555, #333)', borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />
            ))}
          </div>
        </div>

        {/* Card Slot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, background: '#111', borderRadius: 8, padding: '8px 14px', border: '1px solid #2a2a2a' }}>
          <div style={{ flex: 1, height: 6, background: '#0a0a0a', borderRadius: 3, border: '1px solid #333' }} />
          <span style={{ color: '#555', fontSize: '0.6rem', whiteSpace: 'nowrap' }}>INSERT CARD</span>
          <div style={{ flex: 1, height: 6, background: '#0a0a0a', borderRadius: 3, border: '1px solid #333' }} />
        </div>

        {/* Keypad — active only on pin/withdraw screens */}
        <Keypad onKey={handleKey} />

        {/* Cash Dispenser */}
        <div style={{ marginTop: 16, background: '#0a0a0a', borderRadius: 8, padding: '8px 14px', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 8, background: '#050505', borderRadius: 4, border: '1px solid #222' }} />
          <span style={{ color: '#333', fontSize: '0.55rem', whiteSpace: 'nowrap' }}>CASH DISPENSER</span>
          <div style={{ flex: 1, height: 8, background: '#050505', borderRadius: 4, border: '1px solid #222' }} />
        </div>

        {/* Receipt Slot */}
        <div style={{ marginTop: 8, background: '#0a0a0a', borderRadius: 6, padding: '5px 14px', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 4, background: '#050505', borderRadius: 2 }} />
          <span style={{ color: '#2a2a2a', fontSize: '0.5rem', whiteSpace: 'nowrap' }}>RECEIPT</span>
          <div style={{ flex: 1, height: 4, background: '#050505', borderRadius: 2 }} />
        </div>

        {/* Status LED */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14, gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
          <span style={{ color: '#4ade80', fontSize: '0.6rem', fontWeight: 600 }}>ONLINE</span>
        </div>

      </div>
    </div>
  );
}

import { useState } from 'react';
import { Smartphone, Building2, User, Wallet, X, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { useBankBalance } from '../hooks/useBankBalance';
import { api } from '../services/api';
import { useAuthStore } from '../store/store';
import toast from 'react-hot-toast';

interface FoundUser { fullName: string; phone: string; accountNumber?: string; }

const transferOptions = [
  { id: 'mobile',    icon: Smartphone, label: 'Mobile Number',  desc: 'Send to registered mobile number', color: 'bg-blue-50 text-blue-600',     border: 'border-blue-100' },
  { id: 'bank',      icon: Building2,  label: 'Bank Account',   desc: 'Transfer to bank account',         color: 'bg-green-50 text-green-600',   border: 'border-green-100' },
  { id: 'self',      icon: User,       label: 'Self Account',   desc: 'Transfer to your own account',     color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  { id: 'globalupi', icon: Wallet,     label: 'GlobalUPI',      desc: 'Pay via GlobalUPI ID / VPA',       color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
];

const BANK_API = '/bank-api';

export default function WalletPage() {
  const { user } = useAuthStore();
  const { balance, accountNumber, accountName, bankTransfer, refetch } = useBankBalance();

  const [transferModal, setTransferModal] = useState<string | null>(null);
  const [transferInput, setTransferInput] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [step, setStep]           = useState(1);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [paySuccess, setPaySuccess]   = useState(false);
  const [paying, setPaying]           = useState(false);

  async function handleSearch() {
    if (!transferInput) return;
    setSearching(true); setSearchError(''); setFoundUser(null);
    try {
      const phone10 = transferInput.replace(/\D/g,'').slice(-10);
      // Try multiple phone formats the bank might store
      let data = null;
      for (const fmt of [phone10, `+91${phone10}`, `91${phone10}`, `0${phone10}`]) {
        const res = await fetch(`${BANK_API}/accounts/check-phone?phone=${fmt}`);
        if (res.ok) { data = await res.json(); break; }
      }
      if (data) {
        const myPhone = (user?.phone||'').replace(/\D/g,'').slice(-10);
        const theirPhone = (data.phone||'').replace(/\D/g,'').slice(-10);
        if (theirPhone === myPhone) {
          setSearchError('You cannot send money to yourself.');
        } else {
          setFoundUser({ fullName: data.fullName, phone: data.phone, accountNumber: data.accountNumber });
        }
      } else {
        setSearchError('No registered bank account found with this mobile number.');
      }
    } catch {
      setSearchError('No registered bank account found with this mobile number.');
    } finally {
      setSearching(false);
    }
  }

  async function handlePay() {
    if (!transferAmount || Number(transferAmount) <= 0) return;
    setPaying(true);
    const result = await bankTransfer(transferInput, Number(transferAmount), 'UPI Transfer');
    setPaying(false);
    if (result.success) {
      setPaySuccess(true);
    } else {
      toast.error(result.message);
    }
  }

  function handleClose() {
    setTransferModal(null); setTransferInput(''); setTransferAmount('');
    setStep(1); setFoundUser(null); setSearchError(''); setPaySuccess(false);
  }

  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Money Transfer</h1>
        <p className="text-sm text-gray-500 mt-1">Send money instantly from your bank account</p>
      </div>

      {/* Transfer Options */}
      <div className="grid grid-cols-4 gap-3">
        {transferOptions.map(opt => (
          <button key={opt.id} onClick={() => { setTransferModal(opt.id); setStep(1); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${opt.border} ${opt.color.split(' ')[0]} hover:shadow-md transition-all`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${opt.color}`}>
              <opt.icon size={22} />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Bank Balance Card */}
      <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)' }}>
        <p className="text-blue-100 text-sm font-medium">Bank Balance</p>
        <p className="text-4xl font-bold mt-1">₹{fmt(balance)}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-blue-200 text-xs">Account</p>
            <p className="font-semibold text-sm">{accountNumber || '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs">Name</p>
            <p className="font-semibold text-sm">{accountName || user?.fullName}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Account Type', value: 'Savings',  icon: '🏦', color: 'text-blue-600' },
          { label: 'Status',       value: 'Active',   icon: '✅', color: 'text-green-600' },
          { label: 'Currency',     value: 'INR ₹',    icon: '💱', color: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <span className="text-2xl">{s.icon}</span>
            <p className={`text-sm font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Transfer Modal */}
      {transferModal && (() => {
        const opt = transferOptions.find(o => o.id === transferModal)!;
        return (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${opt.color}`}>
                    <opt.icon size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{opt.label}</h2>
                </div>
                <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>

              {paySuccess ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <CheckCircle2 size={56} className="text-green-500" />
                  <p className="text-xl font-bold text-gray-900">₹{transferAmount} Sent!</p>
                  <p className="text-sm text-gray-500">To {foundUser?.fullName} · {transferInput}</p>
                  <p className="text-xs text-gray-400">New Balance: ₹{fmt(balance)}</p>
                  <button onClick={handleClose}
                    className="mt-2 w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-5">
                    {[1,2].map(s => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step>=s?'bg-blue-500':'bg-gray-200'}`} />
                    ))}
                  </div>

                  {step === 1 && (
                    <>
                      <p className="text-sm text-gray-500 mb-3">{opt.desc}</p>
                      <div className="flex gap-2">
                        <input autoFocus
                          type={opt.id==='mobile'?'tel':'text'}
                          placeholder={opt.id==='mobile'?'Enter 10-digit mobile number':'Enter account number'}
                          value={transferInput}
                          maxLength={opt.id==='mobile'?10:undefined}
                          onChange={e=>{setTransferInput(e.target.value);setFoundUser(null);setSearchError('');}}
                          onKeyDown={e=>e.key==='Enter'&&handleSearch()}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button onClick={handleSearch} disabled={searching||transferInput.length<10}
                          className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition">
                          {searching
                            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                            : <Search size={18}/>}
                        </button>
                      </div>
                      {searchError && <p className="text-xs text-red-500 mt-2">{searchError}</p>}
                      {foundUser && (
                        <div className="mt-4 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                            style={{background:'linear-gradient(135deg,#1D4ED8,#0EA5E9)'}}>
                            {foundUser.fullName?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{foundUser.fullName}</p>
                            <p className="text-xs text-gray-500">{foundUser.phone}</p>
                            {foundUser.accountNumber && <p className="text-xs text-blue-500">{foundUser.accountNumber}</p>}
                          </div>
                          <CheckCircle2 size={20} className="text-green-500"/>
                        </div>
                      )}
                      <button onClick={()=>setStep(2)} disabled={!foundUser}
                        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2">
                        Next <ArrowRight size={16}/>
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{background:'linear-gradient(135deg,#1D4ED8,#0EA5E9)'}}>
                          {foundUser?.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{foundUser?.fullName}</p>
                          <p className="text-xs text-gray-500">{transferInput} · {foundUser?.accountNumber}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
                        <input autoFocus type="number" placeholder="Enter amount"
                          value={transferAmount} onChange={e=>setTransferAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {[100,500,1000,2000].map(amt=>(
                          <button key={amt} onClick={()=>setTransferAmount(String(amt))}
                            className={`py-2 rounded-xl text-xs font-medium border transition-colors ${transferAmount===String(amt)?'bg-blue-600 text-white border-blue-600':'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                            ₹{amt}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between text-xs">
                        <span className="text-gray-400">Sending from</span>
                        <span className="font-semibold text-blue-600">{accountNumber || user?.phone}</span>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={()=>setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Back</button>
                        <button onClick={handlePay}
                          disabled={!transferAmount||Number(transferAmount)<=0||paying}
                          className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
                          {paying?'Sending...':`Pay ₹${transferAmount||'0'}`}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

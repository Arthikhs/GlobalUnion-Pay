import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useBankBalance } from '../hooks/useBankBalance';
import toast from 'react-hot-toast';

const metals = [
  { id: 'gold',     label: 'Gold',     emoji: '🥇', price: 6245, unit: 'per gram', change: +0.42, color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-400' },
  { id: 'silver',   label: 'Silver',   emoji: '🥈', price: 78.5, unit: 'per gram', change: -0.18, color: 'from-gray-400 to-gray-600',   bg: 'bg-gray-50',   border: 'border-gray-400' },
  { id: 'platinum', label: 'Platinum', emoji: '🏅', price: 2890, unit: 'per gram', change: +1.05, color: 'from-blue-300 to-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-400' },
];

export default function GoldPage() {
  const { balance, accountNumber, bankPay, refetch } = useBankBalance();
  const [selected, setSelected] = useState('gold');
  const [grams, setGrams] = useState('');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [vault, setVault] = useState<Record<string, number>>({ gold: 0, silver: 0, platinum: 0 });

  const metal = metals.find(m => m.id === selected)!;
  const total = (parseFloat(grams) || 0) * metal.price;
  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  async function handleBuy() {
    if (!grams || total <= 0) return;
    if (total > balance) { toast.error('Insufficient bank balance.'); return; }
    setPaying(true);
    const result = await bankPay(total, `${metal.label} Purchase — ${grams}g`);
    setPaying(false);
    if (result.success) {
      setVault(v => ({ ...v, [selected]: +(v[selected] + parseFloat(grams)).toFixed(4) }));
      setSuccess(true);
      refetch();
      setTimeout(() => { setSuccess(false); setGrams(''); }, 3000);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gold, Silver & Platinum</h1>
          <p className="text-sm text-gray-500 mt-1">Buy & sell precious metals digitally</p>
        </div>
        <div className="text-right bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2">
          <p className="text-xs text-blue-400 font-medium">Bank Balance</p>
          <p className="text-lg font-bold text-blue-600">₹{fmt(balance)}</p>
          {accountNumber && <p className="text-xs text-blue-300">{accountNumber}</p>}
        </div>
      </div>

      {/* Metal selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {metals.map(m => (
          <motion.button key={m.id} onClick={() => { setSelected(m.id); setGrams(''); setSuccess(false); }}
            className={`p-5 rounded-2xl border-2 text-left transition ${selected === m.id ? `${m.border} ${m.bg}` : 'border-gray-100 bg-white'}`}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{m.emoji}</span>
              <span className={`text-xs font-semibold flex items-center gap-1 ${m.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {m.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {m.change >= 0 ? '+' : ''}{m.change}%
              </span>
            </div>
            <p className="font-bold text-gray-900 mt-2">{m.label}</p>
            <p className="text-lg font-bold text-gray-900">₹{m.price.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500">{m.unit}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-900">Buy {metal.label}</h3>
          <div className={`bg-gradient-to-br ${metal.color} rounded-2xl p-4 text-white`}>
            <p className="text-sm text-white/80">Live Price</p>
            <p className="text-3xl font-bold">₹{metal.price.toLocaleString('en-IN')}</p>
            <p className="text-xs text-white/70">{metal.unit}</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Quantity (grams)</label>
            <input value={grams} onChange={e => setGrams(e.target.value)} type="number" placeholder="e.g. 1" min="0.01" step="0.01"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>

          {total > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-gray-900 font-bold">₹{fmt(total)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Available Balance</span>
                <span className={`font-semibold ${total > balance ? 'text-red-500' : 'text-green-600'}`}>₹{fmt(balance)}</span>
              </div>
              {total > balance && <p className="text-xs text-red-500">⚠️ Insufficient bank balance.</p>}
            </div>
          )}

          <AnimatePresence>
            {success ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <p className="font-semibold text-green-700">Purchase Successful!</p>
                  <p className="text-xs text-green-600">{grams}g {metal.label} added to your vault</p>
                </div>
              </motion.div>
            ) : (
              <button onClick={handleBuy} disabled={!grams || total <= 0 || total > balance || paying}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition">
                {paying ? 'Processing...' : `Buy ${metal.label} — ₹${total ? fmt(total) : '0'}`}
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Vault */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Your Vault</h3>
          <div className="space-y-3">
            {metals.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{m.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">{vault[m.id].toFixed(4)} g</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{(vault[m.id] * m.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm font-bold">
            <span className="text-gray-700">Total Vault Value</span>
            <span className="text-yellow-600">
              ₹{metals.reduce((sum, m) => sum + vault[m.id] * m.price, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

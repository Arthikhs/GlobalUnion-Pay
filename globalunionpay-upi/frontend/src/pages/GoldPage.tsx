import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

const metals = [
  { id: 'gold', label: 'Gold', emoji: '🥇', price: 6245, unit: 'per gram', change: +0.42, color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-400' },
  { id: 'silver', label: 'Silver', emoji: '🥈', price: 78.5, unit: 'per gram', change: -0.18, color: 'from-gray-400 to-gray-600', bg: 'bg-gray-50 dark:bg-gray-700/40', border: 'border-gray-400' },
  { id: 'platinum', label: 'Platinum', emoji: '🏅', price: 2890, unit: 'per gram', change: +1.05, color: 'from-blue-300 to-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-400' },
];

export default function GoldPage() {
  const [selected, setSelected] = useState('gold');
  const [grams, setGrams] = useState('');
  const [success, setSuccess] = useState(false);

  const metal = metals.find(m => m.id === selected)!;
  const total = (parseFloat(grams) || 0) * metal.price;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gold, Silver & Platinum</h1>
        <p className="text-sm text-gray-500 mt-1">Buy & sell precious metals digitally</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {metals.map(m => (
          <motion.button key={m.id} onClick={() => setSelected(m.id)}
            className={`p-5 rounded-2xl border-2 text-left transition ${selected === m.id ? `${m.border} ${m.bg}` : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{m.emoji}</span>
              <span className={`text-xs font-semibold flex items-center gap-1 ${m.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {m.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {m.change >= 0 ? '+' : ''}{m.change}%
              </span>
            </div>
            <p className="font-bold text-gray-900 dark:text-white mt-2">{m.label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">₹{m.price.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500">{m.unit}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Buy {metal.label}</h3>
          <div className={`bg-gradient-to-br ${metal.color} rounded-2xl p-4 text-white`}>
            <p className="text-sm text-white/80">Live Price</p>
            <p className="text-3xl font-bold">₹{metal.price.toLocaleString('en-IN')}</p>
            <p className="text-xs text-white/70">{metal.unit}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Quantity (grams)</label>
            <input value={grams} onChange={e => setGrams(e.target.value)} type="number" placeholder="e.g. 1"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
          </div>
          {total > 0 && (
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-gray-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span>
            </div>
          )}
          <AnimatePresence>
            {success ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">Purchase Successful!</p>
                  <p className="text-xs text-green-600">{grams}g {metal.label} added to your vault</p>
                </div>
              </motion.div>
            ) : (
              <button onClick={() => { if (grams) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); } }}
                disabled={!grams}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition">
                Buy {metal.label} — ₹{total ? total.toLocaleString('en-IN') : '0'}
              </button>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Vault</h3>
          <div className="space-y-3">
            {metals.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{m.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{m.label}</p>
                    <p className="text-xs text-gray-500">0.00 g</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">₹0</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

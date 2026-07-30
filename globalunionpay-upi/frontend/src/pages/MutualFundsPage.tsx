import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

const funds = [
  { id: 'equity', name: 'Axis Bluechip Fund', type: 'Equity', risk: 'High', returns: '+18.4%', nav: 52.34, trending: true },
  { id: 'debt', name: 'HDFC Short Term Debt', type: 'Debt', risk: 'Low', returns: '+7.2%', nav: 24.18, trending: true },
  { id: 'hybrid', name: 'ICICI Balanced Advantage', type: 'Hybrid', risk: 'Medium', returns: '+12.6%', nav: 38.75, trending: true },
  { id: 'index', name: 'Nifty 50 Index Fund', type: 'Index', risk: 'Medium', returns: '+15.1%', nav: 145.60, trending: true },
  { id: 'elss', name: 'Mirae Asset ELSS', type: 'ELSS', risk: 'High', returns: '+21.3%', nav: 89.22, trending: false },
  { id: 'liquid', name: 'SBI Liquid Fund', type: 'Liquid', risk: 'Very Low', returns: '+6.8%', nav: 3421.50, trending: true },
];

const riskColors: Record<string, string> = {
  'Very Low': 'bg-green-100 text-green-700',
  'Low': 'bg-blue-100 text-blue-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'High': 'bg-red-100 text-red-700',
};

export default function MutualFundsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip');
  const [success, setSuccess] = useState(false);

  const fund = funds.find(f => f.id === selected);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mutual Funds</h1>
        <p className="text-sm text-gray-500 mt-1">Invest in top-performing mutual funds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {funds.map(f => (
          <motion.button key={f.id} onClick={() => setSelected(f.id)}
            className={`p-4 rounded-2xl border-2 text-left transition ${selected === f.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-200'}`}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{f.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{f.type} Fund</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColors[f.risk]}`}>{f.risk}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-xs text-gray-500">NAV</p>
                <p className="font-bold text-gray-900 dark:text-white">₹{f.nav}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">1Y Returns</p>
                <p className={`font-bold flex items-center gap-1 ${f.trending ? 'text-green-500' : 'text-red-500'}`}>
                  {f.trending ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{f.returns}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {fund && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Invest in {fund.name}</h3>

            <div className="flex gap-2">
              {(['sip', 'lumpsum'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${mode === m ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {m === 'sip' ? 'SIP (Monthly)' : 'Lump Sum'}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-gray-500 font-medium">Amount (₹) {mode === 'sip' ? '— Min ₹500' : '— Min ₹1,000'}</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number"
                placeholder={mode === 'sip' ? '500' : '1000'}
                className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>

            <AnimatePresence>
              {success ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                  className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100">
                  <CheckCircle className="text-green-500" size={24} />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-400">Investment Placed!</p>
                    <p className="text-xs text-green-600">₹{amount} {mode === 'sip' ? 'SIP started' : 'invested'} in {fund.name}</p>
                  </div>
                </motion.div>
              ) : (
                <button onClick={() => { if (amount) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); } }}
                  disabled={!amount}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition">
                  {mode === 'sip' ? 'Start SIP' : 'Invest Now'} — ₹{amount || '0'}
                </button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

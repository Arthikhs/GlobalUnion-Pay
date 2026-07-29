import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tv, Zap, Droplets, Flame, Wifi, CheckCircle } from 'lucide-react';

const categories = [
  { id: 'mobile', label: 'Mobile', icon: Smartphone, color: 'from-blue-500 to-cyan-500', emoji: '📱' },
  { id: 'dth', label: 'DTH', icon: Tv, color: 'from-purple-500 to-pink-500', emoji: '📺' },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: 'from-yellow-500 to-orange-500', emoji: '⚡' },
  { id: 'water', label: 'Water', icon: Droplets, color: 'from-cyan-500 to-blue-500', emoji: '💧' },
  { id: 'gas', label: 'Gas', icon: Flame, color: 'from-orange-500 to-red-500', emoji: '🔥' },
  { id: 'broadband', label: 'Broadband', icon: Wifi, color: 'from-green-500 to-teal-500', emoji: '🌐' },
  { id: 'insurance', label: 'Insurance', icon: CheckCircle, color: 'from-indigo-500 to-purple-500', emoji: '🛡️' },
  { id: 'fastag', label: 'FASTag', icon: Smartphone, color: 'from-teal-500 to-green-500', emoji: '🚗' },
];

const operators: Record<string, string[]> = {
  mobile: ['Airtel', 'Jio', 'Vi', 'BSNL'],
  dth: ['Tata Play', 'Dish TV', 'Airtel DTH', 'Sun Direct'],
  electricity: ['BESCOM', 'MSEDCL', 'TPDDL', 'CESC'],
  water: ['BWSSB', 'MJP', 'Chennai Metro Water'],
  gas: ['Indane', 'HP Gas', 'Bharat Gas'],
  broadband: ['Airtel', 'Jio Fiber', 'ACT', 'BSNL'],
  insurance: ['LIC', 'HDFC Life', 'SBI Life', 'ICICI Prudential'],
  fastag: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Paytm Payments Bank'],
};

const plans: Record<string, { price: number; validity: string; data?: string; desc: string }[]> = {
  mobile: [
    { price: 149, validity: '28 days', data: '1GB/day', desc: 'Basic Plan' },
    { price: 299, validity: '28 days', data: '2GB/day', desc: 'Popular Plan' },
    { price: 599, validity: '84 days', data: '2GB/day', desc: 'Quarterly Plan' },
    { price: 999, validity: '365 days', data: '2.5GB/day', desc: 'Annual Plan' },
  ],
};

export default function RechargePage() {
  const [activeCategory, setActiveCategory] = useState('mobile');
  const [operator, setOperator] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    if (!number || !amount) return;
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recharge & Bills</h1>
        <p className="text-sm text-gray-500 mt-1">Pay bills and recharge instantly</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map(cat => (
          <motion.button key={cat.id} onClick={() => { setActiveCategory(cat.id); setOperator(''); setAmount(''); setSelectedPlan(null); }}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition ${activeCategory === cat.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-200'}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{activeCategory} Recharge</h3>

          <div>
            <label className="text-xs text-gray-500 font-medium">Select Operator</label>
            <select value={operator} onChange={e => setOperator(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
              <option value="">Choose operator</option>
              {(operators[activeCategory] || []).map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">
              {activeCategory === 'mobile' ? 'Mobile Number' : activeCategory === 'electricity' ? 'Consumer Number' : 'Account / ID'}
            </label>
            <input value={number} onChange={e => setNumber(e.target.value)}
              placeholder={activeCategory === 'mobile' ? '9876543210' : 'Enter account number'}
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Amount (₹)</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Enter amount"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <AnimatePresence>
            {success ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">Recharge Successful!</p>
                  <p className="text-xs text-green-600">₹{amount} recharged for {number}</p>
                </div>
              </motion.div>
            ) : (
              <button onClick={handlePay} disabled={!number || !amount || !operator}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition">
                Pay ₹{amount || '0'}
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Plans */}
        {activeCategory === 'mobile' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Popular Plans</h3>
            <div className="space-y-3">
              {plans.mobile.map((plan, i) => (
                <motion.div key={i} onClick={() => { setSelectedPlan(i); setAmount(String(plan.price)); }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${selectedPlan === i ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-primary-200'}`}
                  whileHover={{ scale: 1.01 }}>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{plan.desc}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{plan.data} • {plan.validity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600 text-lg">₹{plan.price}</p>
                    {selectedPlan === i && <span className="text-xs text-green-500">Selected</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

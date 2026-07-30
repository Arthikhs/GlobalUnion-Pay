import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tv, Zap, Droplets, Flame, Wifi, Shield, Car, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/store';
import { useBankBalance } from '../hooks/useBankBalance';
import toast from 'react-hot-toast';

const categories = [
  { id: 'mobile',      label: 'Mobile',      icon: Smartphone, emoji: '📱' },
  { id: 'dth',         label: 'DTH',         icon: Tv,         emoji: '📺' },
  { id: 'electricity', label: 'Electricity', icon: Zap,        emoji: '⚡' },
  { id: 'water',       label: 'Water',       icon: Droplets,   emoji: '💧' },
  { id: 'gas',         label: 'Gas',         icon: Flame,      emoji: '🔥' },
  { id: 'broadband',   label: 'Broadband',   icon: Wifi,       emoji: '🌐' },
  { id: 'insurance',   label: 'Insurance',   icon: Shield,     emoji: '🛡️' },
  { id: 'fastag',      label: 'FASTag',      icon: Car,        emoji: '🚗' },
];

const operators: Record<string, string[]> = {
  mobile:      ['Airtel', 'Jio', 'Vi', 'BSNL'],
  dth:         ['Tata Play', 'Dish TV', 'Airtel DTH', 'Sun Direct'],
  electricity: ['BESCOM', 'MSEDCL', 'TPDDL', 'CESC'],
  water:       ['BWSSB', 'MJP', 'Chennai Metro Water'],
  gas:         ['Indane', 'HP Gas', 'Bharat Gas'],
  broadband:   ['Airtel Xstream', 'Jio Fiber', 'ACT Fibernet', 'BSNL Fiber'],
  insurance:   ['LIC', 'HDFC Life', 'SBI Life', 'ICICI Prudential'],
  fastag:      ['HDFC Bank', 'ICICI Bank', 'SBI', 'Paytm Payments Bank'],
};

type Plan = { price: number; validity: string; data?: string; desc: string; tag?: string };

const allPlans: Record<string, Record<string, Plan[]>> = {
  mobile: {
    Airtel: [
      { price: 149, validity: '28 days', data: '1GB/day',   desc: 'Basic',     },
      { price: 265, validity: '28 days', data: '1.5GB/day', desc: 'Smart',     tag: '🔥 Popular' },
      { price: 299, validity: '28 days', data: '2GB/day',   desc: 'Standard',  },
      { price: 359, validity: '28 days', data: '2.5GB/day', desc: 'Plus',      },
      { price: 599, validity: '84 days', data: '2GB/day',   desc: 'Quarterly', tag: '💎 Best Value' },
      { price: 839, validity: '84 days', data: '2.5GB/day', desc: 'Premium',   },
      { price: 1799,validity: '365 days',data: '2.5GB/day', desc: 'Annual',    tag: '⭐ Best' },
    ],
    Jio: [
      { price: 155, validity: '28 days', data: '1.5GB/day', desc: 'Basic',     },
      { price: 249, validity: '28 days', data: '2GB/day',   desc: 'Smart',     tag: '🔥 Popular' },
      { price: 299, validity: '28 days', data: '2.5GB/day', desc: 'Standard',  },
      { price: 533, validity: '84 days', data: '2GB/day',   desc: 'Quarterly', tag: '💎 Best Value' },
      { price: 666, validity: '84 days', data: '2.5GB/day', desc: 'Premium',   },
      { price: 2999,validity: '365 days',data: '2.5GB/day', desc: 'Annual',    tag: '⭐ Best' },
    ],
    Vi: [
      { price: 149, validity: '28 days', data: '1GB/day',   desc: 'Basic'  },
      { price: 269, validity: '28 days', data: '1.5GB/day', desc: 'Smart',  tag: '🔥 Popular' },
      { price: 299, validity: '28 days', data: '2GB/day',   desc: 'Standard' },
      { price: 479, validity: '56 days', data: '1.5GB/day', desc: 'Long',   tag: '💎 Best Value' },
      { price: 1799,validity: '365 days',data: '2GB/day',   desc: 'Annual', tag: '⭐ Best' },
    ],
    BSNL: [
      { price: 107, validity: '28 days', data: '1GB/day',   desc: 'Basic'  },
      { price: 187, validity: '28 days', data: '2GB/day',   desc: 'Smart',  tag: '🔥 Popular' },
      { price: 397, validity: '80 days', data: '2GB/day',   desc: 'Long',   tag: '💎 Best Value' },
      { price: 1999,validity: '365 days',data: '2GB/day',   desc: 'Annual', tag: '⭐ Best' },
    ],
  },
  dth: {
    'Tata Play':   [{ price: 153, validity: '30 days', desc: 'Basic HD' }, { price: 299, validity: '30 days', desc: 'Standard HD', tag: '🔥 Popular' }, { price: 499, validity: '30 days', desc: 'Premium HD', tag: '⭐ Best' }],
    'Dish TV':     [{ price: 129, validity: '30 days', desc: 'Basic' },    { price: 249, validity: '30 days', desc: 'Standard',    tag: '🔥 Popular' }, { price: 399, validity: '30 days', desc: 'Premium',    tag: '⭐ Best' }],
    'Airtel DTH':  [{ price: 153, validity: '30 days', desc: 'Basic HD' }, { price: 349, validity: '30 days', desc: 'Standard HD', tag: '🔥 Popular' }, { price: 599, validity: '30 days', desc: 'Premium HD', tag: '⭐ Best' }],
    'Sun Direct':  [{ price: 99,  validity: '30 days', desc: 'Basic' },    { price: 199, validity: '30 days', desc: 'Standard',    tag: '🔥 Popular' }, { price: 349, validity: '30 days', desc: 'Premium',    tag: '⭐ Best' }],
  },
  electricity: {
    BESCOM:  [{ price: 500, validity: 'One-time', desc: 'Bill Payment' }, { price: 1000, validity: 'One-time', desc: 'Bill Payment', tag: '🔥 Popular' }, { price: 2000, validity: 'One-time', desc: 'Bill Payment' }, { price: 5000, validity: 'One-time', desc: 'Bill Payment' }],
    MSEDCL:  [{ price: 500, validity: 'One-time', desc: 'Bill Payment' }, { price: 1000, validity: 'One-time', desc: 'Bill Payment', tag: '🔥 Popular' }, { price: 2000, validity: 'One-time', desc: 'Bill Payment' }, { price: 5000, validity: 'One-time', desc: 'Bill Payment' }],
    TPDDL:   [{ price: 500, validity: 'One-time', desc: 'Bill Payment' }, { price: 1000, validity: 'One-time', desc: 'Bill Payment', tag: '🔥 Popular' }, { price: 2000, validity: 'One-time', desc: 'Bill Payment' }],
    CESC:    [{ price: 500, validity: 'One-time', desc: 'Bill Payment' }, { price: 1000, validity: 'One-time', desc: 'Bill Payment', tag: '🔥 Popular' }, { price: 3000, validity: 'One-time', desc: 'Bill Payment' }],
  },
  water: {
    BWSSB:                [{ price: 200, validity: 'One-time', desc: 'Water Bill' }, { price: 500, validity: 'One-time', desc: 'Water Bill', tag: '🔥 Popular' }, { price: 1000, validity: 'One-time', desc: 'Water Bill' }],
    MJP:                  [{ price: 200, validity: 'One-time', desc: 'Water Bill' }, { price: 500, validity: 'One-time', desc: 'Water Bill', tag: '🔥 Popular' }],
    'Chennai Metro Water':[{ price: 300, validity: 'One-time', desc: 'Water Bill' }, { price: 600, validity: 'One-time', desc: 'Water Bill', tag: '🔥 Popular' }],
  },
  gas: {
    Indane:      [{ price: 899, validity: 'Per cylinder', desc: 'LPG Cylinder', tag: '🔥 Popular' }, { price: 1799, validity: '2 cylinders', desc: 'Double Booking' }],
    'HP Gas':    [{ price: 909, validity: 'Per cylinder', desc: 'LPG Cylinder', tag: '🔥 Popular' }, { price: 1818, validity: '2 cylinders', desc: 'Double Booking' }],
    'Bharat Gas':[{ price: 895, validity: 'Per cylinder', desc: 'LPG Cylinder', tag: '🔥 Popular' }, { price: 1790, validity: '2 cylinders', desc: 'Double Booking' }],
  },
  broadband: {
    'Airtel Xstream': [{ price: 499, validity: '30 days', data: '100 Mbps', desc: 'Basic', }, { price: 799, validity: '30 days', data: '200 Mbps', desc: 'Standard', tag: '🔥 Popular' }, { price: 1499, validity: '30 days', data: '1 Gbps', desc: 'Ultra', tag: '⭐ Best' }],
    'Jio Fiber':      [{ price: 399, validity: '30 days', data: '30 Mbps',  desc: 'Basic', }, { price: 699, validity: '30 days', data: '100 Mbps', desc: 'Standard', tag: '🔥 Popular' }, { price: 1499, validity: '30 days', data: '1 Gbps', desc: 'Ultra', tag: '⭐ Best' }],
    'ACT Fibernet':   [{ price: 549, validity: '30 days', data: '150 Mbps', desc: 'Basic', }, { price: 799, validity: '30 days', data: '300 Mbps', desc: 'Standard', tag: '🔥 Popular' }, { price: 1299, validity: '30 days', data: '1 Gbps', desc: 'Ultra', tag: '⭐ Best' }],
    'BSNL Fiber':     [{ price: 449, validity: '30 days', data: '50 Mbps',  desc: 'Basic', }, { price: 699, validity: '30 days', data: '100 Mbps', desc: 'Standard', tag: '🔥 Popular' }],
  },
  insurance: {
    LIC:                [{ price: 1000, validity: 'Monthly', desc: 'Premium Payment', tag: '🔥 Popular' }, { price: 5000, validity: 'Quarterly', desc: 'Premium Payment' }, { price: 12000, validity: 'Yearly', desc: 'Premium Payment', tag: '⭐ Best' }],
    'HDFC Life':        [{ price: 1500, validity: 'Monthly', desc: 'Premium Payment', tag: '🔥 Popular' }, { price: 6000, validity: 'Quarterly', desc: 'Premium Payment' }, { price: 18000, validity: 'Yearly', desc: 'Premium Payment', tag: '⭐ Best' }],
    'SBI Life':         [{ price: 1200, validity: 'Monthly', desc: 'Premium Payment', tag: '🔥 Popular' }, { price: 4800, validity: 'Quarterly', desc: 'Premium Payment' }],
    'ICICI Prudential': [{ price: 2000, validity: 'Monthly', desc: 'Premium Payment', tag: '🔥 Popular' }, { price: 8000, validity: 'Quarterly', desc: 'Premium Payment' }],
  },
  fastag: {
    'HDFC Bank':           [{ price: 200, validity: 'Recharge', desc: 'FASTag Top-up' }, { price: 500, validity: 'Recharge', desc: 'FASTag Top-up', tag: '🔥 Popular' }, { price: 1000, validity: 'Recharge', desc: 'FASTag Top-up' }, { price: 2000, validity: 'Recharge', desc: 'FASTag Top-up' }],
    'ICICI Bank':          [{ price: 200, validity: 'Recharge', desc: 'FASTag Top-up' }, { price: 500, validity: 'Recharge', desc: 'FASTag Top-up', tag: '🔥 Popular' }, { price: 1000, validity: 'Recharge', desc: 'FASTag Top-up' }],
    SBI:                   [{ price: 200, validity: 'Recharge', desc: 'FASTag Top-up' }, { price: 500, validity: 'Recharge', desc: 'FASTag Top-up', tag: '🔥 Popular' }, { price: 1000, validity: 'Recharge', desc: 'FASTag Top-up' }],
    'Paytm Payments Bank': [{ price: 200, validity: 'Recharge', desc: 'FASTag Top-up' }, { price: 500, validity: 'Recharge', desc: 'FASTag Top-up', tag: '🔥 Popular' }, { price: 1000, validity: 'Recharge', desc: 'FASTag Top-up' }],
  },
};

export default function RechargePage() {
  const { user } = useAuthStore();
  const { balance, accountNumber, bankPay } = useBankBalance();
  const [paying, setPaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mobile');
  const [operator, setOperator] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [bookedInfo, setBookedInfo] = useState<any>(null);

  const plans = operator ? (allPlans[activeCategory]?.[operator] || []) : [];

  async function handlePay() {
    setPaying(true);
    const result = await bankPay(Number(amount), `${activeCategory.toUpperCase()} - ${operator} - ${number}`);
    setPaying(false);
    if (result.success) {
      const plan = operator && selectedPlan !== null ? (allPlans[activeCategory]?.[operator]?.[selectedPlan]) : null;
      setBookedInfo({ category: activeCategory, operator, number, amount, plan });
      setStep('success');
    } else {
      toast.error(result.message);
    }
  }

  function handleReset() {
    setStep('form');
    setOperator('');
    setNumber('');
    setAmount('');
    setSelectedPlan(null);
    setBookedInfo(null);
  }

  const labelMap: Record<string, string> = {
    mobile: 'Mobile Number', electricity: 'Consumer Number', water: 'Account Number',
    gas: 'Consumer Number', broadband: 'Account ID', dth: 'Subscriber ID',
    insurance: 'Policy Number', fastag: 'Vehicle Number',
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recharge & Bills</h1>
        <p className="text-sm text-gray-500 mt-1">Pay bills and recharge instantly</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setOperator(''); setAmount(''); setSelectedPlan(null); setStep('form'); }}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition ${activeCategory === cat.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 bg-white hover:border-indigo-200'}`}>
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-xs font-medium text-gray-700">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 capitalize">{activeCategory} Recharge</h3>
            <span className="text-xs text-gray-400">Bank Balance: <span className="font-semibold text-blue-600">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></span>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Select Operator / Provider</label>
            <select value={operator} onChange={e => { setOperator(e.target.value); setSelectedPlan(null); setAmount(''); }}
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="">Choose operator</option>
              {(operators[activeCategory] || []).map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">{labelMap[activeCategory] || 'Account / ID'}</label>
            <input value={number} onChange={e => setNumber(e.target.value)}
              placeholder={activeCategory === 'mobile' ? '10-digit mobile number' : 'Enter account / ID'}
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Amount (₹)</label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
              <input value={amount} onChange={e => { setAmount(e.target.value); setSelectedPlan(null); }} type="number"
                placeholder="Enter amount"
                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>

          {balance < Number(amount) && Number(amount) > 0 && (
            <p className="text-xs text-red-500 font-medium">⚠️ Insufficient bank balance.</p>
          )}

          <button
            onClick={() => setStep('confirm')}
            disabled={!number || !amount || !operator || Number(amount) <= 0 || balance < Number(amount)}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
            Proceed to Pay ₹{amount || '0'} <ArrowRight size={16} />
          </button>
        </div>

        {/* Plans */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">
            {operator ? `${operator} Plans` : 'Select operator to see plans'}
          </h3>
          {plans.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-300">
              <span className="text-4xl mb-2">📋</span>
              <p className="text-sm">No plans loaded</p>
            </div>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {plans.map((plan, i) => (
              <motion.div key={i} whileHover={{ scale: 1.01 }}
                onClick={() => { setSelectedPlan(i); setAmount(String(plan.price)); }}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${selectedPlan === i ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{plan.desc}</p>
                    {plan.tag && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">{plan.tag}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {plan.data ? `${plan.data} · ` : ''}{plan.validity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600 text-lg">₹{plan.price}</p>
                  {selectedPlan === i && <span className="text-xs text-green-500">✓ Selected</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {step === 'confirm' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Confirm Payment</h2>
                <button onClick={() => setStep('form')} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  ['Category',  activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)],
                  ['Operator',  operator],
                  [labelMap[activeCategory] || 'Account', number],
                  ...(selectedPlan !== null && plans[selectedPlan] ? [
                    ['Plan', plans[selectedPlan].desc],
                    ['Validity', plans[selectedPlan].validity],
                    ...(plans[selectedPlan].data ? [['Data', plans[selectedPlan].data!]] : []),
                  ] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-indigo-600 text-lg">₹{Number(amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Bank Balance {accountNumber && `(${accountNumber})`}</span>
                  <span className="text-green-600 font-semibold">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('form')} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Back</button>
                <button onClick={handlePay} disabled={paying}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                  {paying ? 'Processing...' : `Pay ₹${Number(amount).toLocaleString('en-IN')}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {step === 'success' && bookedInfo && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
              <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Successful!</h2>
              <p className="text-gray-500 text-sm mb-5">Your recharge has been processed</p>

              <div className="bg-indigo-50 rounded-2xl p-4 text-left space-y-2 mb-4">
                {[
                  ['Operator',  bookedInfo.operator],
                  [labelMap[bookedInfo.category] || 'Account', bookedInfo.number],
                  ...(bookedInfo.plan ? [
                    ['Plan',     bookedInfo.plan.desc],
                    ['Validity', bookedInfo.plan.validity],
                    ...(bookedInfo.plan.data ? [['Data', bookedInfo.plan.data]] : []),
                  ] : []),
                  ['Amount Paid', `₹${Number(bookedInfo.amount).toLocaleString('en-IN')}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mb-5">
                New Bank Balance: ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>

              <button onClick={handleReset}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                Recharge Again
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

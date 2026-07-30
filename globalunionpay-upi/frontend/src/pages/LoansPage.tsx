import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Home, Car, GraduationCap, Briefcase, Tractor } from 'lucide-react';

const loanTypes = [
  { id: 'home', label: 'Home Loan', icon: Home, emoji: '🏠', rate: '8.5%', maxAmt: '₹1 Cr', tenure: '30 yrs' },
  { id: 'car', label: 'Car Loan', icon: Car, emoji: '🚗', rate: '9.0%', maxAmt: '₹50 L', tenure: '7 yrs' },
  { id: 'education', label: 'Education', icon: GraduationCap, emoji: '🎓', rate: '10.5%', maxAmt: '₹20 L', tenure: '15 yrs' },
  { id: 'personal', label: 'Personal', icon: Briefcase, emoji: '💼', rate: '12.0%', maxAmt: '₹10 L', tenure: '5 yrs' },
  { id: 'agriculture', label: 'Agriculture', icon: Tractor, emoji: '🌾', rate: '7.0%', maxAmt: '₹5 L', tenure: '5 yrs' },
];

export default function LoansPage() {
  const [selected, setSelected] = useState('home');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [success, setSuccess] = useState(false);

  const loan = loanTypes.find(l => l.id === selected)!;
  const rate = parseFloat(loan.rate) / 100 / 12;
  const months = parseInt(tenure) * 12 || 0;
  const principal = parseFloat(amount) || 0;
  const emi = months && principal ? Math.round((principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loans</h1>
        <p className="text-sm text-gray-500 mt-1">Apply for loans at competitive rates</p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
        {loanTypes.map(l => (
          <motion.button key={l.id} onClick={() => setSelected(l.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition ${selected === l.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-200'}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="text-2xl">{l.emoji}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{l.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{loan.emoji}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{loan.label}</h3>
              <p className="text-xs text-gray-500">Rate: {loan.rate} | Max: {loan.maxAmt} | Up to {loan.tenure}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Loan Amount (₹)</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Enter amount"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Tenure (Years)</label>
            <input value={tenure} onChange={e => setTenure(e.target.value)} type="number" placeholder="e.g. 5"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <AnimatePresence>
            {success ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">Application Submitted!</p>
                  <p className="text-xs text-green-600">We'll contact you within 24 hours.</p>
                </div>
              </motion.div>
            ) : (
              <button onClick={() => { if (amount && tenure) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); } }}
                disabled={!amount || !tenure}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition">
                Apply Now
              </button>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">EMI Calculator</h3>
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-6 text-white text-center">
            <p className="text-sm text-white/70">Monthly EMI</p>
            <p className="text-4xl font-bold mt-1">₹{emi ? emi.toLocaleString('en-IN') : '—'}</p>
          </div>
          {emi > 0 && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Principal</span><span className="font-medium dark:text-white">₹{principal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Interest</span><span className="font-medium text-red-500">₹{(emi * months - principal).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between border-t pt-2 dark:border-gray-700"><span className="text-gray-500">Total Payable</span><span className="font-bold dark:text-white">₹{(emi * months).toLocaleString('en-IN')}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

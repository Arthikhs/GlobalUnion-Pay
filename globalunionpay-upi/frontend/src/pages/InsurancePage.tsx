import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const insuranceTypes = [
  { id: 'life', label: 'Life Insurance', emoji: '❤️', desc: 'Secure your family\'s future', premium: '₹500/mo', cover: '₹50 L' },
  { id: 'health', label: 'Health Insurance', emoji: '🏥', desc: 'Cashless hospitalisation', premium: '₹800/mo', cover: '₹10 L' },
  { id: 'vehicle', label: 'Vehicle Insurance', emoji: '🚗', desc: 'Comprehensive car cover', premium: '₹3,500/yr', cover: 'IDV' },
  { id: 'travel', label: 'Travel Insurance', emoji: '✈️', desc: 'Trip cancellation & medical', premium: '₹299/trip', cover: '₹5 L' },
  { id: 'home', label: 'Home Insurance', emoji: '🏠', desc: 'Protect your property', premium: '₹1,200/yr', cover: '₹25 L' },
  { id: 'term', label: 'Term Plan', emoji: '📋', desc: 'Pure life cover at low cost', premium: '₹650/mo', cover: '₹1 Cr' },
];

const providers: Record<string, string[]> = {
  life: ['LIC', 'HDFC Life', 'SBI Life', 'ICICI Prudential'],
  health: ['Star Health', 'Niva Bupa', 'Care Health', 'HDFC ERGO'],
  vehicle: ['ICICI Lombard', 'Bajaj Allianz', 'New India', 'HDFC ERGO'],
  travel: ['Tata AIG', 'Bajaj Allianz', 'HDFC ERGO', 'Reliance General'],
  home: ['New India', 'Oriental Insurance', 'Bajaj Allianz', 'HDFC ERGO'],
  term: ['LIC', 'Max Life', 'HDFC Life', 'ICICI Prudential'],
};

export default function InsurancePage() {
  const [selected, setSelected] = useState('health');
  const [provider, setProvider] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [success, setSuccess] = useState(false);

  const ins = insuranceTypes.find(i => i.id === selected)!;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insurance</h1>
        <p className="text-sm text-gray-500 mt-1">Protect what matters most</p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {insuranceTypes.map(i => (
          <motion.button key={i.id} onClick={() => { setSelected(i.id); setProvider(''); }}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition ${selected === i.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-200'}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="text-2xl">{i.emoji}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{i.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ins.emoji}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{ins.label}</h3>
              <p className="text-xs text-gray-500">{ins.desc} • Cover: {ins.cover}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Select Provider</label>
            <select value={provider} onChange={e => setProvider(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
              <option value="">Choose provider</option>
              {(providers[selected] || []).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium">Date of Birth</label>
            <input value={dob} onChange={e => setDob(e.target.value)} type="date"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
          </div>

          <AnimatePresence>
            {success ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100">
                <CheckCircle className="text-green-500" size={24} />
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">Application Submitted!</p>
                  <p className="text-xs text-green-600">Policy documents will be sent to your email.</p>
                </div>
              </motion.div>
            ) : (
              <button onClick={() => { if (provider && name && dob) { setSuccess(true); setTimeout(() => setSuccess(false), 3000); } }}
                disabled={!provider || !name || !dob}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition">
                Get Quote — {ins.premium}
              </button>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">All Plans</h3>
          <div className="space-y-3">
            {insuranceTypes.map(i => (
              <div key={i.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{i.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{i.label}</p>
                    <p className="text-xs text-gray-500">Cover: {i.cover}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary-600">{i.premium}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

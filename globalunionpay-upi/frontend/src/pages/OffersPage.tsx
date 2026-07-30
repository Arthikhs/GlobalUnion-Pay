import { motion } from 'framer-motion';
import { Tag, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const offers = [
  { id: 1, title: '10% Cashback on Recharge', brand: 'Airtel', code: 'AIR10', expiry: '31 Jan 2025', category: 'Recharge', color: 'from-red-400 to-pink-500', emoji: '📱', maxCashback: '₹50' },
  { id: 2, title: 'Flat ₹200 off on Flight Booking', brand: 'IndiGo', code: 'FLY200', expiry: '28 Feb 2025', category: 'Travel', color: 'from-blue-400 to-cyan-500', emoji: '✈️', maxCashback: '₹200' },
  { id: 3, title: '5% off on Gold Purchase', brand: 'GlobalUnion', code: 'GOLD5', expiry: '15 Jan 2025', category: 'Gold', color: 'from-yellow-400 to-orange-500', emoji: '🥇', maxCashback: '₹500' },
  { id: 4, title: 'Zero Processing Fee on Loan', brand: 'GlobalUnion', code: 'LOAN0', expiry: '31 Mar 2025', category: 'Loans', color: 'from-green-400 to-teal-500', emoji: '🏦', maxCashback: 'Fee waiver' },
  { id: 5, title: '₹100 Cashback on Bill Payment', brand: 'BESCOM', code: 'BILL100', expiry: '20 Jan 2025', category: 'Bills', color: 'from-purple-400 to-indigo-500', emoji: '⚡', maxCashback: '₹100' },
  { id: 6, title: 'First SIP Free', brand: 'Axis MF', code: 'SIP1FREE', expiry: '28 Feb 2025', category: 'Mutual Funds', color: 'from-indigo-400 to-purple-500', emoji: '📈', maxCashback: '₹500' },
  { id: 7, title: '15% off Health Insurance', brand: 'Star Health', code: 'HEALTH15', expiry: '31 Jan 2025', category: 'Insurance', color: 'from-rose-400 to-red-500', emoji: '🏥', maxCashback: '₹1,500' },
  { id: 8, title: '₹50 Cashback on Metro Recharge', brand: 'BMTC', code: 'METRO50', expiry: '15 Feb 2025', category: 'Transit', color: 'from-teal-400 to-green-500', emoji: '🚇', maxCashback: '₹50' },
];

const categories = ['All', 'Recharge', 'Travel', 'Gold', 'Loans', 'Bills', 'Mutual Funds', 'Insurance', 'Transit'];

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filtered = activeCategory === 'All' ? offers : offers.filter(o => o.category === activeCategory);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Offers & Deals</h1>
        <p className="text-sm text-gray-500 mt-1">Exclusive offers just for you</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((offer, i) => (
          <motion.div key={offer.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-card border border-gray-100 dark:border-gray-700">
            <div className={`bg-gradient-to-r ${offer.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{offer.emoji}</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{offer.category}</span>
              </div>
              <p className="font-bold mt-2">{offer.title}</p>
              <p className="text-xs text-white/80 mt-0.5">by {offer.brand} • Max: {offer.maxCashback}</p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                  <Tag size={14} className="text-primary-500" />
                  <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">{offer.code}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Expires: {offer.expiry}</p>
              </div>
              <button onClick={() => copyCode(offer.code)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition">
                {copiedCode === offer.code ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copiedCode === offer.code ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

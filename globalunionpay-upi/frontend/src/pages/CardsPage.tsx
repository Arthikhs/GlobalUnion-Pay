import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Eye, EyeOff, Lock, Unlock, Globe, Wifi, Plus, Shield } from 'lucide-react';

const mockCards = [
  {
    id: 1, type: 'VISA', label: 'Debit Card',
    number: '4532 7891 2345 7891', masked: '4532 •••• •••• 7891',
    expiry: '12/27', holder: 'RAHUL SHARMA',
    color: 'from-indigo-600 to-purple-700',
    balance: 45230,
    frozen: false, online: true, international: false,
    dailyUsed: 12000, dailyTotal: 50000,
    monthlyUsed: 45000, monthlyTotal: 200000,
  },
  {
    id: 2, type: 'MASTERCARD', label: 'Credit Card',
    number: '5412 3456 8765 3456', masked: '5412 •••• •••• 3456',
    expiry: '08/26', holder: 'RAHUL SHARMA',
    color: 'from-gray-800 to-gray-900',
    balance: 120000,
    frozen: false, online: true, international: true,
    dailyUsed: 35000, dailyTotal: 100000,
    monthlyUsed: 98000, monthlyTotal: 500000,
  },
  {
    id: 3, type: 'VIRTUAL', label: 'Virtual Card',
    number: '4111 2222 3333 1111', masked: '4111 •••• •••• 1111',
    expiry: '03/25', holder: 'RAHUL SHARMA',
    color: 'from-cyan-500 to-blue-600',
    balance: 5000,
    frozen: false, online: true, international: false,
    dailyUsed: 2000, dailyTotal: 10000,
    monthlyUsed: 4500, monthlyTotal: 25000,
  },
];

export default function CardsPage() {
  const [cards, setCards] = useState(mockCards);
  const [selectedId, setSelectedId] = useState(1);
  const [showNumber, setShowNumber] = useState(false);

  const selectedCard = cards.find(c => c.id === selectedId)!;

  const toggle = (field: 'frozen' | 'online' | 'international') => {
    setCards(cs => cs.map(c => c.id === selectedId ? { ...c, [field]: !c[field] } : c));
    setShowNumber(false);
  };

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setShowNumber(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cards</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your debit, credit & virtual cards</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition">
          <Plus size={16} /> Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Card List */}
        <div className="space-y-4">
          {cards.map(card => (
            <motion.div key={card.id} onClick={() => handleSelect(card.id)}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white cursor-pointer transition-all
                ${selectedId === card.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900' : 'opacity-70 hover:opacity-90'}
                ${card.frozen ? 'grayscale' : ''}`}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/70 text-xs">{card.label}</p>
                  <p className="font-bold text-lg mt-1">{card.type}</p>
                </div>
                <CreditCard size={28} className="text-white/60" />
              </div>
              <p className="font-mono text-sm mt-4 tracking-widest">{card.masked}</p>
              <div className="flex justify-between items-end mt-3">
                <div>
                  <p className="text-white/60 text-xs">EXPIRES</p>
                  <p className="text-sm font-medium">{card.expiry}</p>
                </div>
                {card.frozen && <span className="px-2 py-0.5 bg-red-500/80 rounded-full text-xs font-medium">FROZEN</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Card Details */}
        <div className="lg:col-span-2 space-y-4">

          {/* Details */}
          <motion.div key={`details-${selectedId}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedCard.label} Details</h3>
              <button onClick={() => setShowNumber(v => !v)} className="flex items-center gap-1.5 text-sm text-primary-500">
                {showNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                {showNumber ? 'Hide' : 'Show'} Number
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Card Number', value: showNumber ? selectedCard.number : selectedCard.masked },
                { label: 'Card Holder', value: selectedCard.holder },
                { label: 'Expiry Date', value: selectedCard.expiry },
                { label: 'Available Balance', value: `₹${selectedCard.balance.toLocaleString('en-IN')}` },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1 font-mono text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div key={`controls-${selectedId}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield size={16} className="text-primary-500" /> Card Controls
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: selectedCard.frozen ? 'Unfreeze Card' : 'Freeze Card', icon: selectedCard.frozen ? Unlock : Lock, active: selectedCard.frozen, action: () => toggle('frozen'), activeColor: 'text-red-500' },
                { label: 'Online Payments', icon: Wifi, active: selectedCard.online, action: () => toggle('online'), activeColor: 'text-green-500' },
                { label: 'International', icon: Globe, active: selectedCard.international, action: () => toggle('international'), activeColor: 'text-blue-500' },
              ].map(ctrl => (
                <button key={ctrl.label} onClick={ctrl.action}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition
                    ${ctrl.active ? 'border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800' : 'border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <ctrl.icon size={22} className={ctrl.active ? ctrl.activeColor : 'text-gray-400'} />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{ctrl.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ctrl.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {ctrl.active ? 'ON' : 'OFF'}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Spending Limits */}
          <motion.div key={`limits-${selectedId}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Spending Limits</h3>
            <div className="space-y-4">
              {[
                { label: 'Daily Limit', used: selectedCard.dailyUsed, total: selectedCard.dailyTotal },
                { label: 'Monthly Limit', used: selectedCard.monthlyUsed, total: selectedCard.monthlyTotal },
              ].map(limit => (
                <div key={limit.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 dark:text-gray-400">{limit.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{limit.used.toLocaleString('en-IN')} / ₹{limit.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(limit.used / limit.total) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {((limit.used / limit.total) * 100).toFixed(0)}% used
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

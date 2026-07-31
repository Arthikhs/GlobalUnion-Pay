import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/store';
import { useBankBalance } from '../../hooks/useBankBalance';
import PaymentModal from '../payment/PaymentModal';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, QrCode, Plus, Download } from 'lucide-react';

const services = [
  { label: 'Money Transfer',  path: '/wallet',       emoji: '💸', color: 'bg-blue-50 hover:bg-blue-100' },
  { label: 'Recharge & Bills',path: '/recharge',     emoji: '📱', color: 'bg-cyan-50 hover:bg-cyan-100' },
  { label: 'Loans',           path: '/loans',        emoji: '🏦', color: 'bg-green-50 hover:bg-green-100' },
  { label: 'Gold & Metals',   path: '/gold',         emoji: '🥇', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { label: 'Silver',          path: '/gold',         emoji: '🥈', color: 'bg-gray-50 hover:bg-gray-100' },
  { label: 'Platinum',        path: '/gold',         emoji: '🏅', color: 'bg-sky-50 hover:bg-sky-100' },
  { label: 'Insurance',       path: '/insurance',    emoji: '🛡️', color: 'bg-red-50 hover:bg-red-100' },
  { label: 'Mutual Funds',    path: '/mutual-funds', emoji: '📈', color: 'bg-purple-50 hover:bg-purple-100' },
  { label: 'Travel & Transit',path: '/travel',       emoji: '✈️', color: 'bg-indigo-50 hover:bg-indigo-100' },
  { label: 'Offers',          path: '/offers',       emoji: '🎁', color: 'bg-orange-50 hover:bg-orange-100' },
  { label: 'Rewards',         path: '/rewards',      emoji: '🎉', color: 'bg-pink-50 hover:bg-pink-100' },
];

const quickActions = [
  { icon: Send,     label: 'Send',      action: 'pay',     path: '/wallet' },
  { icon: Download, label: 'Request',   action: 'request', path: '/wallet' },
  { icon: QrCode,   label: 'Scan QR',   action: 'scan',    path: '/qr' },
  { icon: Plus,     label: 'Add Money', action: 'add',     path: '/wallet' },
];

export default function Dashboard() {
  const { user, bankName } = useAuthStore();
  const { balance, accountNumber, raw, refetch } = useBankBalance();
  const balanceLoading = false;
  const [showPayModal, setShowPayModal] = useState(false);
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 space-y-6">

      {/* Balance Card */}
      <motion.div
        className="rounded-2xl p-6 text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm">{greeting},</p>
            <h2 className="text-2xl font-bold mt-1">{bankName || raw?.fullName || user?.fullName} 👋</h2>
            {accountNumber && <p className="text-blue-200 text-xs mt-1">{accountNumber} · Savings</p>}
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <Wallet size={24} />
          </div>
        </div>
        <div className="mt-4">

        </div>
        <div className="flex gap-3 mt-5">
          {quickActions.map((action) => (
            <button key={action.label}
              onClick={() => action.action === 'pay' ? setShowPayModal(true) : navigate(action.path)}
              className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 rounded-xl p-3 transition flex-1">
              <action.icon size={18} />
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Services */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-5 text-lg">Services</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-6 gap-4">
          {services.map((svc, i) => (
            <motion.button key={svc.label} onClick={() => navigate(svc.path)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition cursor-pointer ${svc.color}`}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
              <span className="text-3xl">{svc.emoji}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight">{svc.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {showPayModal && (
        <PaymentModal onClose={() => setShowPayModal(false)} senderUpiId="user@globalunionpay" />
      )}
    </div>
  );
}

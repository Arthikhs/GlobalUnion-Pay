import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { walletApi } from '../../services/api';
import { useAuthStore } from '../../store/store';
import PaymentModal from '../payment/PaymentModal';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, QrCode, Plus, Download } from 'lucide-react';

const services = [
  { label: 'Money Transfer', path: '/wallet', emoji: '💸', color: 'bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50' },
  { label: 'Recharge & Bills', path: '/recharge', emoji: '📱', color: 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50' },
  { label: 'Loans', path: '/loans', emoji: '🏦', color: 'bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50' },
  { label: 'Gold & Metals', path: '/gold', emoji: '🥇', color: 'bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50' },
  { label: 'Silver', path: '/gold', emoji: '🥈', color: 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700' },
  { label: 'Platinum', path: '/gold', emoji: '🏅', color: 'bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50' },
  { label: 'Insurance', path: '/insurance', emoji: '🛡️', color: 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50' },
  { label: 'Mutual Funds', path: '/mutual-funds', emoji: '📈', color: 'bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50' },
  { label: 'Travel & Transit', path: '/travel', emoji: '✈️', color: 'bg-cyan-50 dark:bg-cyan-900/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/50' },
  { label: 'Offers', path: '/offers', emoji: '🎁', color: 'bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50' },
  { label: 'Rewards', path: '/rewards', emoji: '🎉', color: 'bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-900/50' },
];

const quickActions = [
  { icon: Send, label: 'Send', action: 'pay' },
  { icon: Download, label: 'Request', action: 'request' },
  { icon: QrCode, label: 'Scan QR', action: 'scan' },
  { icon: Plus, label: 'Add Money', action: 'add' },
];

export default function Dashboard() {
  const { user, bankName } = useAuthStore();
  const [showPayModal, setShowPayModal] = useState(false);
  const navigate = useNavigate();

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['balance', user?.userId],
    queryFn: () => walletApi.getBalance(user!.userId!),
    enabled: !!user?.userId,
    refetchInterval: 10000,
  });

  const balance = balanceData?.data?.balance ?? 0;

  return (
    <div className="p-6 space-y-6">

      {/* Balance Card */}
      <motion.div
        className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-6 text-white shadow-card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/70 text-sm">Good morning,</p>
            <h2 className="text-2xl font-bold mt-1">{bankName || user?.fullName} 👋</h2>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <Wallet size={24} />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-white/70 text-sm">Total Balance</p>
          <p className="text-4xl font-bold mt-1">
            {balanceLoading
              ? <span className="animate-pulse">Loading...</span>
              : `₹${Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
            }
          </p>
        </div>
        <div className="flex gap-3 mt-5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => action.action === 'pay' && setShowPayModal(true)}
              className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 rounded-xl p-3 transition flex-1"
            >
              <action.icon size={18} />
              <span className="text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Services */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold text-gray-900 dark:text-white mb-5 text-lg">Services</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-6 gap-4">
          {services.map((svc, i) => (
            <motion.button
              key={svc.label}
              onClick={() => navigate(svc.path)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition cursor-pointer ${svc.color}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
            >
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

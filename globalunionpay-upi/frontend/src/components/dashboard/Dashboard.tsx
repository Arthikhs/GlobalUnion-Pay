import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { walletApi, transactionApi } from '../../services/api';
import { useAuthStore } from '../../store/store';
import PaymentModal from '../payment/PaymentModal';
import {
  Send, Download, QrCode, Plus, ArrowUpRight, ArrowDownLeft,
  TrendingUp, Wallet, CreditCard, Bell
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const spendingData = [
  { month: 'Jul', income: 45000, expense: 32000 },
  { month: 'Aug', income: 52000, expense: 38000 },
  { month: 'Sep', income: 48000, expense: 29000 },
  { month: 'Oct', income: 61000, expense: 42000 },
  { month: 'Nov', income: 55000, expense: 35000 },
  { month: 'Dec', income: 67000, expense: 44000 },
];

const categoryData = [
  { name: 'Food', value: 35, color: '#4F46E5' },
  { name: 'Transport', value: 20, color: '#7C3AED' },
  { name: 'Shopping', value: 25, color: '#06B6D4' },
  { name: 'Bills', value: 20, color: '#22C55E' },
];

const quickActions = [
  { icon: Send, label: 'Send Money', color: 'bg-primary-500', action: 'pay' },
  { icon: Download, label: 'Request', color: 'bg-secondary-500', action: 'request' },
  { icon: QrCode, label: 'Scan QR', color: 'bg-accent-500', action: 'scan' },
  { icon: Plus, label: 'Add Money', color: 'bg-success', action: 'add' },
];

export default function Dashboard() {
  const { user, bankName } = useAuthStore();
  const [showPayModal, setShowPayModal] = useState(false);

  const { data: balanceData } = useQuery({
    queryKey: ['balance'],
    queryFn: () => walletApi.getBalance(),
    refetchInterval: 30000,
  });

  const { data: txnData } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionApi.getTransactions(0, 5),
  });

  const balance = balanceData?.data?.balance || 0;
  const transactions = txnData?.data?.content || [];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome + Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <motion.div
          className="lg:col-span-2 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-6 text-white shadow-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-sm">Good morning,</p>
              <h2 className="text-2xl font-bold mt-1">{bankName || user?.fullName} 👋</h2>
              <p className="text-white/70 text-sm mt-1">Here's your financial overview</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <Wallet size={24} />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-white/70 text-sm">Total Balance</p>
            <p className="text-4xl font-bold mt-1">₹{balance.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex gap-3 mt-6">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => action.action === 'pay' && setShowPayModal(true)}
                className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 rounded-xl p-3 transition flex-1"
              >
                <action.icon size={20} />
                <span className="text-xs">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹67,000</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <ArrowDownLeft className="text-green-500" size={20} />
              </div>
            </div>
            <p className="text-green-500 text-xs mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> +12% from last month
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Monthly Spending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹44,000</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <ArrowUpRight className="text-red-500" size={20} />
              </div>
            </div>
            <p className="text-red-500 text-xs mt-2">+5% from last month</p>
          </motion.div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: any) => `₹${v.toLocaleString('en-IN')}`} />
              <Area type="monotone" dataKey="income" stroke="#4F46E5" fill="url(#income)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#EF4444" fill="url(#expense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Spending Categories</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <button className="text-primary-500 text-sm hover:underline">View All</button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CreditCard size={40} className="mx-auto mb-2 opacity-30" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn: any) => (
              <div key={txn.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {txn.type === 'CREDIT'
                      ? <ArrowDownLeft className="text-green-500" size={18} />
                      : <ArrowUpRight className="text-red-500" size={18} />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{txn.description || 'UPI Transfer'}</p>
                    <p className="text-xs text-gray-400">{txn.createdAt}</p>
                  </div>
                </div>
                <span className={`font-semibold ${txn.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
                  {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {showPayModal && (
        <PaymentModal onClose={() => setShowPayModal(false)} senderUpiId="user@globalunionpay" />
      )}
    </div>
  );
};

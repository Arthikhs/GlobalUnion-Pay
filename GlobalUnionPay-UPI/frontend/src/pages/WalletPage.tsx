import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/store';

export default function WalletPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);

  const { data: walletData, isLoading } = useQuery({
    queryKey: ['wallet', user?.userId],
    queryFn: () => api.get(`/wallets/${user?.userId}/balance`).then(r => r.data),
    enabled: !!user?.userId,
    refetchInterval: 30000,
  });

  const addMoneyMutation = useMutation({
    mutationFn: (amount: number) => api.post(`/wallets/${user?.userId}/add-money?amount=${amount}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setShowAddMoney(false);
      setAddAmount('');
    },
  });

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your GlobalUnion Pay wallet</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-indigo-200 text-sm font-medium">Available Balance</p>
        {isLoading ? (
          <div className="h-10 w-40 bg-white/20 rounded-lg animate-pulse mt-2" />
        ) : (
          <p className="text-4xl font-bold mt-1">
            ₹{Number(walletData?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        )}
        <div className="flex items-center justify-between mt-6">
          <div>
            <p className="text-indigo-200 text-xs">Currency</p>
            <p className="font-semibold">INR</p>
          </div>
          <button
            onClick={() => setShowAddMoney(true)}
            className="px-5 py-2.5 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow">
            + Add Money
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Added', value: '₹0', icon: '↓', color: 'text-green-600' },
          { label: 'Total Spent', value: '₹0', icon: '↑', color: 'text-red-500' },
          { label: 'Cashback', value: '₹0', icon: '★', color: 'text-yellow-500' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Add Money to Wallet</h2>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              {quickAmounts.map(amt => (
                <button key={amt} onClick={() => setAddAmount(String(amt))}
                  className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                    addAmount === String(amt)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}>
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddMoney(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => addMoneyMutation.mutate(Number(addAmount))}
                disabled={!addAmount || Number(addAmount) <= 0 || addMoneyMutation.isPending}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {addMoneyMutation.isPending ? 'Processing...' : `Add ₹${addAmount || '0'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

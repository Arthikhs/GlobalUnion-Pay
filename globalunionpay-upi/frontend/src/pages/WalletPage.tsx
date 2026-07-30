import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, walletApi } from '../services/api';
import { useAuthStore } from '../store/store';
import { Smartphone, Building2, User, Wallet, X, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface FoundUser { fullName: string; phone: string; upiId?: string; userId?: string; }

export default function WalletPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [addAmount, setAddAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);

  const { data: walletData, isLoading } = useQuery({
    queryKey: ['wallet', user?.userId],
    queryFn: () => walletApi.getBalance(user!.userId!).then(r => r.data),
    enabled: !!user?.userId,
    refetchInterval: 10000,
  });

  const addMoneyMutation = useMutation({
    mutationFn: (amount: number) => walletApi.addMoney(user!.userId!, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      setShowAddMoney(false);
      setAddAmount('');
      toast.success('Money added successfully!');
    },
  });

  const quickAmounts = [500, 1000, 2000, 5000];

  const [transferModal, setTransferModal] = useState<string | null>(null);
  const [transferInput, setTransferInput] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [step, setStep] = useState(1);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  const transferOptions = [
    { id: 'mobile',    icon: Smartphone, label: 'Mobile Number',  desc: 'Send to any mobile number',    color: 'bg-blue-50 text-blue-600',     border: 'border-blue-100' },
    { id: 'bank',      icon: Building2,  label: 'Bank Account',   desc: 'Transfer to bank account',     color: 'bg-green-50 text-green-600',   border: 'border-green-100' },
    { id: 'self',      icon: User,       label: 'Self Account',   desc: 'Transfer to your own account', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { id: 'globalupi', icon: Wallet,     label: 'GlobalUPI',      desc: 'Pay via GlobalUPI ID / VPA',   color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
  ];

  const placeholders: Record<string, string> = {
    mobile:    'Enter 10-digit mobile number',
    bank:      'Enter account number',
    self:      'Enter your account number',
    globalupi: 'Enter UPI ID (e.g. name@gupay)',
  };

  async function handleSearch() {
    if (!transferInput) return;
    setSearching(true);
    setSearchError('');
    setFoundUser(null);
    try {
      const res = await api.get(`/api/v1/users/phone/${transferInput}`);
      const u = res.data?.data;
      if (u && u.phoneNumber !== user?.phone) {
        setFoundUser({ fullName: `${u.firstName} ${u.lastName}`, phone: u.phoneNumber, userId: u.userId });
      } else if (u?.phoneNumber === user?.phone) {
        setSearchError('You cannot send money to yourself.');
      } else {
        setSearchError('No registered user found with this mobile number.');
      }
    } catch {
      setSearchError('No registered user found with this mobile number.');
    } finally {
      setSearching(false);
    }
  }

  const payMutation = useMutation({
    mutationFn: (data: { receiverPhone: string; amount: number; type: string }) =>
      walletApi.transfer(user!.userId!, data.receiverPhone, data.amount),
    onSuccess: (res) => {
      const result = res.data;
      if (!result.success) {
        toast.error(result.message || 'Transfer failed.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      setPaySuccess(true);
    },
    onError: () => toast.error('Transfer failed. Please try again.'),
  });

  function handlePay() {
    if (!transferAmount || Number(transferAmount) <= 0) return;
    payMutation.mutate({
      receiverPhone: transferInput,
      amount: Number(transferAmount),
      type: transferModal || 'mobile',
    });
  }

  function handleTransferClose() {
    setTransferModal(null);
    setTransferInput('');
    setTransferAmount('');
    setStep(1);
    setFoundUser(null);
    setSearchError('');
    setPaySuccess(false);
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your GlobalUnion Pay wallet</p>
      </div>

      {/* Transfer Options */}
      <div className="grid grid-cols-4 gap-3">
        {transferOptions.map(opt => (
          <button key={opt.id} onClick={() => { setTransferModal(opt.id); setStep(1); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${opt.border} ${opt.color.split(' ')[0]} hover:shadow-md transition-all`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${opt.color}`}>
              <opt.icon size={22} />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{opt.label}</span>
          </button>
        ))}
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

      {/* Transfer Modal */}
      {transferModal && (() => {
        const opt = transferOptions.find(o => o.id === transferModal)!;
        return (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${opt.color}`}>
                    <opt.icon size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{opt.label}</h2>
                </div>
                <button onClick={handleTransferClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>

              {/* Success Screen */}
              {paySuccess ? (
                <div className="flex flex-col items-center py-6 gap-3">
                  <CheckCircle2 size={56} className="text-green-500" />
                  <p className="text-xl font-bold text-gray-900">₹{transferAmount} Sent!</p>
                  <p className="text-sm text-gray-500">To {foundUser?.fullName} · {transferInput}</p>
                  <button onClick={handleTransferClose}
                    className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700">
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Step bar */}
                  <div className="flex gap-2 mb-5">
                    {[1, 2].map(s => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step >= s ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                    ))}
                  </div>

                  {/* Step 1 — Search */}
                  {step === 1 && (
                    <>
                      <p className="text-sm text-gray-500 mb-3">{opt.desc}</p>
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          type={opt.id === 'mobile' ? 'tel' : 'text'}
                          placeholder={placeholders[opt.id]}
                          value={transferInput}
                          maxLength={opt.id === 'mobile' ? 10 : undefined}
                          onChange={e => { setTransferInput(e.target.value); setFoundUser(null); setSearchError(''); }}
                          onKeyDown={e => e.key === 'Enter' && handleSearch()}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <button onClick={handleSearch} disabled={searching || transferInput.length < 10}
                          className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition">
                          {searching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search size={18} />}
                        </button>
                      </div>

                      {/* Error */}
                      {searchError && <p className="text-xs text-red-500 mt-2">{searchError}</p>}

                      {/* Found User Card */}
                      {foundUser && (
                        <div className="mt-4 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {foundUser.fullName?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{foundUser.fullName}</p>
                            <p className="text-xs text-gray-500">{foundUser.phone}</p>
                            {foundUser.upiId && <p className="text-xs text-indigo-500">{foundUser.upiId}</p>}
                          </div>
                          <CheckCircle2 size={20} className="text-green-500" />
                        </div>
                      )}

                      <button
                        onClick={() => setStep(2)}
                        disabled={!foundUser}
                        className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center gap-2">
                        Next <ArrowRight size={16} />
                      </button>
                    </>
                  )}

                  {/* Step 2 — Amount */}
                  {step === 2 && (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {foundUser?.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{foundUser?.fullName}</p>
                          <p className="text-xs text-gray-500">{transferInput}</p>
                        </div>
                      </div>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
                        <input
                          autoFocus
                          type="number"
                          placeholder="Enter amount"
                          value={transferAmount}
                          onChange={e => setTransferAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {[100, 500, 1000, 2000].map(amt => (
                          <button key={amt} onClick={() => setTransferAmount(String(amt))}
                            className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                              transferAmount === String(amt) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}>₹{amt}</button>
                        ))}
                      </div>

                      {/* Balance check */}
                      <div className="mt-3 text-xs text-gray-400 text-right">
                        Balance: ₹{Number(walletData?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>

                      <div className="flex gap-3 mt-4">
                        <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Back</button>
                        <button
                          onClick={handlePay}
                          disabled={!transferAmount || Number(transferAmount) <= 0 || payMutation.isPending}
                          className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50">
                          {payMutation.isPending ? 'Sending...' : `Pay ₹${transferAmount || '0'}`}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })()}

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

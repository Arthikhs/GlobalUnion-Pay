import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/store';

export default function MerchantPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm] = useState({
    businessName: '', businessType: '', businessCategory: '',
    gstin: '', supportEmail: '', supportPhone: '',
    bankAccountNumber: '', bankIfscCode: '', bankAccountName: '',
  });

  const { data: merchant, isLoading } = useQuery({
    queryKey: ['merchant', user?.userId],
    queryFn: () => api.get(`/merchants/user/${user?.userId}`).then(r => r.data.data),
    enabled: !!user?.userId,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => api.post('/merchants/register', { ...data, userId: user?.userId }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['merchant'] }); setShowRegister(false); },
  });

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACTIVE: 'bg-green-100 text-green-700',
    SUSPENDED: 'bg-red-100 text-red-700',
  };

  if (isLoading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchant Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your business payments</p>
        </div>
        {!merchant && (
          <button onClick={() => setShowRegister(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            Register as Merchant
          </button>
        )}
      </div>

      {merchant ? (
        <>
          {/* Merchant Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{merchant.businessName}</h2>
                <p className="text-indigo-200 text-sm mt-1">{merchant.businessCategory}</p>
                <p className="font-mono text-sm mt-2 bg-white/10 px-3 py-1 rounded-lg inline-block">
                  {merchant.merchantUpiId}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[merchant.status]}`}>
                {merchant.status}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Revenue', value: `₹${Number(merchant.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'text-green-600' },
              { label: 'Pending Settlement', value: `₹${Number(merchant.pendingSettlement || 0).toLocaleString('en-IN')}`, color: 'text-yellow-600' },
              { label: 'Settled Amount', value: `₹${Number(merchant.settledAmount || 0).toLocaleString('en-IN')}`, color: 'text-indigo-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Download QR', icon: '▦' },
                { label: 'View Orders', icon: '📋' },
                { label: 'Settlements', icon: '💰' },
                { label: 'Refunds', icon: '↺' },
              ].map(action => (
                <button key={action.label}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-4xl mb-3">🏪</p>
          <p className="text-gray-700 font-semibold">No Merchant Account</p>
          <p className="text-sm text-gray-400 mt-1">Register your business to accept payments</p>
          <button onClick={() => setShowRegister(true)}
            className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            Get Started
          </button>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Register Merchant Account</h2>
            <div className="space-y-3">
              {[
                { key: 'businessName', label: 'Business Name', placeholder: 'My Store' },
                { key: 'businessType', label: 'Business Type', placeholder: 'Retail / Service' },
                { key: 'businessCategory', label: 'Category', placeholder: 'Food / Electronics' },
                { key: 'gstin', label: 'GSTIN (optional)', placeholder: '22AAAAA0000A1Z5' },
                { key: 'supportEmail', label: 'Support Email', placeholder: 'support@mybusiness.com' },
                { key: 'supportPhone', label: 'Support Phone', placeholder: '9876543210' },
                { key: 'bankAccountNumber', label: 'Bank Account Number', placeholder: '1234567890' },
                { key: 'bankIfscCode', label: 'IFSC Code', placeholder: 'SBIN0001234' },
                { key: 'bankAccountName', label: 'Account Holder Name', placeholder: 'My Store Pvt Ltd' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs text-gray-500 font-medium">{field.label}</label>
                  <input value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowRegister(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => registerMutation.mutate(form)}
                disabled={!form.businessName || registerMutation.isPending}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {registerMutation.isPending ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

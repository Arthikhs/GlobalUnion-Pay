import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/store';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'profile' | 'kyc' | 'security'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', occupation: '', city: '', state: '' });
  const [kyc, setKyc] = useState({ panNumber: '', aadhaarNumber: '' });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.userId],
    queryFn: () => api.get(`/users/${user?.userId}`).then(r => r.data.data),
    enabled: !!user?.userId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put(`/users/${user?.userId}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile'] }); setEditMode(false); },
  });

  const kycMutation = useMutation({
    mutationFn: (data: any) => api.post(`/users/${user?.userId}/kyc`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const kycStatusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    VERIFIED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'kyc', label: 'KYC' },
    { id: 'security', label: 'Security' },
  ] as const;

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white flex items-center gap-5">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
          {profile?.firstName?.[0]}{profile?.lastName?.[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile?.firstName} {profile?.lastName}</h2>
          <p className="text-indigo-200 text-sm">{profile?.email}</p>
          <p className="text-indigo-200 text-sm">{profile?.phoneNumber}</p>
          <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${kycStatusColor[profile?.kycStatus] || 'bg-gray-100 text-gray-600'}`}>
            KYC: {profile?.kycStatus || 'PENDING'}
          </span>
        </div>
        <div className="ml-auto text-right">
          <p className="text-indigo-200 text-xs">Referral Code</p>
          <p className="font-mono font-bold text-lg">{profile?.referralCode}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
            <button onClick={() => setEditMode(!editMode)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'First Name', key: 'firstName' },
              { label: 'Last Name', key: 'lastName' },
              { label: 'Occupation', key: 'occupation' },
              { label: 'City', key: 'city' },
              { label: 'State', key: 'state' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-gray-500 font-medium">{field.label}</label>
                {editMode ? (
                  <input value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{(profile as any)?.[field.key] || '—'}</p>
                )}
              </div>
            ))}
          </div>
          {editMode && (
            <button onClick={() => updateMutation.mutate(form)}
              disabled={updateMutation.isPending}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">KYC Verification</h3>
          {profile?.kycStatus === 'VERIFIED' ? (
            <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
              <p className="text-green-700 font-semibold">✓ KYC Verified</p>
              <p className="text-sm text-green-600 mt-1">Your identity has been verified successfully</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">PAN Number</label>
                <input value={kyc.panNumber}
                  onChange={e => setKyc(k => ({ ...k, panNumber: e.target.value.toUpperCase() }))}
                  placeholder="ABCDE1234F"
                  className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Aadhaar Number</label>
                <input value={kyc.aadhaarNumber}
                  onChange={e => setKyc(k => ({ ...k, aadhaarNumber: e.target.value }))}
                  placeholder="1234 5678 9012"
                  className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <button onClick={() => kycMutation.mutate(kyc)}
                disabled={!kyc.panNumber || !kyc.aadhaarNumber || kycMutation.isPending}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {kycMutation.isPending ? 'Submitting...' : 'Submit KYC'}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
          <h3 className="font-semibold text-gray-900">Security Settings</h3>
          {[
            { label: 'Change Password', desc: 'Update your account password', icon: '🔑' },
            { label: 'Change UPI PIN', desc: 'Update your 6-digit UPI PIN', icon: '🔐' },
            { label: 'Active Sessions', desc: 'View and manage active sessions', icon: '💻' },
            { label: 'Two-Factor Auth', desc: 'Enable 2FA for extra security', icon: '🛡️' },
          ].map(item => (
            <div key={item.label}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

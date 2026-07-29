import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/store';

export default function UpiPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newUpiHandle, setNewUpiHandle] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [validateUpi, setValidateUpi] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);

  const { data: upiIds, isLoading } = useQuery({
    queryKey: ['upiIds', user?.userId],
    queryFn: () => api.get(`/upi/ids/${user?.userId}`).then((r: any) => r.data.data),
    enabled: !!user?.userId,
  });

  const createMutation = useMutation({
    mutationFn: (handle: string) => api.post('/upi/create', { userId: user?.userId, upiHandle: handle }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['upiIds'] }); setShowCreate(false); setNewUpiHandle(''); },
  });

  const validateMutation = useMutation({
    mutationFn: (upiId: string) => api.post('/upi/validate', { upiId }),
    onSuccess: (res) => setValidationResult(res.data.data),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UPI Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your UPI IDs and QR codes</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          + Create UPI ID
        </button>
      </div>

      {/* UPI IDs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          [1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)
        ) : upiIds?.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
            No UPI IDs yet. Create your first one!
          </div>
        ) : upiIds?.map((upi: any) => (
          <div key={upi.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{upi.upiId}</span>
                  {upi.isPrimary && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">Primary</span>
                  )}
                </div>
                <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  upi.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>{upi.status}</span>
              </div>
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                ▦
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Download QR
              </button>
              <button className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Share
              </button>
              <button className="flex-1 py-1.5 text-xs border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Validate UPI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Validate UPI ID</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter UPI ID (e.g. user@gupay)"
            value={validateUpi}
            onChange={e => setValidateUpi(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={() => validateMutation.mutate(validateUpi)}
            disabled={!validateUpi || validateMutation.isPending}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {validateMutation.isPending ? 'Checking...' : 'Validate'}
          </button>
        </div>
        {validationResult && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
              {validationResult.name?.[0]}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{validationResult.name}</p>
              <p className="text-sm text-gray-500">{validationResult.upiId} · {validationResult.bankName}</p>
            </div>
            <span className="ml-auto px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">✓ Verified</span>
          </div>
        )}
      </div>

      {/* Create UPI Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create New UPI ID</h2>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="yourname"
                value={newUpiHandle}
                onChange={e => setNewUpiHandle(e.target.value.toLowerCase().replace(/[^a-z0-9.]/g, ''))}
                className="flex-1 px-4 py-3 text-sm focus:outline-none"
              />
              <span className="px-4 py-3 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">@gupay</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Your UPI ID will be: {newUpiHandle || 'yourname'}@gupay</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={() => createMutation.mutate(newUpiHandle)}
                disabled={!newUpiHandle || createMutation.isPending}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

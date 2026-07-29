import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { api } from '../services/api';
import { useAuthStore } from '../store/store';

const COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444'];

export default function AnalyticsPage() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => api.get('/analytics/dashboard').then(r => r.data.data),
  });

  const { data: userStats } = useQuery({
    queryKey: ['analytics-user', user?.userId],
    queryFn: () => api.get(`/analytics/user/${user?.userId}`).then(r => r.data.data),
    enabled: !!user?.userId,
  });

  const { data: txnStats } = useQuery({
    queryKey: ['txn-stats', user?.userId],
    queryFn: () => api.get(`/transactions/${user?.userId}/stats`).then(r => r.data.data),
    enabled: !!user?.userId,
  });

  const dailyData = stats?.dailyPaymentStats?.map((row: any[]) => ({
    date: row[0],
    count: Number(row[1]),
    amount: Number(row[2]),
  })) || [];

  const categoryData = Object.entries(txnStats?.spendingByCategory || {}).map(([name, val]: any) => ({
    name,
    value: Number(val),
  }));

  const summaryCards = [
    { label: 'Total Payments (30d)', value: stats?.totalPayments30d || 0, suffix: '', color: 'text-indigo-600' },
    { label: 'Total Revenue (30d)', value: `₹${Number(stats?.totalRevenue30d || 0).toLocaleString('en-IN')}`, suffix: '', color: 'text-green-600' },
    { label: 'New Users (7d)', value: stats?.newUsers7d || 0, suffix: '', color: 'text-purple-600' },
    { label: 'Failed Payments (30d)', value: stats?.failedPayments30d || 0, suffix: '', color: 'text-red-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Payment insights and spending analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium mb-1">Monthly Spent</p>
          <p className="text-xl font-bold text-red-500">
            ₹{Number(txnStats?.totalSpent || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium mb-1">Monthly Received</p>
          <p className="text-xl font-bold text-green-600">
            ₹{Number(txnStats?.totalReceived || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Daily Payment Trend */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Daily Payment Volume (30 days)</h2>
        {dailyData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Amount']} />
              <Area type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2}
                fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Spending by Category */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Spending by Category</h2>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {categoryData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString('en-IN')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Transaction Count (30 days)</h2>
          {dailyData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Ban, Activity, Eye, MapPin, Smartphone, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const riskData = [
  { day: 'Mon', low: 45, medium: 12, high: 3 },
  { day: 'Tue', low: 52, medium: 8, high: 1 },
  { day: 'Wed', low: 38, medium: 15, high: 5 },
  { day: 'Thu', low: 61, medium: 10, high: 2 },
  { day: 'Fri', low: 55, medium: 18, high: 4 },
  { day: 'Sat', low: 42, medium: 9, high: 1 },
  { day: 'Sun', low: 30, medium: 6, high: 0 },
];

const velocityData = [
  { time: '00:00', txns: 5 }, { time: '04:00', txns: 2 }, { time: '08:00', txns: 18 },
  { time: '12:00', txns: 35 }, { time: '16:00', txns: 28 }, { time: '20:00', txns: 22 }, { time: '23:00', txns: 8 },
];

const alerts = [
  { id: 1, type: 'HIGH', title: 'Multiple failed PIN attempts', desc: 'User attempted PIN 5 times in 2 minutes', time: '2 min ago', user: 'user_8821', icon: AlertTriangle, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  { id: 2, type: 'MEDIUM', title: 'Unusual location detected', desc: 'Login from new device in Mumbai', time: '15 min ago', user: 'user_4432', icon: MapPin, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 3, type: 'MEDIUM', title: 'High velocity transactions', desc: '8 transactions in 10 minutes', time: '1 hr ago', user: 'user_2291', icon: Activity, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 4, type: 'LOW', title: 'New device login', desc: 'Login from Chrome on Windows', time: '3 hr ago', user: 'user_5512', icon: Smartphone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
];

const blockedUsers = [
  { id: 'user_9921', reason: 'Fraudulent activity', date: '10 Dec 2024', risk: 95 },
  { id: 'user_3341', reason: 'Multiple chargebacks', date: '08 Dec 2024', risk: 88 },
  { id: 'user_7712', reason: 'Suspicious pattern', date: '05 Dec 2024', risk: 76 },
];

export default function FraudPage() {
  const stats = [
    { label: 'Risk Score (Avg)', value: '12/100', icon: Shield, color: 'text-green-500 bg-green-50 dark:bg-green-900/20', trend: 'Low Risk' },
    { label: 'Alerts Today', value: '7', icon: AlertTriangle, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20', trend: '+2 from yesterday' },
    { label: 'Blocked Users', value: '3', icon: Ban, color: 'text-red-500 bg-red-50 dark:bg-red-900/20', trend: 'Active blocks' },
    { label: 'Transactions Monitored', value: '1,284', icon: Eye, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', trend: 'Last 24 hours' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
          <Shield className="text-red-500" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fraud Detection</h1>
          <p className="text-sm text-gray-500">AI-powered risk monitoring & security</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-500" /> Risk Distribution (7 days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="low" fill="#22C55E" radius={[2, 2, 0, 0]} name="Low Risk" />
              <Bar dataKey="medium" fill="#F59E0B" radius={[2, 2, 0, 0]} name="Medium Risk" />
              <Bar dataKey="high" fill="#EF4444" radius={[2, 2, 0, 0]} name="High Risk" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity size={16} className="text-primary-500" /> Transaction Velocity (24h)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="txns" stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Fraud Alerts</h3>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <div className={`w-10 h-10 ${alert.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <alert.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{alert.title}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    alert.type === 'HIGH' ? 'bg-red-100 text-red-700' :
                    alert.type === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>{alert.type}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{alert.desc}</p>
                <p className="text-xs text-gray-400 mt-1">User: {alert.user} • {alert.time}</p>
              </div>
              <button className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition dark:text-gray-300">
                Investigate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked Users */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Ban size={16} className="text-red-500" /> Blocked Users
        </h3>
        <div className="space-y-3">
          {blockedUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
              <div>
                <p className="font-mono font-medium text-gray-900 dark:text-white text-sm">{u.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">{u.reason} • {u.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Risk Score</p>
                  <p className="font-bold text-red-500">{u.risk}/100</p>
                </div>
                <button className="px-3 py-1.5 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 transition dark:text-gray-300">
                  Unblock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

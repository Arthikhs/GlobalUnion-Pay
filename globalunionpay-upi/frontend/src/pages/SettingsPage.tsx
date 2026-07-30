import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Shield, Lock, Smartphone, Trash2, Download, Globe, Eye } from 'lucide-react';

const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
    <motion.div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
      animate={{ left: value ? '22px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
  </button>
);

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: false, emailNotif: true, smsNotif: true, pushNotif: true,
    paymentAlerts: true, fraudAlerts: true, promoNotif: false,
    biometric: false, twoFactor: false, sessionTimeout: true,
    dataSharing: false, analytics: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(s => ({ ...s, [key]: !s[key] }));

  const sections = [
    {
      title: 'Appearance', icon: Sun, items: [
        { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme', icon: settings.darkMode ? Moon : Sun },
      ]
    },
    {
      title: 'Notifications', icon: Bell, items: [
        { key: 'emailNotif', label: 'Email Notifications', desc: 'Receive updates via email', icon: Bell },
        { key: 'smsNotif', label: 'SMS Notifications', desc: 'Receive SMS alerts', icon: Smartphone },
        { key: 'pushNotif', label: 'Push Notifications', desc: 'Browser push notifications', icon: Bell },
        { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Alerts for every transaction', icon: Bell },
        { key: 'fraudAlerts', label: 'Fraud Alerts', desc: 'Security and fraud warnings', icon: Shield },
        { key: 'promoNotif', label: 'Promotional Offers', desc: 'Cashback and offer alerts', icon: Bell },
      ]
    },
    {
      title: 'Security', icon: Shield, items: [
        { key: 'biometric', label: 'Biometric Login', desc: 'Use fingerprint or face ID', icon: Eye },
        { key: 'twoFactor', label: 'Two-Factor Auth', desc: 'Extra layer of security', icon: Shield },
        { key: 'sessionTimeout', label: 'Auto Session Timeout', desc: 'Logout after 30 min inactivity', icon: Lock },
      ]
    },
    {
      title: 'Privacy', icon: Eye, items: [
        { key: 'dataSharing', label: 'Data Sharing', desc: 'Share anonymized data for improvements', icon: Globe },
        { key: 'analytics', label: 'Usage Analytics', desc: 'Help improve the app', icon: Eye },
      ]
    },
  ];

  return (
    <div className="p-6 space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your preferences and account settings</p>
      </div>

      {sections.map((section, si) => (
        <motion.div key={section.title} className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
            <section.icon size={16} className="text-primary-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">{section.title}</h3>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {section.items.map(item => (
              <div key={item.key} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <item.icon size={14} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <Toggle value={settings[item.key as keyof typeof settings]} onChange={() => toggle(item.key as keyof typeof settings)} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Language */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe size={16} className="text-primary-500" /> Language & Region
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 font-medium">Language</label>
            <select className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
              <option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">Currency</label>
            <select className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white">
              <option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-red-100 dark:border-red-900/30 p-6">
        <h3 className="font-semibold text-red-500 mb-4 flex items-center gap-2">
          <Trash2 size={16} /> Danger Zone
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center gap-3">
              <Download size={16} className="text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Export My Data</p>
                <p className="text-xs text-gray-400">Download all your account data</p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 border border-red-100 dark:border-red-900/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition">
            <div className="flex items-center gap-3">
              <Trash2 size={16} className="text-red-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-500">Delete Account</p>
                <p className="text-xs text-gray-400">Permanently delete your account</p>
              </div>
            </div>
            <span className="text-red-400">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

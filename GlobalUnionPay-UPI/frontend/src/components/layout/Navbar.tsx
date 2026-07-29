import React, { useState } from 'react';
import { useAuthStore } from '../../store/store';
import { Bell, Search, Sun, Moon, Settings, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  darkMode: boolean;
  toggleDark: () => void;
}

export default function Navbar({ darkMode, toggleDark }: Props) {
  const { user, logout } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            placeholder="Search transactions, contacts..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Dark Mode */}
        <button
          onClick={toggleDark}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
        >
          {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-500" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition relative"
          >
            <Bell size={18} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 z-50"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Notifications</h4>
                {[
                  { title: '₹500 received from Rahul', time: '2 min ago', type: 'success' },
                  { title: 'New offer: 10% cashback on recharge', time: '1 hr ago', type: 'info' },
                  { title: 'Security alert: New login detected', time: '3 hr ago', type: 'warning' },
                ].map((n, i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      n.type === 'success' ? 'bg-green-500' : n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-gray-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.fullName?.[0] || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">{user?.fullName}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              >
                <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                  <p className="font-semibold">{user?.fullName}</p>
                  <p className="text-xs text-white/70">{user?.phone}</p>
                </div>
                {[
                  { icon: User, label: 'My Account', path: '/profile' },
                  { icon: Shield, label: 'Security', path: '/security' },
                  { icon: Settings, label: 'Settings', path: '/settings' },
                ].map((item) => (
                  <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm text-red-500 border-t border-gray-100 dark:border-gray-700"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

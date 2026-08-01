import React, { useState } from 'react';
import { useAuthStore } from '../../store/store';
import { useNotifStore } from '../../store/store';
import { Bell, Search, Sun, Moon, Settings, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Props { darkMode: boolean; toggleDark: () => void; }

const BLUE = 'linear-gradient(135deg, #1D4ED8, #0EA5E9)';

export default function Navbar({ darkMode, toggleDark }: Props) {
  const { user, logout } = useAuthStore();
  const { notifications, markAllRead, clearAll } = useNotifStore();
  const unread = notifications.filter(n => !n.read).length;
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif]     = useState(false);
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-6 gap-4 sticky top-0 z-40 shadow-sm">

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
          <input
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:text-white transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">

        {/* Dark Mode */}
        <button onClick={toggleDark}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition">
          {darkMode
            ? <Sun size={18} className="text-yellow-400" />
            : <Moon size={18} className="text-gray-500" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); if (!showNotif) markAllRead(); }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition relative">
            <Bell size={18} className="text-gray-500" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[9px] flex items-center justify-center font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 z-50"
                initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900 dark:text-white">Notifications</h4>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-600">Clear all</button>
                    )}
                    {unread > 0 && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">{unread} new</span>}
                  </div>
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bell size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`flex gap-3 py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0 ${!n.read ? 'bg-blue-50/50 -mx-2 px-2 rounded-xl' : ''}`}>
                      <span className="text-lg">{n.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative ml-1">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: BLUE }}>
              {user?.fullName?.[0] || 'U'}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:block">{user?.fullName}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                className="absolute right-0 top-12 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
              >
                <div className="p-4 text-white" style={{ background: BLUE }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                      {user?.fullName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{user?.fullName}</p>
                      <p className="text-xs text-white/70">{user?.phone}</p>
                    </div>
                  </div>
                </div>
                {[
                  { icon: User,     label: 'My Profile', path: '/profile'  },
                  { icon: Shield,   label: 'Security',   path: '/settings' },
                  { icon: Settings, label: 'Settings',   path: '/settings' },
                ].map((item) => (
                  <button key={item.label}
                    onClick={() => { navigate(item.path); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">
                    <item.icon size={16} className="text-blue-500" />
                    {item.label}
                  </button>
                ))}
                <button onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm text-red-500 border-t border-gray-100 dark:border-gray-700">
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
}

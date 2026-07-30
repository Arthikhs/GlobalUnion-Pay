import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/store';
import {
  LayoutDashboard, Send, Smartphone, Banknote, Coins,
  Shield, TrendingUp, Plane, Tag, Gift, LogOut,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',        path: '/dashboard',    emoji: '🏠' },
  { icon: Send,            label: 'Money Transfer',   path: '/wallet',       emoji: '💸' },
  { icon: Smartphone,      label: 'Recharge & Bills', path: '/recharge',     emoji: '📱' },
  { icon: Banknote,        label: 'Loans',            path: '/loans',        emoji: '🏦' },
  { icon: Coins,           label: 'Gold & Metals',    path: '/gold',         emoji: '🥇' },
  { icon: Shield,          label: 'Insurance',        path: '/insurance',    emoji: '🛡️' },
  { icon: TrendingUp,      label: 'Mutual Funds',     path: '/mutual-funds', emoji: '📈' },
  { icon: Plane,           label: 'Travel & Transit', path: '/travel',       emoji: '✈️' },
  { icon: Tag,             label: 'Offers',           path: '/offers',       emoji: '🎁' },
  { icon: Gift,            label: 'Rewards',          path: '/rewards',      emoji: '🎉' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <motion.aside
      className="h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col shadow-sm"
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">GU</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">GlobalUnion Pay</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition ml-auto"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                whileHover={{ x: 2 }}
              >
                {collapsed
                  ? <span className="text-lg">{item.emoji}</span>
                  : <item.icon size={18} className={isActive ? 'text-primary-500' : ''} />
                }
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && !collapsed && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.fullName?.[0] || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.phone}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} className="p-1 hover:text-red-500 transition">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

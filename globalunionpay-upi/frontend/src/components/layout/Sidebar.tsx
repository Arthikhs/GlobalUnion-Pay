import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/store';
import {
  LayoutDashboard, Send, Smartphone, Banknote, Coins,
  Shield, TrendingUp, Plane, Tag, Gift, LogOut,
  ChevronLeft, ChevronRight, Settings, User
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',        path: '/dashboard'    },
  { icon: Send,            label: 'Money Transfer',   path: '/wallet'       },
  { icon: Smartphone,      label: 'Recharge & Bills', path: '/recharge'     },
  { icon: Banknote,        label: 'Loans',            path: '/loans'        },
  { icon: Coins,           label: 'Gold & Metals',    path: '/gold'         },
  { icon: Shield,          label: 'Insurance',        path: '/insurance'    },
  { icon: TrendingUp,      label: 'Mutual Funds',     path: '/mutual-funds' },
  { icon: Plane,           label: 'Travel & Transit', path: '/travel'       },
  { icon: Tag,             label: 'Offers',           path: '/offers'       },
  { icon: Gift,            label: 'Rewards',          path: '/rewards'      },
];

const bottomItems = [
  { icon: User,     label: 'Profile',  path: '/profile'  },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const BLUE = 'linear-gradient(135deg, #1D4ED8, #0EA5E9)';
const ACTIVE_BG = 'linear-gradient(135deg, rgba(29,78,216,0.45), rgba(14,165,233,0.2))';
const ACTIVE_GLOW = '0 0 20px rgba(29,78,216,0.4)';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <motion.aside
      className="h-screen flex flex-col shadow-2xl flex-shrink-0"
      style={{ background: 'linear-gradient(180deg, #020817 0%, #0A1628 55%, #020817 100%)' }}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: BLUE }}>
                <span className="text-white font-black text-sm">GU</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">GlobalUnion</p>
                <p className="text-blue-400 text-xs font-medium">Pay</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto"
            style={{ background: BLUE }}>
            <span className="text-white font-black text-sm">GU</span>
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition ml-auto">
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition">
          <ChevronRight size={16} />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {!collapsed && (
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Menu</p>
        )}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 3 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer relative ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/8'
                }`}
                style={isActive ? { background: ACTIVE_BG, boxShadow: ACTIVE_GLOW } : {}}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: BLUE }}
                  />
                )}
                <item.icon size={18} className={isActive ? 'text-blue-300' : ''} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}

        {!collapsed && (
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mt-5 mb-3">Account</p>
        )}
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div whileHover={{ x: collapsed ? 0 : 3 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/8'
                }`}
                style={isActive ? { background: ACTIVE_BG } : {}}>
                <item.icon size={18} className={isActive ? 'text-blue-300' : ''} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/8 transition cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: BLUE }}>
            {user?.fullName?.[0] || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-xs text-white/40 truncate">{user?.phone}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={logout} className="p-1 text-white/30 hover:text-red-400 transition">
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

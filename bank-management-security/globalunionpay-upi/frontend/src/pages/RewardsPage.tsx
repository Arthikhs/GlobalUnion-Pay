import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star, Zap, Trophy, Tag, ChevronRight } from 'lucide-react';

const offers = [
  { id: 1, title: '10% Cashback on Recharge', brand: 'Airtel', expiry: '31 Dec 2024', color: 'from-red-500 to-orange-500', emoji: '📱' },
  { id: 2, title: '₹50 off on Food Orders', brand: 'Swiggy', expiry: '25 Dec 2024', color: 'from-orange-500 to-yellow-500', emoji: '🍔' },
  { id: 3, title: '5% Cashback on Electricity', brand: 'BESCOM', expiry: '31 Jan 2025', color: 'from-yellow-500 to-green-500', emoji: '⚡' },
  { id: 4, title: '₹100 off on Movie Tickets', brand: 'BookMyShow', expiry: '20 Dec 2024', color: 'from-purple-500 to-pink-500', emoji: '🎬' },
];

const rewardHistory = [
  { id: 1, title: 'UPI Payment Cashback', points: 50, date: '12 Dec 2024', type: 'earned' },
  { id: 2, title: 'Referral Bonus', points: 200, date: '10 Dec 2024', type: 'earned' },
  { id: 3, title: 'Redeemed for Recharge', points: -100, date: '08 Dec 2024', type: 'redeemed' },
  { id: 4, title: 'Bill Payment Reward', points: 30, date: '05 Dec 2024', type: 'earned' },
];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'history'>('overview');
  const totalPoints = 1480;
  const level = totalPoints >= 1000 ? 'Gold' : totalPoints >= 500 ? 'Silver' : 'Bronze';
  const levelColor = level === 'Gold' ? 'text-yellow-500' : level === 'Silver' ? 'text-gray-400' : 'text-orange-600';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rewards & Cashback</h1>
        <p className="text-sm text-gray-500 mt-1">Earn points on every transaction</p>
      </div>

      {/* Points Banner */}
      <motion.div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-6 text-white"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Total Reward Points</p>
            <p className="text-5xl font-bold mt-1">{totalPoints.toLocaleString()}</p>
            <p className="text-white/80 text-sm mt-1">≈ ₹{(totalPoints * 0.25).toFixed(0)} value</p>
          </div>
          <div className="text-right">
            <Trophy size={48} className="text-white/60 mb-2" />
            <span className={`px-3 py-1 bg-white/20 rounded-full text-sm font-bold ${levelColor}`}>{level} Member</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>{totalPoints} pts</span><span>2000 pts for Platinum</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full">
            <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalPoints / 2000) * 100, 100)}%` }} transition={{ duration: 1.2 }} />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Points Earned', value: '1,680', icon: Star, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Points Redeemed', value: '200', icon: Zap, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Cashback Earned', value: '₹420', icon: Gift, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={18} />
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {(['overview', 'offers', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Refer & Earn', desc: 'Get ₹200 for each friend you refer', icon: '👥', color: 'from-blue-500 to-cyan-500' },
            { title: 'Scratch Cards', desc: '3 scratch cards available', icon: '🎴', color: 'from-purple-500 to-pink-500' },
            { title: 'Spin & Win', desc: 'Spin daily for bonus points', icon: '🎡', color: 'from-orange-500 to-red-500' },
            { title: 'Loyalty Bonus', desc: 'Gold member perks active', icon: '🏆', color: 'from-yellow-500 to-orange-500' },
          ].map(item => (
            <motion.div key={item.title} whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 text-white cursor-pointer`}>
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold mt-3">{item.title}</h3>
              <p className="text-white/80 text-sm mt-1">{item.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-white/80 text-xs">
                Claim Now <ChevronRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="grid grid-cols-2 gap-4">
          {offers.map(offer => (
            <motion.div key={offer.id} whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700 cursor-pointer">
              <div className={`w-12 h-12 bg-gradient-to-br ${offer.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {offer.emoji}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{offer.title}</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Tag size={10} />{offer.brand}</p>
              <p className="text-xs text-orange-500 mt-1">Expires: {offer.expiry}</p>
              <button className="mt-3 w-full py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl text-xs font-medium hover:bg-primary-100 transition">
                Claim Offer
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
          {rewardHistory.map((item, i) => (
            <div key={item.id} className={`flex items-center justify-between p-4 ${i < rewardHistory.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'earned' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                  {item.type === 'earned' ? <Star size={16} className="text-green-500" /> : <Zap size={16} className="text-red-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
              </div>
              <span className={`font-bold text-sm ${item.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {item.points > 0 ? '+' : ''}{item.points} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Target, CreditCard, FileDown, LogOut,
  ChevronRight, Shield, FileText, User, Crown, Sparkles
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';


const ProfileScreen = ({ onNavigate }) => {
  const { user, logout, subscriptionTier, requireTierOrPaywall } = useUser();
  const navigate = useNavigate();


  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const quickLinks = [
    { key: 'goals', label: 'Financial Goals', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { key: 'reports', label: 'Export Reports', icon: FileDown, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { key: 'settings', label: 'Account Settings', icon: User, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="px-4 pb-6 space-y-5"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.05 }}
    >
      {/* User Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-amber-500/90 dark:to-orange-600/90 rounded-2xl p-5 text-white shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {(user?.name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{user?.name || 'User'}</h2>
            <p className="text-sm text-white/70 truncate">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Subscription Badge */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden"
      >
        <div className="p-4">
          {subscriptionTier === 'free' ? (
            <button
              onClick={() => requireTierOrPaywall('pro', 'Premium Features')}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white active:scale-[0.98] transition-transform"
            >
              <div className="p-2 bg-white/20 rounded-xl">
                <Crown size={22} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm">Upgrade to Pro</p>
                <p className="text-xs text-white/80">Unlock AI insights, unlimited goals & more</p>
              </div>
              <ChevronRight size={18} className="text-white/60" />
            </button>
          ) : (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10">
              <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl">
                <Sparkles size={22} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {subscriptionTier === 'ai_pro' ? 'AI Pro' : subscriptionTier === 'business' ? 'Business' : 'Pro'} Plan
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium features active</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold">
                Active
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Features</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {quickLinks.map((link) => (
            <motion.button
              key={link.key}
              onClick={() => onNavigate(link.key)}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-4 px-5 py-4 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors"
            >
              <div className={`p-2.5 rounded-xl ${link.bg}`}>
                <link.icon size={20} className={link.color} />
              </div>
              <span className="flex-1 text-left text-[15px] font-medium text-gray-800 dark:text-gray-200">{link.label}</span>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Legal */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          <button
            onClick={() => navigate('/privacy-policy')}
            className="w-full flex items-center gap-4 px-5 py-4 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors"
          >
            <Shield size={20} className="text-gray-400" />
            <span className="flex-1 text-left text-[15px] font-medium text-gray-800 dark:text-gray-200">Privacy Policy</span>
            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </button>
          <button
            onClick={() => navigate('/terms-of-service')}
            className="w-full flex items-center gap-4 px-5 py-4 active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors"
          >
            <FileText size={20} className="text-gray-400" />
            <span className="flex-1 text-left text-[15px] font-medium text-gray-800 dark:text-gray-200">Terms of Service</span>
            <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.button
        variants={itemVariants}
        onClick={handleLogout}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold py-4 rounded-2xl active:bg-red-100 dark:active:bg-red-500/20 transition-colors"
      >
        <LogOut size={20} />
        Sign Out
      </motion.button>

      {/* Version footer */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 pt-2">ApexMoney v1.0.0</p>
    </motion.div>
  );
};

export default React.memo(ProfileScreen);

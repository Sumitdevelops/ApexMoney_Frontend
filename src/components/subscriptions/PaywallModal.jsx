import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, Shield, Sparkles, Check, Loader2 } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import {
    getOfferings,
    purchasePackage,
    restorePurchases,
} from '../../services/revenueCat.service';

/**
 * PaywallModal — shown when a free-tier user tries to access premium features.
 *
 * On Android: triggers the native Google Play Billing sheet via RevenueCat.
 * On Web: shows plan details and a link to the /signup page for web checkout.
 *
 * Props:
 *   - isOpen: boolean
 *   - onClose: () => void
 *   - requiredTier: 'pro' | 'ai_pro'  (which tier is needed)
 *   - featureName: string              (e.g. "AI Smart Insights")
 *   - onPurchaseSuccess: (tier) => void
 */
const PaywallModal = ({ isOpen, onClose, requiredTier = 'ai_pro', featureName = 'this feature', onPurchaseSuccess }) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [restoring, setRestoring] = useState(false);
    const [error, setError] = useState(null);

    const isNative = Capacitor.isNativePlatform();

    useEffect(() => {
        if (isOpen && isNative) {
            loadOfferings();
        } else {
            setLoading(false);
        }
    }, [isOpen, isNative]);

    const loadOfferings = async () => {
        setLoading(true);
        setError(null);
        try {
            const pkgs = await getOfferings();
            setPackages(pkgs);
        } catch (err) {
            setError('Failed to load subscription options. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (pkg) => {
        setPurchasing(true);
        setError(null);
        try {
            const result = await purchasePackage(pkg);
            if (result) {
                onPurchaseSuccess?.(requiredTier);
                onClose();
            }
        } catch (err) {
            setError('Purchase failed. Please try again.');
        } finally {
            setPurchasing(false);
        }
    };

    const handleRestore = async () => {
        setRestoring(true);
        setError(null);
        try {
            const info = await restorePurchases();
            if (info) {
                const active = info.entitlements?.active || {};
                if (Object.keys(active).length > 0) {
                    const tier = active['business'] ? 'business' : active['ai_pro'] ? 'ai_pro' : active['pro'] ? 'pro' : 'free';
                    onPurchaseSuccess?.(tier);
                    onClose();
                    return;
                }
            }
            setError('No previous purchases found.');
        } catch (err) {
            setError('Failed to restore purchases. Please try again.');
        } finally {
            setRestoring(false);
        }
    };

    // Plan display data
    const plans = {
        pro: {
            name: 'Pro',
            icon: Crown,
            gradient: 'from-violet-600 to-purple-600',
            color: 'text-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-500/10',
            features: [
                'Unlimited financial goals',
                'Subscription tracker',
                'PDF report export',
                'Dark & light theme',
                'Priority support',
            ],
            price: { monthly: '₹149', yearly: '₹1,199' },
        },
        ai_pro: {
            name: 'AI Pro',
            icon: Sparkles,
            gradient: 'from-amber-500 to-orange-600',
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            features: [
                'Everything in Pro',
                'AI Smart Insights',
                'AI Financial Chat',
                'Receipt Scanner (OCR)',
                'Spending Predictions',
                'Budget Recommendations',
            ],
            price: { monthly: '₹299', yearly: '₹2,399' },
        },
    };

    const planData = plans[requiredTier] || plans.ai_pro;
    const PlanIcon = planData.icon;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-md mx-4 mb-0 sm:mb-0 bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Header gradient */}
                    <div className={`bg-gradient-to-r ${planData.gradient} px-6 pt-8 pb-12 text-white relative`}>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <PlanIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{planData.name} Plan</h2>
                                <p className="text-sm text-white/80">Unlock {featureName}</p>
                            </div>
                        </div>

                        <p className="text-white/90 text-sm leading-relaxed">
                            Upgrade to access premium features and take full control of your finances.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 -mt-6">
                        {/* Features Card */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wider">
                                What you get
                            </h3>
                            <ul className="space-y-2.5">
                                {planData.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        <Check size={16} className="text-green-500 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="px-6 py-6 space-y-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 size={28} className="animate-spin text-gray-400" />
                            </div>
                        ) : isNative && packages.length > 0 ? (
                            /* Native: show Google Play packages */
                            <>
                                {packages.map((pkg) => (
                                    <button
                                        key={pkg.identifier}
                                        onClick={() => handlePurchase(pkg)}
                                        disabled={purchasing}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
                                            ${purchasing ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400 hover:shadow-md active:scale-[0.98]'}
                                            border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}
                                    >
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                {pkg.product.title || pkg.identifier}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {pkg.product.description || ''}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                                {pkg.product.priceString}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {pkg.packageType === 'ANNUAL' ? '/year' : '/month'}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </>
                        ) : (
                            /* Web fallback: show static pricing */
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-center">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{planData.price.monthly}</p>
                                        <p className="text-xs text-gray-500">per month</p>
                                    </div>
                                    <div className="p-4 rounded-xl border-2 border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-center relative">
                                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                            SAVE 33%
                                        </span>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{planData.price.yearly}</p>
                                        <p className="text-xs text-gray-500">per year</p>
                                    </div>
                                </div>

                                <a
                                    href={`/signup?plan=${requiredTier}`}
                                    className={`block w-full text-center bg-gradient-to-r ${planData.gradient} text-white py-3.5 rounded-xl font-bold text-base hover:shadow-lg transition-all active:scale-[0.98]`}
                                >
                                    Get {planData.name} Now
                                </a>
                            </>
                        )}

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        {/* Restore Purchases — mandatory for Play Store */}
                        {isNative && (
                            <button
                                onClick={handleRestore}
                                disabled={restoring}
                                className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2 transition-colors"
                            >
                                {restoring ? 'Restoring...' : 'Restore Purchases'}
                            </button>
                        )}

                        {/* Legal links — required by Google Play */}
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
                            <a href="/terms-of-service" className="hover:text-gray-600 underline">Terms of Service</a>
                            <span>•</span>
                            <a href="/privacy-policy" className="hover:text-gray-600 underline">Privacy Policy</a>
                        </div>

                        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                            Subscriptions auto-renew. Cancel anytime from Google Play settings.
                            Payment will be charged to your Google Play account at confirmation.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaywallModal;

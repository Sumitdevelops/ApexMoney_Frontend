import React, { lazy, Suspense } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

// Lazy-load heavy feature components so they don't bloat the main bundle
const SmartInsights = lazy(() => import('../components/ai/SmartInsights'));
const FinancialGoals = lazy(() => import('../components/goals/FinancialGoals'));
const SubscriptionTracker = lazy(() => import('../components/subscriptions/SubscriptionTracker'));

const SectionLoader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-purple-600"></div>
  </div>
);

export default function PremiumFeatures() {
    const { user } = useUser();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to access premium features</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">✨ Premium Features</h1>
                            <p className="text-white/80">AI-Powered Financial Management</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
                {/* AI Insights Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <span>💡</span> AI Smart Insights
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Get personalized financial insights powered by AI
                        </p>
                    </div>
                    <Suspense fallback={<SectionLoader />}>
                        <SmartInsights userId={user._id} />
                    </Suspense>
                </section>

                {/* Financial Goals Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <span>🎯</span> Financial Goals
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Track your progress towards financial freedom
                        </p>
                    </div>
                    <Suspense fallback={<SectionLoader />}>
                        <FinancialGoals userId={user._id} />
                    </Suspense>
                </section>

                {/* Subscription Tracker Section */}
                <section>
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <span>💳</span> Subscription Tracker
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Auto-detect and manage all your subscriptions in one place
                        </p>
                    </div>
                    <Suspense fallback={<SectionLoader />}>
                        <SubscriptionTracker userId={user._id} />
                    </Suspense>
                </section>
            </div>
        </div>
    );
}

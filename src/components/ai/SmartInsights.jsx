import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND = import.meta.env.VITE_BACKENDURL;

// ─── Animated Number Counter ─────────────────────────────────────────
const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseFloat(value) || 0;
        const duration = 1200;
        const step = (end - start) / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
                start = end;
                clearInterval(timer);
            }
            setDisplay(start);
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{prefix}{Math.round(display).toLocaleString()}{suffix}</span>;
};

// ─── Health Score Ring ────────────────────────────────────────────────
const HealthScoreRing = ({ score }) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
    const label = score >= 70 ? 'Excellent' : score >= 40 ? 'Needs Work' : 'Critical';

    return (
        <div className="relative flex flex-col items-center">
            <svg width="140" height="140" className="transform -rotate-90">
                <circle cx="70" cy="70" r={radius} fill="none" stroke="#1E293B" strokeWidth="10" />
                <motion.circle
                    cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeDasharray={circumference}
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <motion.div
                    className="text-3xl font-black"
                    style={{ color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                >
                    {score}
                </motion.div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{label}</div>
            </div>
        </div>
    );
};

// ─── Sparkline Mini Chart ─────────────────────────────────────────────
const Sparkline = ({ data, color = '#818CF8' }) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 120;
    const h = 40;
    const points = data.map((val, i) => `${(i / (data.length - 1)) * w},${h - ((val - min) / range) * h}`).join(' ');

    return (
        <svg width={w} height={h} className="opacity-60">
            <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        </svg>
    );
};


const SmartInsights = ({ userId }) => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [budgetRecs, setBudgetRecs] = useState(null);
    const [activeSection, setActiveSection] = useState('insights');
    const [refreshing, setRefreshing] = useState(false);

    // Chat state
    const [chatMessages, setChatMessages] = useState([
        { role: 'assistant', content: "Hey! I'm **Apex AI** 🧠 — your personal financial assistant. Ask me anything about your spending, savings, or budgeting goals!" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (userId) loadAllData();
    }, [userId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [insightRes, predRes, budgetRes] = await Promise.allSettled([
                axios.get(`${BACKEND}/ai/insights`, { withCredentials: true }),
                axios.get(`${BACKEND}/ai/predictions`, { withCredentials: true }),
                axios.get(`${BACKEND}/ai/budget-recommendations`, { withCredentials: true })
            ]);

            if (insightRes.status === 'fulfilled') {
                setInsights(insightRes.value.data.insights || []);
                setSummary(insightRes.value.data.summary || null);
            }
            if (predRes.status === 'fulfilled') {
                setPredictions(predRes.value.data.prediction || null);
            }
            if (budgetRes.status === 'fulfilled') {
                setBudgetRecs(budgetRes.value.data.recommendations || null);
            }
        } catch (error) {
            console.error('Failed to load AI data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadAllData();
        setRefreshing(false);
    };

    const sendChat = async () => {
        if (!chatInput.trim() || chatLoading) return;
        const userMsg = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatLoading(true);

        try {
            const res = await axios.post(`${BACKEND}/ai/chat`, { message: userMsg }, { withCredentials: true });
            setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            const detail = err?.response?.data?.details || err?.message || 'Unknown error';
            setChatMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${detail}` }]);
        } finally {
            setChatLoading(false);
        }
    };

    const dismissInsight = async (insightId) => {
        try {
            await axios.patch(`${BACKEND}/ai/insights/${insightId}/dismiss`, {}, { withCredentials: true });
            setInsights(prev => prev.filter(i => i._id !== insightId));
        } catch { }
    };

    // Compute health score from summary data
    const healthScore = summary ? Math.min(100, Math.max(0, Math.round(
        (parseFloat(summary.savingsRate) >= 20 ? 40 : parseFloat(summary.savingsRate) * 2) +
        (summary.insightCount > 0 ? 20 : 10) +
        (summary.totalIncome > summary.totalExpenses ? 30 : 10) +
        (predictions ? 10 : 0)
    ))) : 0;

    const priorityConfig = {
        critical: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', icon: '🚨', glow: 'shadow-red-500/20' },
        high: { bg: 'bg-orange-500/20', border: 'border-orange-500/40', text: 'text-orange-400', icon: '⚠️', glow: 'shadow-orange-500/20' },
        medium: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', icon: '💡', glow: 'shadow-blue-500/20' },
        low: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', icon: '✅', glow: 'shadow-emerald-500/20' },
    };

    const insightTypeIcons = {
        spending_pattern: '📊', budget_warning: '⚠️', savings_opportunity: '💰',
        unusual_activity: '🔍', prediction: '🔮', goal_suggestion: '🎯'
    };

    const quickQuestions = [
        "Where am I wasting money?",
        "Can I afford a vacation?",
        "How to save ₹5000 this month?",
        "What's my biggest expense?"
    ];

    // ─── Loading State ────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"
                    />
                    <p className="text-gray-500 text-sm animate-pulse">Apex AI is analyzing your finances...</p>
                </div>
            </div>
        );
    }

    // ─── Main Render ──────────────────────────────────────────────────
    return (
        <div className="space-y-6 max-w-6xl mx-auto px-3 sm:px-0">

            {/* ══════════════════ HERO BANNER ══════════════════ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6 md:p-8"
            >
                {/* Animated background dots */}
                <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                        />
                    ))}
                </div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-8 pt-6 md:pt-0">
                    <div className="flex-1 w-full z-10">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 pr-10 md:pr-0">
                            <span className="text-2xl">🧠</span>
                            <h1 className="text-2xl md:text-3xl font-black text-white">Apex AI Insights</h1>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-indigo-500/30 whitespace-nowrap">
                                Apex AI
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-lg mb-4">
                            Your personal AI financial advisor analyzing every transaction to help you save more and spend smarter.
                        </p>

                        {summary && (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                <div className="px-3 md:px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-medium">Income</div>
                                    <div className="text-base sm:text-lg font-bold text-emerald-400 truncate">
                                        <AnimatedNumber value={summary.totalIncome} prefix="₹" />
                                    </div>
                                </div>
                                <div className="px-3 md:px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <div className="text-[10px] text-red-400 uppercase tracking-wider font-medium">Expenses</div>
                                    <div className="text-base sm:text-lg font-bold text-red-400 truncate">
                                        <AnimatedNumber value={summary.totalExpenses} prefix="₹" />
                                    </div>
                                </div>
                                <div className="px-3 md:px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 col-span-2 lg:col-span-1">
                                    <div className="text-[10px] text-indigo-400 uppercase tracking-wider font-medium">Savings Rate</div>
                                    <div className="text-base sm:text-lg font-bold text-indigo-400 truncate">
                                        <AnimatedNumber value={summary.savingsRate} suffix="%" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Health Score Ring */}
                    <div className="flex-shrink-0 self-center md:self-auto pb-4 md:pb-0">
                        <div className="text-center mb-1">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Financial Health</span>
                        </div>
                        <HealthScoreRing score={healthScore} />
                    </div>
                </div>

                {/* Refresh button */}
                <motion.button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium transition-all flex items-center gap-1.5"
                >
                    <motion.svg
                        animate={refreshing ? { rotate: 360 } : {}}
                        transition={refreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                        className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </motion.svg>
                    {refreshing ? 'Analyzing...' : 'Refresh'}
                </motion.button>
            </motion.div>

            {/* ══════════════════ SECTION TABS ══════════════════ */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                    { key: 'insights', label: '💡 AI Insights', count: insights.length },
                    { key: 'chat', label: '💬 Ask Apex AI' },
                    { key: 'predictions', label: '🔮 Predictions' },
                    { key: 'budget', label: '📋 Budget Plan' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveSection(tab.key)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeSection === tab.key
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${activeSection === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ══════════════════ INSIGHTS TAB ══════════════════ */}
            {activeSection === 'insights' && (
                <AnimatePresence mode="popLayout">
                    {insights.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 text-center border border-indigo-100"
                        >
                            <div className="text-5xl mb-3">🤖</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Insights Yet</h3>
                            <p className="text-gray-500 text-sm mb-4">Add some income and expenses, then hit Refresh to generate personalized AI insights!</p>
                            <button onClick={handleRefresh} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
                                Generate AI Insights
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid gap-4">
                            {insights.map((insight, index) => {
                                const config = priorityConfig[insight.priority] || priorityConfig.medium;
                                return (
                                    <motion.div
                                        key={insight._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: index * 0.08 }}
                                        className={`bg-white rounded-2xl shadow-lg ${config.glow} shadow-lg overflow-hidden border ${config.border}`}
                                    >
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-start gap-3">
                                                    <div className={`${config.bg} w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                                                        {config.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                                            <span>{insightTypeIcons[insight.insightType] || '💡'}</span>
                                                            {insight.title}
                                                        </h3>
                                                        <span className={`text-[10px] uppercase tracking-wider font-bold ${config.text}`}>
                                                            {insight.priority} priority • {insight.insightType?.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => dismissInsight(insight._id)}
                                                    className="text-gray-300 hover:text-gray-500 transition-colors p-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <p className="text-gray-600 text-sm leading-relaxed mb-4 sm:pl-[52px]">
                                                {insight.content}
                                            </p>

                                            {/* Recommendations */}
                                            {insight.recommendations?.length > 0 && (
                                                <div className="sm:pl-[52px] space-y-2">
                                                    {insight.recommendations.map((rec, idx) => (
                                                        <div key={idx} className="flex items-start gap-2 bg-indigo-50 rounded-xl p-3">
                                                            <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                                                                {idx + 1}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-800 break-words">{rec.action}</p>
                                                                {rec.estimatedImpact && (
                                                                    <p className="text-xs text-emerald-600 mt-0.5 font-medium">✦ {rec.estimatedImpact}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>
            )}

            {/* ══════════════════ CHAT TAB ══════════════════ */}
            {activeSection === 'chat' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                    {/* Chat header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">🧠</div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Apex AI Assistant</h3>
                            <p className="text-indigo-200 text-[10px]">Knows your finances • Powered by Groq AI</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-[10px] text-indigo-200">Online</span>
                        </div>
                    </div>

                    {/* Quick questions */}
                    <div className="px-4 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                        {quickQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => { setChatInput(q); }}
                                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium hover:bg-indigo-100 transition-colors border border-indigo-100"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {chatMessages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-md'
                                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm'
                                    }`}>
                                    {msg.content.split('**').map((part, j) =>
                                        j % 2 === 0 ? part : <strong key={j} className={msg.role === 'user' ? 'text-white' : 'text-gray-900'}>{part}</strong>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {chatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                    <div className="flex gap-1.5">
                                        {[0, 1, 2].map(i => (
                                            <motion.div
                                                key={i}
                                                className="w-2 h-2 bg-indigo-400 rounded-full"
                                                animate={{ y: [0, -6, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                                placeholder="Ask about your finances..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all border border-transparent focus:border-indigo-200"
                            />
                            <motion.button
                                onClick={sendChat}
                                disabled={chatLoading || !chatInput.trim()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                Send
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ══════════════════ PREDICTIONS TAB ══════════════════ */}
            {activeSection === 'predictions' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {predictions ? (
                        <>
                            {/* Prediction Summary */}
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">🔮</span>
                                    <h3 className="font-bold text-lg">Next Month's Forecast</h3>
                                </div>
                                <p className="text-violet-200 text-xs mb-4">Based on {predictions.basedOnMonths} months of data • {predictions.confidence}% confidence</p>
                                <div className="flex items-end gap-4">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-wider text-violet-300 font-medium">Predicted Spending</div>
                                        <div className="text-4xl font-black">
                                            <AnimatedNumber value={predictions.total} prefix="₹" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <Sparkline data={predictions.byCategory?.map(c => parseFloat(c.predicted)) || []} color="#C4B5FD" />
                                    </div>
                                </div>
                                {predictions.historicalAverage && (
                                    <div className="mt-3 pt-3 border-t border-white/20 text-xs text-violet-200">
                                        📊 Historical monthly average: <strong className="text-white">₹{parseFloat(predictions.historicalAverage).toLocaleString()}</strong>
                                    </div>
                                )}
                            </div>

                            {/* Category Breakdown */}
                            {predictions.byCategory?.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                                    <h4 className="font-bold text-gray-900 text-sm mb-4">📊 Predicted by Category</h4>
                                    <div className="space-y-3">
                                        {predictions.byCategory.sort((a, b) => parseFloat(b.predicted) - parseFloat(a.predicted)).map((cat, i) => {
                                            const maxVal = Math.max(...predictions.byCategory.map(c => parseFloat(c.predicted)));
                                            const percentage = (parseFloat(cat.predicted) / maxVal) * 100;
                                            return (
                                                <motion.div
                                                    key={cat.category}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-semibold text-gray-700 capitalize">{cat.category}</span>
                                                        <span className="font-bold text-gray-900">₹{parseFloat(cat.predicted).toLocaleString()}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 0.8, delay: i * 0.05 }}
                                                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                        />
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-lg">
                            <div className="text-5xl mb-3">🔮</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Not Enough Data</h3>
                            <p className="text-gray-500 text-sm">Add more expenses across multiple months to unlock spending predictions.</p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ══════════════════ BUDGET TAB ══════════════════ */}
            {activeSection === 'budget' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {budgetRecs ? (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">📋</span>
                                <h3 className="font-bold text-gray-900 text-lg">{budgetRecs.rule}</h3>
                            </div>
                            <p className="text-gray-500 text-xs mb-5">{budgetRecs.description}</p>

                            {/* 50/30/20 Visual Split */}
                            <div className="flex rounded-xl overflow-hidden h-4 mb-6">
                                <div className="bg-blue-500 flex-[5]" title="Needs (50%)" />
                                <div className="bg-purple-500 flex-[3]" title="Wants (30%)" />
                                <div className="bg-emerald-500 flex-[2]" title="Savings (20%)" />
                            </div>
                            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                                <div className="text-center p-2 sm:p-3 rounded-xl bg-blue-50 border border-blue-100 flex flex-col justify-center">
                                    <div className="text-[10px] text-blue-500 uppercase tracking-wider font-bold truncate">Needs (50%)</div>
                                    <div className="text-sm sm:text-base md:text-lg font-black text-blue-600 truncate">₹{parseFloat(budgetRecs.allocations.needs).toLocaleString()}</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 rounded-xl bg-purple-50 border border-purple-100 flex flex-col justify-center">
                                    <div className="text-[10px] text-purple-500 uppercase tracking-wider font-bold truncate">Wants (30%)</div>
                                    <div className="text-sm sm:text-base md:text-lg font-black text-purple-600 truncate">₹{parseFloat(budgetRecs.allocations.wants).toLocaleString()}</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col justify-center">
                                    <div className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold truncate">Savings (20%)</div>
                                    <div className="text-sm sm:text-base md:text-lg font-black text-emerald-600 truncate">₹{parseFloat(budgetRecs.allocations.savings).toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Category Budgets */}
                            <h4 className="font-bold text-gray-900 text-sm mb-3">💰 Suggested Category Limits</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Object.entries(budgetRecs.categoryBudgets).map(([cat, amount]) => (
                                    <div key={cat} className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors">
                                        <div className="text-xs text-gray-500 capitalize font-medium">{cat}</div>
                                        <div className="text-base font-bold text-gray-900">₹{parseFloat(amount).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-lg">
                            <div className="text-5xl mb-3">📋</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Budget Plan Yet</h3>
                            <p className="text-gray-500 text-sm">Add income data to generate your personalized budget plan.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default SmartInsights;

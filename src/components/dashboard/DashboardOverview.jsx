import React, { useMemo } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const StatCard = ({ title, amount, icon, color, bgColor, darkColor, darkBgColor, symbol }) => (
  <motion.div
    className={`bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm p-5 rounded-2xl shadow-lg dark:shadow-gray-900/30 flex items-center space-x-4 transition-transform transform hover:-translate-y-1`}
    whileHover={{ scale: 1.03 }}
  >
    <div className={`p-3 rounded-full ${bgColor} ${darkBgColor}`}>
      {React.cloneElement(icon, { className: `w-6 h-6 ${color} ${darkColor}` })}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{symbol || '₹'}{amount.toLocaleString()}</h3>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm p-6 rounded-2xl shadow-lg dark:shadow-gray-900/30 ${className}`}>
    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">{title}</h3>
    <div className="h-72 w-full flex items-center justify-center">
      {children}
    </div>
  </div>
);

const DashboardOverview = ({ user, pieData, barData, lineData, totalIncome, totalExpense, userCurrency, onCurrencyChange }) => {
  const netSavings = totalIncome - totalExpense;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', SGD: 'S$', AED: 'د.إ', CHF: 'Fr' };
  const getSymbol = (currency) => currencySymbols[currency] || '₹';
  const userSymbol = useMemo(() => getSymbol(userCurrency || 'INR'), [userCurrency]);

  const commonChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          font: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: '500',
          },
          color: isDark ? '#d1d5db' : '#374151',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? '#1f2937' : '#111827',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? '#9ca3af' : '#6B7280',
          font: { size: 12, family: "'Inter', sans-serif" },
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB',
          borderDash: [5, 5],
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6B7280',
          font: { size: 12, family: "'Inter', sans-serif" },
          callback: function (value) {
            return userSymbol + value.toLocaleString();
          },
        },
        border: { display: false, dash: [5, 5] },
      },
    },
    elements: {
      line: { tension: 0.4, borderWidth: 3 },
      point: { radius: 4, hoverRadius: 8 },
      bar: { borderRadius: 8 },
    },
  }), [isDark, userSymbol]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
  };

  return (
    <motion.div
      className="bg-slate-50 dark:bg-transparent p-4 sm:p-6 rounded-2xl min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-wrap justify-between items-center gap-4 mb-6"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome Back, <span className="text-indigo-600 dark:text-amber-400">{user?.name || user?.email}</span> 👋
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Dashboard currency:</span>
          <select
            value={userCurrency}
            onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
            className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 dark:focus:ring-amber-500 focus:border-indigo-400 dark:focus:border-amber-400"
          >
            {Object.keys(currencySymbols).map((code) => (
              <option key={code} value={code}>
                {code} ({getSymbol(code)})
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Income"
            amount={totalIncome}
            icon={<TrendingUp />}
            color="text-green-600"
            bgColor="bg-green-100"
            darkColor="dark:text-emerald-400"
            darkBgColor="dark:bg-emerald-500/15"
            symbol={userSymbol}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Expense"
            amount={totalExpense}
            icon={<TrendingDown />}
            color="text-red-600"
            bgColor="bg-red-100"
            darkColor="dark:text-red-400"
            darkBgColor="dark:bg-red-500/15"
            symbol={userSymbol}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Net Savings"
            amount={netSavings}
            icon={<Wallet />}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
            darkColor="dark:text-amber-400"
            darkBgColor="dark:bg-amber-500/15"
            symbol={userSymbol}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ChartCard title="Income Over Time">
            <Line data={lineData} options={commonChartOptions} />
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Income vs Expense">
            <Pie data={pieData} options={{ ...commonChartOptions, scales: {} }} />
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-3">
          <ChartCard title="Expense by Category">
            <Bar data={barData} options={commonChartOptions} />
          </ChartCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
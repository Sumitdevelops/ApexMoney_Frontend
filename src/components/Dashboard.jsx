import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title,
} from 'chart.js';
import DashboardSidebar from './dashboard/DashboardSidebar';
import WelcomeEmptyState from './dashboard/WelcomeEmptyState';
import DashboardOverview from './dashboard/DashboardOverview';
import ExpenseList from './dashboard/ExpenseList';
import IncomeList from './dashboard/IncomeList';
import EditExpenseModal from './dashboard/EditExpenseModal';
import EditIncomeModal from './dashboard/EditIncomeModal';
import ReportExport from './dashboard/ReportExport';
import FinancialGoals from './goals/FinancialGoals';
import SmartInsights from './ai/SmartInsights';
import SubscriptionTracker from './subscriptions/SubscriptionTracker';
import Settings from './dashboard/Settings';
import { convertCurrency } from '../utils/currencyConversion';
import AmbientBackground from './AmbientBackground';
import { useTheme } from './ThemeProvider';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen w-full bg-slate-50 dark:bg-[#0f0e17]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 dark:border-amber-500"></div>
  </div>
);

const Dashboard = () => {
  const { user, loading: userLoading } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('total');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    if (user) {
      setCheckingAuth(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const storedCurrency = localStorage.getItem('dashboardCurrency');
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    } else if (user.preferences?.currency) {
      setSelectedCurrency(user.preferences.currency);
    } else {
      setSelectedCurrency('INR');
    }
  }, [user]);

  useEffect(() => {
    const savedTab = localStorage.getItem('dashboardActiveTab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', activeTab);
  }, [activeTab]);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('dashboardCurrency', currency);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expenseRes, incomeRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKENDURL}/expense/get?userId=${user._id}`),
        axios.get(`${import.meta.env.VITE_BACKENDURL}/income/get?userId=${user._id}`),
      ]);
      const expensesData = Array.isArray(expenseRes.data)
        ? expenseRes.data
        : expenseRes.data.expenses || expenseRes.data.data || expenseRes.data.documents || [];
      const incomesData = Array.isArray(incomeRes.data)
        ? incomeRes.data
        : incomeRes.data.incomes || incomeRes.data.data || incomeRes.data.documents || [];

      setExpenses(expensesData);
      setIncomes(incomesData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setExpenses([]);
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (type, id) => {
    toast((t) => (
      <span className="flex flex-col items-center gap-3">
        Are you sure you want to delete this {type}?
        <div className="flex gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => {
              const promise = axios.delete(`${import.meta.env.VITE_BACKENDURL}/${type}/delete/${id}`);
              toast.promise(promise, {
                loading: `Deleting ${type}...`,
                success: () => {
                  fetchData();
                  return `${type.charAt(0).toUpperCase() + type.slice(1)} deleted!`;
                },
                error: `Failed to delete ${type}.`,
              });
              toast.dismiss(t.id);
            }}
          >
            Delete
          </button>
          <button
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 6000 });
  };

  const handleUpdate = (type, data) => {
    const promise = axios.put(`${import.meta.env.VITE_BACKENDURL}/${type}/update/${data._id}`, data);

    toast.promise(promise, {
      loading: `Updating ${type}...`,
      success: () => {
        setEditingExpense(null);
        setEditingIncome(null);
        fetchData();
        return `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`;
      },
      error: `Failed to update ${type}.`,
    });
  };

  const { totalIncome, totalExpense } = useMemo(() => ({
    totalIncome: incomes.reduce((sum, income) => sum + convertCurrency(income.amount || 0, income.currency || 'INR', selectedCurrency), 0),
    totalExpense: expenses.reduce((sum, expense) => sum + convertCurrency(expense.amount || 0, expense.currency || 'INR', selectedCurrency), 0),
  }), [incomes, expenses, selectedCurrency]);

  const isDark = theme === 'dark';

  const pieData = useMemo(() => ({
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [totalIncome, totalExpense],
      backgroundColor: isDark ? ['#34d399', '#f87171'] : ['#10B981', '#EF4444'],
      borderColor: isDark ? '#1a1a2e' : '#F9FAFB',
      borderWidth: 2,
    }],
  }), [totalIncome, totalExpense, isDark]);

  const barData = useMemo(() => {
    const categories = [...new Set(expenses.map(e => e.category))];
    return {
      labels: categories,
      datasets: [{
        label: 'Expense by Category',
        data: categories.map(cat => expenses.filter(e => e.category === cat).reduce((sum, e) => sum + convertCurrency(e.amount || 0, e.currency || 'INR', selectedCurrency), 0)),
        backgroundColor: isDark ? '#a78bfa' : '#8B5CF6',
        borderRadius: 8,
        maxBarThickness: 60,
      }],
    };
  }, [expenses, selectedCurrency, isDark]);

  const lineData = useMemo(() => ({
    labels: incomes.map(t => new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Income Over Time',
      data: incomes.map(t => convertCurrency(t.amount || 0, t.currency || 'INR', selectedCurrency)),
      borderColor: isDark ? '#818cf8' : '#3B82F6',
      backgroundColor: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  }), [incomes, selectedCurrency, isDark]);

  if (checkingAuth || loading || userLoading) return <LoadingSpinner />;

  if (!user) return null;

  const renderContent = () => {
    if (expenses.length === 0 && incomes.length === 0) {
      return <WelcomeEmptyState user={user} handleTabChange={setActiveTab} />;
    }

    switch (activeTab) {
      case 'total':
        return (
          <DashboardOverview
            user={user}
            pieData={pieData}
            barData={barData}
            lineData={lineData}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            userCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        );
      case 'expenseList':
        return (
          <ExpenseList
            expenses={expenses}
            totalExpense={totalExpense}
            userCurrency={selectedCurrency}
            onEdit={setEditingExpense}
            onDelete={(id) => handleDelete('expense', id)}
          />
        );
      case 'incomeList':
        return (
          <IncomeList
            incomes={incomes}
            totalIncome={totalIncome}
            userCurrency={selectedCurrency}
            onEdit={setEditingIncome}
            onDelete={(id) => handleDelete('income', id)}
          />
        );
      case 'goals':
        return <FinancialGoals userId={user._id} />;
      case 'insights':
        return <SmartInsights userId={user._id} />;
      case 'subscriptions':
        return <SubscriptionTracker userId={user._id} />;
      case 'reports':
        return <ReportExport expenses={expenses} incomes={incomes} user={user} userCurrency={selectedCurrency} />;
      case 'income':
        return <div className="bg-white dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg h-[50vh]"><h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6">Income Data</h2><Line data={lineData} /></div>;
      case 'expense':
        return <div className="bg-white dark:bg-gray-800/80 p-6 rounded-2xl shadow-lg h-[50vh]"><h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6">Expense Data</h2><Bar data={barData} /></div>;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-[#0f0e17] font-sans relative">
      <AmbientBackground />
      <Toaster position="top-center" reverseOrder={false} />

      <DashboardSidebar activeTab={activeTab} handleTabChange={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className={`flex-1 transition-all duration-300 relative ${isSidebarOpen ? 'md:ml-60' : 'md:ml-0'}`} style={{ zIndex: 2 }}>
        <div className="pt-15 px-4 pb-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {editingExpense && <EditExpenseModal expense={editingExpense} onUpdate={(data) => handleUpdate('expense', data)} onCancel={() => setEditingExpense(null)} />}
      {editingIncome && <EditIncomeModal income={editingIncome} onUpdate={(data) => handleUpdate('income', data)} onCancel={() => setEditingIncome(null)} />}
    </div>
  );
};

export default Dashboard;
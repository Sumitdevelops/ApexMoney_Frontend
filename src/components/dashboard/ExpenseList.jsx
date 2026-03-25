import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit, Trash2, PlusCircle, TrendingDown, Search, Tag, X, Filter } from 'lucide-react';
import { convertCurrency } from '../../utils/currencyConversion';

const ExpenseList = ({ expenses, totalExpense, userCurrency, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', SGD: 'S$', AED: 'د.إ', CHF: 'Fr' };
  const getSymbol = (currency) => currencySymbols[currency] || '₹';

  const allTags = useMemo(() => {
    const tagSet = new Set();
    expenses.forEach(e => (e.tags || []).forEach(t => tagSet.add(t)));
    return [...tagSet].sort();
  }, [expenses]);

  const allCategories = useMemo(() => {
    return [...new Set(expenses.map(e => e.category))].sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    let result = expenses.filter(exp => {
      const matchesSearch = !searchQuery ||
        exp.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.amount?.toString().includes(searchQuery) ||
        (exp.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.every(tag => (exp.tags || []).includes(tag));

      const matchesCategory = !selectedCategory || exp.category === selectedCategory;

      return matchesSearch && matchesTags && matchesCategory;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.date) - new Date(a.date);
        case 'date-asc': return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc': return a.amount - b.amount;
        default: return 0;
      }
    });

    return result;
  }, [expenses, searchQuery, selectedTags, selectedCategory, sortBy]);

  const filteredTotal = filteredExpenses.reduce((sum, e) => sum + convertCurrency(e.amount || 0, e.currency || 'INR', userCurrency), 0);
  const hasFilters = searchQuery || selectedTags.length > 0 || selectedCategory;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring' } } };

  return (
    <motion.div className="bg-slate-50 dark:bg-transparent p-4 sm:p-6 rounded-2xl" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Expense Tracker</h2>
        <Link to="/expense">
          <motion.button
            className="flex items-center gap-2 bg-red-500 dark:bg-red-500/90 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle size={20} />
            Add Expense
          </motion.button>
        </Link>
      </motion.div>

      {/* Search & Filters */}
      {expenses.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses by notes, category, amount, or tags..."
              className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/80 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-amber-500 focus:border-indigo-300 dark:focus:border-amber-400 transition text-sm shadow-sm dark:shadow-gray-900/20 dark:placeholder-gray-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Filter size={14} />Filters:
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-amber-500 transition"
            >
              <option value="">All Categories</option>
              {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-amber-500 transition"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>

            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                className={`px-2.5 py-1 text-xs rounded-full font-medium transition ${selectedTags.includes(tag)
                  ? 'bg-indigo-600 dark:bg-amber-500 text-white dark:text-gray-900 shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-amber-500/15 hover:text-indigo-600 dark:hover:text-amber-400'
                  }`}
              >
                #{tag}
              </button>
            ))}

            {hasFilters && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedTags([]); setSelectedCategory(''); }}
                className="px-2.5 py-1 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {hasFilters && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing <strong>{filteredExpenses.length}</strong> of {expenses.length} expenses
              {filteredExpenses.length !== expenses.length && (
                <> • Filtered total: <strong className="text-red-600 dark:text-red-400">{getSymbol(userCurrency)}{filteredTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></>
              )}
            </p>
          )}
        </motion.div>
      )}

      {expenses.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-12 bg-white dark:bg-gray-800/80 rounded-2xl shadow-md dark:shadow-gray-900/30">
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No expenses recorded yet.</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Click "Add Expense" to start tracking!</p>
        </motion.div>
      ) : filteredExpenses.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-12 bg-white dark:bg-gray-800/80 rounded-2xl shadow-md dark:shadow-gray-900/30">
          <Search size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">No matching expenses</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-1 text-sm">Try adjusting your search or filters.</p>
        </motion.div>
      ) : (
        <>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" variants={containerVariants}>
            <AnimatePresence>
              {filteredExpenses.map((expense) => (
                <motion.div
                  key={expense._id}
                  className="bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/30 p-5 flex flex-col justify-between transition-shadow hover:shadow-xl dark:hover:shadow-gray-900/50"
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 rounded-full text-sm font-semibold">{expense.category}</span>
                      <div className="flex gap-2">
                        <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => onEdit(expense)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"><Edit size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => onDelete(expense._id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></motion.button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 my-4">
                      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        {getSymbol(userCurrency)}
                        {convertCurrency(expense.amount || 0, expense.currency || 'INR', userCurrency).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm break-words mb-3 min-h-[40px]">{expense.notes || 'No notes provided.'}</p>

                    {expense.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {expense.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full text-[11px] font-medium">
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 border-t dark:border-gray-700 pt-3 mt-2">
                    <Calendar size={14} />
                    <span>{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm p-6 rounded-2xl shadow-lg dark:shadow-gray-900/30">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-500/15">
                <TrendingDown className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">{getSymbol(userCurrency)}{totalExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default ExpenseList;
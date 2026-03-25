import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X } from 'lucide-react';

const EditExpenseModal = ({ expense, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState(expense);

  useEffect(() => {
    setFormData(expense);
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-50vh", opacity: 0, scale: 0.9 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { y: "100vh", opacity: 0, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onCancel}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-md"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 pb-3 border-b dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Expense</h3>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><X /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Amount</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 transition" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 transition">
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Health">Health</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
              <input type="date" name="date" value={new Date(formData.date).toISOString().slice(0, 10)} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 transition" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Notes (Optional)</label>
              <textarea name="notes" value={formData.notes || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-red-500 dark:focus:ring-amber-500 transition" rows="3" />
            </div>
            <div className="flex gap-4 pt-4">
              <motion.button type="submit" className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Save size={18}/>Update</motion.button>
              <motion.button type="button" onClick={onCancel} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Cancel</motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditExpenseModal;
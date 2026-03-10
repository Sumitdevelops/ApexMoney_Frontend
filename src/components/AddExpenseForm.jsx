import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ExpenseToast from "../toast/ExpenseToast";
import ReceiptScanner from "./ReceiptScanner";
import { convertCurrency } from "../utils/currencyConversion";

export function AddExpenseForm({ expenseToEdit, onFormSubmit, onCancelEdit }) {
  const backend = import.meta.env.VITE_BACKENDURL;
  const { user } = useUser();
  const navigate = useNavigate();
  const initialState = {
    amount: "",
    category: "Food",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  };

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [currency, setCurrency] = useState('INR');
  const popularTags = ['essential', 'luxury', 'recurring', 'one-time', 'urgent', 'planned', 'shared', 'personal'];

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', SGD: 'S$', AED: 'د.إ', CHF: 'Fr' };
  const currencies = Object.keys(currencySymbols);

  const [formData, setFormData] = useState(initialState);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = (data) => {
    const dashboardCurrency = localStorage.getItem('dashboardCurrency');
    const preferredCurrency =
      dashboardCurrency ||
      user?.preferences?.currency ||
      currency ||
      'INR';

    let convertedAmount = data.amount;

    if (data.amount && data.currency && data.currency !== preferredCurrency) {
      convertedAmount = convertCurrency(
        Number(data.amount) || 0,
        data.currency,
        preferredCurrency
      );
    }

    setFormData(prev => ({
      ...prev,
      amount: convertedAmount ?? prev.amount,
      category: data.category || prev.category,
      notes: data.notes || prev.notes,
      date: data.date || prev.date,
    }));

    setCurrency(preferredCurrency);
    setShowScanner(false);
  };

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        _id: expenseToEdit._id,
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        date: new Date(expenseToEdit.date).toISOString().slice(0, 10),
        notes: expenseToEdit.notes || "",
      });
      setTags(expenseToEdit.tags || []);
      if (expenseToEdit.currency) {
        setCurrency(expenseToEdit.currency);
      }
    } else {
      setFormData(initialState);
    }
  }, [expenseToEdit]);

  useEffect(() => {
    if (expenseToEdit) return;
    const dashboardCurrency = localStorage.getItem('dashboardCurrency');
    if (dashboardCurrency) {
      setCurrency(dashboardCurrency);
    } else if (user?.preferences?.currency) {
      setCurrency(user.preferences.currency);
    } else {
      setCurrency('INR');
    }
  }, [user, expenseToEdit]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const categories = [
    "Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSubmit = {
      ...formData,
      amount: parseFloat(formData.amount),
      userId: user._id,
      tags,
      currency,
    };

    try {
      let response;
      if (formData._id) {

        response = await axios.put(
          `${backend}/expense/update/${formData._id}`,
          dataToSubmit,
          { withCredentials: true }
        );
        setToastMessage("Your expense has been updated.");
      } else {

        response = await axios.post(
          `${backend}/expense/add`,
          dataToSubmit,
          { withCredentials: true }
        );
        setToastMessage("Your expense has been saved.");
      }

      if (onFormSubmit) {
        onFormSubmit();
      }
      if (!formData._id) {
        localStorage.setItem('dashboardActiveTab', 'expenseList');
        navigate('/dashboard');
      } else {
        setShowToast(true);
        setFormData(initialState);
      }
    } catch (error) {
      console.error("Expense save error:", error);
      const backendMessage = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        const messages = validationErrors.map(e => `${e.field}: ${e.message}`).join('\n');
        alert(`Validation failed:\n${messages}`);
      } else if (backendMessage) {
        alert(backendMessage);
      } else {
        alert("Error saving expense. Please try again.");
      }
    }
  };
  if (!user) {
    return (
      <div className="flex justify-center items-center">
        <div className="bg-white m-5 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Please Log In
          </h2>
          <Link to="/signup/login" className="text-blue-600 hover:text-blue-900 font-semibold">
            Go to Login/Signup Page
          </Link>
        </div>
      </div>
    );
  }

  const isEditing = !!formData._id;
  return (
    <div className="flex justify-center items-center">
      <ExpenseToast
        show={showToast}
        title="Success!"
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
      <div className="bg-white m-5 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {isEditing ? "Edit Expense" : "Add New Expense"}
          </h2>
          {!isEditing && (
            <button type="button" onClick={() => setShowScanner(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
              📸 Scan Receipt
            </button>
          )}
        </div>

        {showScanner && <ReceiptScanner onScanComplete={handleScanComplete} onClose={() => setShowScanner(false)} />}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
            <div className="flex gap-2">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-24 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white text-sm font-medium">
                {currencies.map(c => <option key={c} value={c}>{currencySymbols[c]} {c}</option>)}
              </select>
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">{currencySymbols[currency]}</span>
                <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" placeholder="0.00" step="0.01" required />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white" required>
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" required />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" placeholder="e.g., Lunch with colleagues"></textarea>
          </div>
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  #{tag}
                  <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="text-indigo-400 hover:text-indigo-700 ml-0.5 text-xs font-bold">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    const t = tagInput.trim().toLowerCase();
                    if (!tags.includes(t)) setTags([...tags, t]);
                    setTagInput('');
                  }
                }}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm"
                placeholder="Type tag & press Enter"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {popularTags.filter(t => !tags.includes(t)).slice(0, 5).map(t => (
                <button key={t} type="button" onClick={() => setTags([...tags, t])} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition">
                  +{t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" className="flex-grow bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
              {isEditing ? "Update Expense" : "Save Expense"}
            </button>
            {isEditing && (
              <button type="button" onClick={onCancelEdit} className="bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
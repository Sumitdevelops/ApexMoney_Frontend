import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { logout } = useUser();
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_BACKENDURL;

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await axios.delete(`${api_url}/user/delete-account`, {
        withCredentials: true,
        timeout: 15000,
      });

      if (res.data.success) {
        toast.success('Account deleted successfully');
        setShowModal(false);
        try {
          await logout();
        } catch {
          // Session already destroyed on backend
        }
        navigate('/signup/login');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to delete account. Please try again.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Account Settings Card */}
      <div className="bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Account Settings</h2>
        </div>

        <div className="p-6">
          {/* Danger Zone */}
          <div className="border border-red-200 dark:border-red-500/30 rounded-xl p-5 bg-red-50/50 dark:bg-red-500/5">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-500/15 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-400">Danger Zone</h3>
                <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
                  Once you delete your account, all of your data will be permanently removed.
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Legal Links Card */}
      <div className="bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Legal</h2>
        </div>
        <div className="p-6 flex flex-col sm:flex-row gap-4">
          <Link
            to="/privacy-policy"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-amber-400 hover:text-indigo-800 dark:hover:text-amber-300 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-amber-400 hover:text-indigo-800 dark:hover:text-amber-300 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-500/15 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Account</h3>
                </div>
                <button
                  onClick={() => !deleting && setShowModal(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  disabled={deleting}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-5">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  This action permanently deletes your account and all financial data.
                  This cannot be undone.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={deleting}
                  className="py-2.5 px-5 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {deleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Permanently'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;

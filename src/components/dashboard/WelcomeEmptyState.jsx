import React from 'react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const WelcomeEmptyState = ({ user, handleTabChange }) => {
  return (
    <>
    <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800/80 dark:backdrop-blur-sm p-8 rounded-2xl shadow-md dark:shadow-gray-900/30 text-center">
      <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-4">
        Welcome, {user?.name || user?.email}!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
        No data available to display charts.
        <br />
        Let's get started by adding your first transaction.
      </p>
      <div className="flex gap-6">
        <Link to="/income" onClick={() => handleTabChange('incomeList')}>
          <button className="bg-indigo-600 dark:bg-emerald-500 text-white dark:text-gray-900 px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-emerald-600 transition-transform transform hover:scale-105 font-semibold shadow-lg">
            + Add Income
          </button>
        </Link>
        <Link to="/expense" onClick={() => handleTabChange('expenseList')}>
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 font-semibold shadow-lg">
            + Add Expense
          </button>
        </Link>
      </div>
    </div>
     <DotLottieReact
     className='w-2/3 h-98 mx-auto my-12'
      src="/nodata.lottie"
      loop
      autoplay
    />
    </>
  );
};

export default WelcomeEmptyState;
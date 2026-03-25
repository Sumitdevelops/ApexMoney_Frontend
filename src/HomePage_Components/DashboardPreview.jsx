// src/components/DashboardPreview.jsx

import React, { useState } from 'react';
import { ChartBarIcon, ChartPieIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState('bar');

  const tabs = [
    { id: 'bar', name: 'Expenses by Category', icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
    { id: 'line', name: 'Income Over Time', icon: <ArrowTrendingUpIcon className="w-5 h-5 mr-2" /> },
    { id: 'pie', name: 'Income vs. Expense', icon: <ChartPieIcon className="w-5 h-5 mr-2" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'line':
        return (
          <img
            src="./LineChart.png"
            alt="Line chart showing income over time"
            className="w-full h-auto rounded-b-lg"
          />
        );
      case 'pie':
        return (
          <img
            src="./PieChart.png"
            alt="Pie chart showing income vs expense summary"
            className="w-full h-auto rounded-b-lg"
          />
        );
      case 'bar':
      default:
        return (
          <img
            src="./BarChart.png"
            alt="Bar chart showing expenses by category"
            className="w-full h-auto rounded-b-lg"
          />
        );
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-transparent py-20 sm:py-24" id="demo">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            See Your Finances Come to Life
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our dashboard turns your numbers into knowledge. Toggle between views to see how ApexMoney visualizes your financial habits.
          </p>
        </div>

        {/* Browser Mockup */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800/60 dark:backdrop-blur-sm rounded-xl shadow-2xl dark:shadow-gray-900/40 ring-1 ring-gray-200 dark:ring-white/10">
          {/* Browser Header */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-grow text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              ApexMoney Dashboard
            </div>
          </div>

          {/* Interactive Tabs */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/40">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 dark:bg-amber-500 text-white dark:text-gray-900 shadow-sm'
                      : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="p-4 md:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
// src/components/Features.jsx

import React from 'react';

// --- ICONS ---
const WalletIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
  </svg>
);
const CircleStackIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 15.353 16.556 17.25 12 17.25s-8.25-1.897-8.25-4.125V10.125" />
  </svg>
);
const CreditCardIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
  </svg>
);

// --- Reusable Feature Card Component ---
const FeatureCard = ({ icon, title, description, visualContent }) => (
  <div className="bg-white dark:bg-gray-800/60 dark:backdrop-blur-sm rounded-2xl p-8 flex flex-col items-start h-full transform transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/40 hover:-translate-y-1 ring-1 ring-gray-200 dark:ring-white/10">
    <div className="bg-purple-100 dark:bg-amber-500/15 text-purple-600 dark:text-amber-400 p-3 rounded-xl mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed flex-grow">{description}</p>
    <div className="w-full mt-auto">
      {visualContent}
    </div>
  </div>
);

// --- Data for the features ---
const featuresData = [
  {
    icon: <WalletIcon className="w-6 h-6" />,
    title: "Know Every Dollar's Destination",
    description: "Easily log your daily, weekly, and monthly expenses. Smart categorization shows you exactly where your money goes, so you can make smarter decisions.",
    visualContent: (
      <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">☕️ Coffee Shop</span>
          <span className="text-sm font-semibold text-red-500 dark:text-red-400">-$5.50</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🛒 Groceries</span>
          <span className="text-sm font-semibold text-red-500 dark:text-red-400">-$72.30</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary</span>
          <span className="text-sm font-semibold text-green-500 dark:text-emerald-400">+$2,500.00</span>
        </div>
      </div>
    ),
  },
  {
    icon: <CircleStackIcon className="w-6 h-6" />,
    title: "Budget Without the Guesswork",
    description: "Set clear budgets for different categories, monitor your progress in real-time, and get smart alerts before you overspend.",
    visualContent: (
      <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Food Budget</span>
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">$280 / $400</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-purple-600 dark:bg-amber-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
        </div>
      </div>
    ),
  },
  {
    icon: <CreditCardIcon className="w-6 h-6" />,
    title: "Your Full Financial Picture",
    description: "Securely connect all your bank accounts in one place. Get a clear overview of your balances and track your net worth effortlessly.",
    visualContent: (
      <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-white/5 transition">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Checking Account</span>
          <span className="text-sm font-mono text-gray-800 dark:text-gray-200">$4,128.55</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-white/5 transition">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Savings Account</span>
          <span className="text-sm font-mono text-gray-800 dark:text-gray-200">$15,600.10</span>
        </div>
      </div>
    ),
  },
];


export default function Features() {
  return (
    <section className="bg-white dark:bg-transparent py-20 sm:py-24">
      <div className="container mx-auto px-4">

        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block bg-purple-100 dark:bg-amber-500/15 text-purple-600 dark:text-amber-400 text-sm font-semibold py-1 px-4 rounded-full mb-4">
            Simple. Smart. Secure.
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            Everything You Need to Master Your Money
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            From tracking every penny to planning for your future, ApexMoney provides the tools for complete financial control.
          </p>
        </div>

        <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              visualContent={feature.visualContent}
            />
          ))}
        </main>
        
        <div className="text-center mt-16">
          <button className="bg-purple-600 dark:bg-amber-500 text-white dark:text-gray-900 font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:bg-purple-700 dark:hover:bg-amber-600 hover:scale-105 shadow-lg shadow-purple-200 dark:shadow-amber-500/20">
            Explore All Features
          </button>
        </div>

      </div>
    </section>
  );
}
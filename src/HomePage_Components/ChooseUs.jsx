import React from 'react';
const ClockIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartBarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const ShieldCheckIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
  </svg>
);

export default function ChooseUs() {
  return (
    <div className="bg-white dark:bg-transparent py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-base font-semibold leading-7 text-violet-600 dark:text-amber-400">Why Choose Us</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Why Thousands Trust TruePath
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Experience smarter, stress-free financial management backed by simplicity, security, and powerful insights.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">

            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-amber-500/15">
                <ClockIcon className="h-6 w-6 text-violet-600 dark:text-amber-400" aria-hidden="true" />
              </div>
              <dt className="mt-4 font-semibold text-gray-900 dark:text-gray-100 text-lg">Save Time on Manual Calculations</dt>
              <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
                Automate your financial tracking and reporting, so you can focus on growing your business - not crunching numbers.
              </dd>
            </div>

            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-amber-500/15">
                <ChartBarIcon className="h-6 w-6 text-violet-600 dark:text-amber-400" aria-hidden="true" />
              </div>
              <dt className="mt-4 font-semibold text-gray-900 dark:text-gray-100 text-lg">Get Real-Time Financial Insights</dt>
              <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
                Access up-to-date reports and dashboards anytime, anywhere, giving you full visibility into your finances at a glance.
              </dd>
            </div>

            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-amber-500/15">
                <ShieldCheckIcon className="h-6 w-6 text-violet-600 dark:text-amber-400" aria-hidden="true" />
              </div>
              <dt className="mt-4 font-semibold text-gray-900 dark:text-gray-100 text-lg">Stay on Top of Budgets</dt>
              <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
                Set custom budgets and receive smart alerts, helping you control overspending and meet your financial goals with ease.
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-20 flex flex-col items-center gap-y-4">
            <button className="bg-violet-600 dark:bg-amber-500 text-white dark:text-gray-900 font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:bg-violet-700 dark:hover:bg-amber-600 hover:scale-105 shadow-lg shadow-violet-200 dark:shadow-amber-500/20">
                See Full Features
            </button>
            <button className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:bg-slate-200 dark:hover:bg-white/10 ring-1 ring-slate-200 dark:ring-white/10">
                Choose the Perfect Plan
            </button>
        </div>

      </div>
    </div>
  );
}
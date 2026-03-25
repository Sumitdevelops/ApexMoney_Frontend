// src/components/HowItWorks.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const UserPlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21c-2.305 0-4.47-.612-6.337-1.664z" />
  </svg>
);

const PresentationChartBarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h-1.5m1.5 0h1.5m-1.5 0l1.125-3.375m14.25 3.375l-1.125-3.375m-12 3.375l1.125-3.375m1.5-3.375l1.125-3.375m-1.5 3.375l-1.125 3.375m1.5-3.375l1.125 3.375M9 12l1.125-3.375M12 12l1.125-3.375M15 12l1.125-3.375M12 21v-9" />
  </svg>
);

const PencilSquareIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);


export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlusIcon className="w-6 h-6 text-white" />,
      name: '1. Create Your Account',
      description: 'Get started in minutes. Securely create your account to begin your journey towards financial clarity.',
    },
    {
      icon: <PencilSquareIcon className="w-6 h-6 text-white" />,
      name: '2. Track Your Spending',
      description: 'Easily add your income and expenses on the go. Our smart categorization does the heavy lifting for you.',
    },
    {
      icon: <PresentationChartBarIcon className="w-6 h-6 text-white" />,
      name: '3. Gain Instant Insights',
      description: 'Instantly view your financial health with clear charts and automated reports. Make informed decisions effortlessly.',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-indigo-900 dark:to-purple-950 overflow-hidden">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-y-12 gap-x-12 lg:grid-cols-2">
          
          <div className="flex items-center justify-center">
            <img
                src="./App_Mockup.png"
                alt="ApexMoney Dashboard View"
                className="w-full max-w-sm rounded-2xl shadow-2xl"
            />
          </div>

          <div>
            <div className="mb-10">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold leading-6 text-white ring-1 ring-inset ring-white/20">
                How It Works
              </span>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Master Your Money in 3 Simple Steps
              </h2>
              <p className="mt-4 text-lg leading-8 text-indigo-100 dark:text-indigo-200">
                It's quick, easy, and stress-free to stay on top of your money — no technical skills required.
              </p>
            </div>
            
            <dl className="space-y-8">
              {steps.map((step) => (
                <div key={step.name} className="relative flex gap-x-5">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                    {step.icon}
                  </div>
                  <div>
                    <dt className="font-semibold text-white">{step.name}</dt>
                    <dd className="mt-1 text-indigo-100 dark:text-indigo-200">{step.description}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <Link to="/signup/login" className="mt-10 inline-block bg-white dark:bg-amber-500 text-purple-600 dark:text-gray-900 font-semibold py-3 px-6 rounded-lg transition-transform duration-300 hover:scale-105 shadow-lg">
                Start for Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
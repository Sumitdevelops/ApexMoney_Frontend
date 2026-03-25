// src/components/FinalCTA.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const FinalCTA = () => {
  return (
    <section className="bg-white dark:bg-transparent">
      <div className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-indigo-900 dark:to-purple-950 p-12 text-center shadow-xl dark:shadow-indigo-900/30">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-indigo-100 dark:text-indigo-200">
            Join over 500,000 users building a better financial future. Get started with ApexMoney for free today.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Link
              to="/signup/login"
              className="group inline-flex items-center justify-center rounded-md bg-white dark:bg-amber-500 px-6 py-3 text-base font-semibold text-purple-600 dark:text-gray-900 shadow-md hover:bg-purple-50 dark:hover:bg-amber-400 transition"
            >
              Sign Up for Free
              <ArrowRightIcon className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
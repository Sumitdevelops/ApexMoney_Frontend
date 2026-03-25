// src/components/Pricing.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const StarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l1.96 4.048 4.458.647c.725.105 1.018.986.49 1.488l-3.226 3.143.76 4.44c.123.715-.63 1.255-1.282.913L10 15.347l-3.984 2.095c-.652.342-1.405-.198-1.282-.913l.76-4.44-3.226-3.143c-.528-.502-.235-1.383.49-1.488l4.458-.647 1.96-4.048z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.345a1 1 0 0 1-1.437.011L3.29 9.31a1 1 0 1 1 1.42-1.41l3.16 3.18 6.54-6.62a1 1 0 0 1 1.294-.17z"
      clipRule="evenodd"
    />
  </svg>
);

const plans = [
  {
    name: "Starter",
    price: "$9",
    description: "Great for beginners who want to start budgeting smartly.",
    features: [
      "Expense & income tracking",
      "Budget management",
      "Up to 3 financial goals"
    ],
    href: "/plans?plan=starter",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "Perfect for users who want AI-powered insights and more control.",
    features: [
      "Everything in Starter",
      "AI Smart Insights",
      "Subscription tracker",
      "PDF report export"
    ],
    href: "/plans?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    description: "For power users who want the complete financial toolkit.",
    features: [
      "Everything in Pro",
      "Advanced analytics",
      "Custom categories",
      "Dedicated support"
    ],
    href: "/plans?plan=enterprise",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold leading-7 text-purple-600 dark:text-amber-400">Pricing</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            The Right Plan for Your Needs
          </h2>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-400">
          Simple, transparent pricing. Choose the plan that helps you achieve your financial goals.
        </p>

        {/* Pricing Cards */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 transition-all duration-300 ${plan.popular
                ? "bg-white dark:bg-gray-800/80 ring-2 ring-purple-600 dark:ring-amber-500 shadow-2xl dark:shadow-amber-500/10 scale-105"
                : "bg-gray-50 dark:bg-gray-800/40 ring-1 ring-gray-200 dark:ring-white/10 lg:hover:scale-105"
                }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-gray-100">
                  {plan.name}
                </h3>

                {plan.popular && (
                  <p className="flex items-center gap-x-1 rounded-full bg-purple-100 dark:bg-amber-500/15 px-2.5 py-1 text-xs font-semibold leading-5 text-purple-600 dark:text-amber-400">
                    <StarIcon className="w-4 h-4" /> Most Popular
                  </p>
                )}
              </div>

              <p className="mt-4 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {plan.price}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">/month</span>
              </p>

              <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400">
                {plan.description}
              </p>

              <Link
                to={plan.href}
                className={`mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold leading-6 transition-colors ${plan.popular
                  ? "bg-purple-600 dark:bg-amber-500 text-white dark:text-gray-900 shadow-sm hover:bg-purple-500 dark:hover:bg-amber-600"
                  : "bg-white dark:bg-white/5 text-purple-600 dark:text-amber-400 ring-1 ring-inset ring-purple-200 dark:ring-amber-500/30 hover:bg-purple-50 dark:hover:bg-white/10"
                  }`}
              >
                Get Started
              </Link>

              <ul className="mt-10 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-purple-600 dark:text-amber-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

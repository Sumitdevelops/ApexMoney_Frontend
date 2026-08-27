import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lightweight layout shell loaded eagerly
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded route components (code-split into separate chunks)
const Home = lazy(() => import('../components/Home'));
const Signup = lazy(() => import('../components/Signup').then(m => ({ default: m.Signup })));
const Dashboard = lazy(() => import('../components/Dashboard'));
const AddExpenseForm = lazy(() => import('../components/AddExpenseForm').then(m => ({ default: m.AddExpenseForm })));
const AddIncomeForm = lazy(() => import('../components/AddIncomeForm').then(m => ({ default: m.AddIncomeForm })));
const Testimonials = lazy(() => import('../pages/Testimonials'));
const About = lazy(() => import('../pages/About'));
const Features = lazy(() => import('../HomePage_Components/Features'));
const PremiumFeatures = lazy(() => import('../pages/PremiumFeatures'));
const Subscribe = lazy(() => import('../pages/Subscribe'));
const PlanDetails = lazy(() => import('../pages/PlanDetails'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen w-full bg-slate-50 dark:bg-[#0f0e17]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 dark:border-amber-500"></div>
  </div>
);

function AppRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/premium" element={<PremiumFeatures />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/signup/login" element={<Signup />} />
          <Route path="/plans" element={<PlanDetails />} />
          <Route path="/signup" element={<Subscribe />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/expense" element={<ProtectedRoute><AddExpenseForm /></ProtectedRoute>} />
        <Route path="/income" element={<ProtectedRoute><AddIncomeForm /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );
}

export default AppRoute;
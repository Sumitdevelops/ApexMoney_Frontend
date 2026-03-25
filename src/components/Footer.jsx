// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder for social media icons
const SocialIcon = ({ children }) => (
  <a href="#" className="text-gray-400 hover:text-white transition">
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-[#0a0a14] text-white relative" style={{ zIndex: 2 }}>
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold">ApexMoney</h3>
            <p className="mt-4 text-gray-400 text-sm leading-6">
              The simplest way to manage your personal finances.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-semibold text-gray-200">Product</h4>
            <ul className="mt-4 space-y-3">
              <li><Link to="/#features" className="text-gray-400 hover:text-amber-400 transition">Features</Link></li>
              <li><Link to="/#pricing" className="text-gray-400 hover:text-amber-400 transition">Pricing</Link></li>
              <li><Link to="/#demo" className="text-gray-400 hover:text-amber-400 transition">Demo</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-semibold text-gray-200">Company</h4>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Blog</a></li>
            </ul>
          </div>
          
          {/* Column 4: Legal */}
          <div>
            <h4 className="font-semibold text-gray-200">Legal</h4>
            <ul className="mt-4 space-y-3">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-amber-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-amber-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-gray-700 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ApexMoney, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <SocialIcon>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </SocialIcon>
            <SocialIcon>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
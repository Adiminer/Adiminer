import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => (
  <footer className="bg-gray-950 text-gray-300">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm text-gray-400">
            Miraa is your AI study companion: ask a question, get a clear answer and a
            step-by-step explanation you can actually learn from.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/solve" className="hover:text-white">Solve a problem</Link></li>
            <li><Link to="/history" className="hover:text-white">History</Link></li>
            <li><Link to="/profile" className="hover:text-white">Profile & plans</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Learn more</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/#features" className="hover:text-white">Features</a></li>
            <li><a href="/#how" className="hover:text-white">How it works</a></li>
            <li><a href="/#faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-800 pt-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Miraa. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

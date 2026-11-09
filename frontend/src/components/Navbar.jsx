import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { path: '/solve', label: 'Solve' },
  { path: '/history', label: 'History' },
  { path: '/profile', label: 'Profile' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {location.pathname === '/' && (
            <>
              <a href="#features" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">How it works</a>
              <a href="#pricing" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
            </>
          )}
          {navItems.map(({ path, label }) => (
            <NavLink key={path} to={path} className={linkClass}>
              {label}
            </NavLink>
          ))}
          <Link to="/solve" className="btn-primary ml-2 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            Ask Miraa
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map(({ path, label }) => (
              <NavLink key={path} to={path} className={linkClass}>
                {label}
              </NavLink>
            ))}
            <Link to="/solve" className="btn-primary mt-2">
              <Sparkles className="h-4 w-4" />
              Ask Miraa
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

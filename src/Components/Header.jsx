import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Logout } from './index';

function Logo({ className = '' }) {
  return (
    <div className={`text-2xl font-bold text-blue-600 ${className}`}>
      Note<span className="text-gray-800">form</span>
    </div>
  );
}

export default function Header() {
  const isAuth = useSelector((s) => s.auth.isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Home', url: '/', show: true },
    { name: 'Login', url: '/login', show: !isAuth },
    { name: 'Sign Up', url: '/signup', show: !isAuth },
    { name: 'Add Post', url: '/add-post', show: isAuth },
    { name: 'Add Article', url: '/post-form', show: isAuth },
    { name: 'Profile', url: '/profile', show: isAuth },
    { name: 'Contact Us', url: '/contact', show: true },
    { name: 'About Us', url: '/about', show: true },
  ];

  return (
    <header className="bg-[#f8f9fa] shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map(
              (item) =>
                item.show && (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`transition-colors ${
                      currentPath === item.url
                        ? 'text-blue-600 font-semibold'
                        : 'hover:text-blue-500'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
            )}
            {isAuth && <Logout />}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg
              className="w-6 cursor-pointer h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  menuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
        </div>

        
        {menuOpen && (
          <nav className="md:hidden pb-4">
            <ul className="flex flex-col space-y-2 text-sm font-medium">
              {navItems.map(
                (item) =>
                  item.show && (
                    <li key={item.name}>
                      <Link
                        to={item.url}
                        className={`block px-2 py-1 transition-colors ${
                          currentPath === item.url
                            ? 'text-blue-600 font-semibold'
                            : 'hover:text-blue-500'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
              )}
              {isAuth && (
                <li>
                  <Logout />
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

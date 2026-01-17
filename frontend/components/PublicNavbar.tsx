/**
 * Task: T038
 * Spec: Professional Navbar Component - Clean text logo, no emojis
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavLink {
  label: string;
  href: string;
  type?: 'primary' | 'secondary' | 'ghost';
}

interface PublicNavbarProps {
  onNavigate?: (section: string) => void;
  fullWidth?: boolean;
}

export default function PublicNavbar({ onNavigate, fullWidth = false }: PublicNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: NavLink[] = [
    { label: 'Features', href: '#features', type: 'ghost' },
    { label: 'Pricing', href: '#pricing', type: 'ghost' },
    { label: 'Login', href: '/login', type: 'ghost' },
    { label: 'Sign Up', href: '/signup', type: 'primary' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#') && onNavigate) {
      onNavigate(href);
    }
  };

  const getLinkClasses = (link: NavLink) => {
    const baseClasses = 'px-4 py-2 rounded-lg transition-colors text-sm font-medium';

    if (link.type === 'primary') {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }
    return `${baseClasses} text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700`;
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-white dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={`${fullWidth ? '' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex justify-between items-center h-16">
          {/* Logo - Text only, no emoji */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Todo App home"
            >
              <span className="text-xl font-bold tracking-tight">
                Todo App
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={getLinkClasses(link)}
                aria-label={link.label}
              >
                {link.label}
              </Link>
            ))}
            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          role="menu"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`${getLinkClasses(link)} block w-full text-left`}
                role="menuitem"
                aria-label={link.label}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export type { PublicNavbarProps, NavLink };

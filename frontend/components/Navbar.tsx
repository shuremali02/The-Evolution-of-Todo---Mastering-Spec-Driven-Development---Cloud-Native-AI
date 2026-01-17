/**
 * Task: T039
 * Spec: Professional Navbar for Authenticated Pages - Profile dropdown with avatar and navigation options
 */

'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { Avatar } from '@/src/components/ui/Avatar';
import { apiClient } from '@/lib/api';
import type { UserProfile as User } from '@/types/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { AppLogo } from '@/components/AppLogo';

interface NavbarProps {
  onLogout: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiClient.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If profile fetch fails, we might still have token in storage
        // We could try to extract basic info from the token if needed
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      apiClient.logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error logging out');
    } finally {
      setIsOpen(false);
      // Call the parent's onLogout to handle navigation
      onLogout();
    }
  };

  const handleProfileClick = () => {
    router.push('/profile?section=profile');
    setIsOpen(false);
  };

  const handlePasswordClick = () => {
    router.push('/profile?section=password');
    setIsOpen(false);
  };

  const handleEmailClick = () => {
    router.push('/profile?section=email');
    setIsOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-40 bg-white dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with icon */}
          <div className="flex items-center">
            <AppLogo size="md" />
          </div>

          {/* Navigation Links - Show only when authenticated */}
          {!loading && user && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2 mr-4">
                <a
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/tasks"
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Tasks
                </a>
                <a
                  href="/profile"
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Profile
                </a>
              </div>

            </>
          )}

          {/* User Actions */}
          <div className="flex items-center gap-4" ref={dropdownRef}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Info with Avatar as Dropdown Trigger */}
            {!loading && user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <Avatar username={user.username} size="md" />
                  <svg
                    className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <Fragment>
                    {/* Backdrop for mobile */}
                    <div
                      className="fixed inset-0 z-10 bg-black bg-opacity-20 md:hidden"
                      onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 border border-gray-200 dark:border-gray-700"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="py-1" role="none">
                        {/* User Info in Dropdown */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>

                        {/* Navigation Options */}
                        <a
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                          role="menuitem"
                        >
                          Dashboard
                        </a>
                        <a
                          href="/tasks"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                          role="menuitem"
                        >
                          My Tasks
                        </a>
                        <button
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                          role="menuitem"
                        >
                          Your Profile
                        </button>
                        <button
                          onClick={handlePasswordClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                          role="menuitem"
                        >
                          Change Password
                        </button>
                        <button
                          onClick={handleEmailClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                          role="menuitem"
                        >
                          Update Email
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors border-t border-gray-100 dark:border-gray-700"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

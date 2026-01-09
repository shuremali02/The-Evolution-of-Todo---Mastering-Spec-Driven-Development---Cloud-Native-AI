/**
 * Task: T039
 * Spec: Professional Navbar for Authenticated Pages - Profile dropdown with avatar and navigation options
 */

'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { Avatar } from '@/src/components/ui/Avatar';
import { getProfile, logout } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

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
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
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
      logout();
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

  const handleAvatarClick = () => {
    router.push('/profile');
    setIsOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Text only, no emoji */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Todo App
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4" ref={dropdownRef}>
            {/* User Info with Avatar as Dropdown Trigger */}
            {!loading && user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <Avatar username={user.username} size="md" />
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 border border-gray-200"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="py-1" role="none">
                        {/* User Info in Dropdown */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>

                        {/* Navigation Options */}
                        <button
                          onClick={handleAvatarClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          role="menuitem"
                        >
                          Your Profile
                        </button>
                        <a
                          href="/profile/change-password"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push('/profile/change-password');
                            setIsOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          role="menuitem"
                        >
                          Change Password
                        </a>
                        <a
                          href="/profile/update-email"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push('/profile/update-email');
                            setIsOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          role="menuitem"
                        >
                          Update Email
                        </a>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100"
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

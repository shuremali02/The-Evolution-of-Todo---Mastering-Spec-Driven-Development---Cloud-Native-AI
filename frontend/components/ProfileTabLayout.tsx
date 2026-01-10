/**
 * Task: T003
 * Spec: Profile Navigation Enhancement - Tabbed interface for profile sections
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserProfile } from '@/src/components/auth/UserProfile';
import { PasswordChangeForm } from '@/src/components/auth/PasswordChangeForm';
import { EmailUpdateForm } from '@/src/components/auth/EmailUpdateForm';
import { apiClient } from '@/lib/api';
import type { UserProfile as User } from '@/types/auth';

interface ProfileTabLayoutProps {
  initialSection?: 'profile' | 'password' | 'email';
}

export function ProfileTabLayout({ initialSection = 'profile' }: ProfileTabLayoutProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'email'>(initialSection);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user data once when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProfile();
        setUserData(data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle tab changes
  const handleSectionChange = (section: 'profile' | 'password' | 'email') => {
    setActiveSection(section);
    // Update URL with section parameter
    router.push(`?section=${section}`);
  };

  // Handle successful form submissions
  const handleFormSuccess = async () => {
    try {
      // Refresh user data after successful form submission
      const data = await apiClient.getProfile();
      setUserData(data);
    } catch (err) {
      console.error('Error refreshing user data:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account</h2>
            <nav className="space-y-1">
              <button
                onClick={() => handleSectionChange('profile')}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                  activeSection === 'profile'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => handleSectionChange('password')}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                  activeSection === 'password'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => handleSectionChange('email')}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                  activeSection === 'email'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Update Email
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area - Dynamic based on selected tab */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg">
            {activeSection === 'profile' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h2>
                <UserProfile user={userData || undefined} />
              </div>
            )}

            {activeSection === 'password' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Update your account password for better security.</p>
                <PasswordChangeForm onSuccess={handleFormSuccess} />
              </div>
            )}

            {activeSection === 'email' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Update Email</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Change your account email address.</p>
                <EmailUpdateForm onSuccess={handleFormSuccess} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
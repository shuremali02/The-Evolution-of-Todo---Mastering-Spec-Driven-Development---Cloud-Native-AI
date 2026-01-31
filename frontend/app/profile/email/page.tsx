/**
 * Task: T063
 * Spec: Frontend UI Fixes - Profile Email Page with Breadcrumb Navigation
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EmailUpdatePageContent } from '@/components/EmailUpdatePageContent';
import { apiClient } from '@/lib/api';
import type { UserProfile as User } from '@/types/auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function EmailPage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user data when component mounts
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

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading profile..." />
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Update Email</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Change your account email address.
        </p>
      </div>

      <div className="max-w-2xl">
        <EmailUpdatePageContent />
      </div>
    </div>
  );
}
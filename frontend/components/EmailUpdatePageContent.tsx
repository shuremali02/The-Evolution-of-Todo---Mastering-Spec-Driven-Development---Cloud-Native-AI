/**
 * Task: T063
 * Spec: Frontend UI Fixes - Dedicated Email Update Component for Standalone Page
 */

'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { UserProfile as User } from '@/types/auth';

interface EmailUpdateProps {
  onCancel?: () => void;
}

export function EmailUpdatePageContent({ onCancel }: EmailUpdateProps) {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Load current email on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await apiClient.getProfile();
        setCurrentEmail(user.email);
        setNewEmail(user.email);
        setConfirmEmail(user.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    fetchCurrentUser();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newEmail) {
      newErrors.newEmail = 'New email is required';
    } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
      newErrors.newEmail = 'Email address is invalid';
    }

    if (!confirmEmail) {
      newErrors.confirmEmail = 'Please confirm your new email';
    } else if (newEmail !== confirmEmail) {
      newErrors.confirmEmail = 'Email addresses do not match';
    }

    if (newEmail === currentEmail) {
      newErrors.newEmail = 'New email must be different from current email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prompt for password to verify identity before changing email
      const password = prompt('Please enter your password to verify identity:');
      if (!password) {
        toast.error('Password is required to update email');
        setLoading(false);
        return;
      }

      await apiClient.updateEmail(newEmail, password);

      toast.success('Email updated successfully!');

      // Redirect to profile page after success
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error: any) {
      console.error('Error updating email:', error);
      const errorMsg = error?.response?.data?.detail || error?.message || 'Failed to update email';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Email
          </label>
          <input
            type="email"
            id="currentEmail"
            value={currentEmail}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Email
          </label>
          <input
            type="email"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.newEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            placeholder="Enter your new email address"
          />
          {errors.newEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.newEmail}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm New Email
          </label>
          <input
            type="email"
            id="confirmEmail"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
            placeholder="Confirm your new email address"
          />
          {errors.confirmEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmEmail}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Email...' : 'Update Email'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
/**
 * Task: T042, T045, T046, T061
 * Spec: 002-authentication/spec.md - User Profile Component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { apiClient } from '@/lib/api';
import type { UserProfile as User } from '@/types/auth';
import toast from 'react-hot-toast';

interface UserProfileProps {
  user?: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [loading, setLoading] = useState(false); // No initial loading since data is passed in
  const router = useRouter();

  // If user data is not provided, we can still fetch it as fallback
  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const userData = await apiClient.getProfile();
          // Note: In the tabbed layout, parent component will handle this
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      apiClient.logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error logging out');
    }
  };

  if (!user) {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      );
    }

    return (
      <div className="text-center p-6">
        <p className="text-red-600 dark:text-red-400">Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg">
              {(user.username || 'U')[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</h3>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Username</label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user.username}</p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Member Since</label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 dark:bg-emerald-900 text-green-400 dark:text-white">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
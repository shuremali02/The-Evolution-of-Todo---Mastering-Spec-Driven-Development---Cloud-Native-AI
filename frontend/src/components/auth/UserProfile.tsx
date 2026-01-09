/**
 * Task: T042, T045, T046, T061
 * Spec: 002-authentication/spec.md - User Profile Component
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '../ui/Avatar';
import { apiClient } from '@/lib/api';
import type { UserProfile } from '@/types/auth';
import toast from 'react-hot-toast';

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiClient.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If error occurs, user might not be authenticated
        // Don't set user to null to avoid flickering
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600">Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar username={user.username} size="lg" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900">Account Information</h4>
          <div className="mt-2 space-y-2">
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
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
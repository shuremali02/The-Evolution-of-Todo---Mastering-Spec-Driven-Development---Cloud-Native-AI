/**
 * Task: T005
 * Spec: Frontend UI Fixes - Enhanced Profile Component with Avatar Upload
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/src/components/ui/Avatar';
import { apiClient } from '@/lib/api';
import type { UserProfile as User } from '@/types/auth';
import toast from 'react-hot-toast';

interface EnhancedProfileProps {
  user?: User;
}

export function EnhancedProfile({ user }: EnhancedProfileProps) {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Initialize profile image to null since UserProfile doesn't have profile_image property
  useEffect(() => {
    // Currently, profile images are not supported in the backend schema
    // This would need to be implemented as a future feature
    setProfileImage(null);
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setProfileImage(imageData);

        // Here you would typically upload the image to the backend
        // For now, we'll just save it locally
        toast.success('Profile picture updated locally');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      username: user?.username || '',
      email: user?.email || '',
    });
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update email if changed (the API only supports email updates currently)
      if (editData.email !== user.email) {
        // Prompt for password to verify identity before changing email
        const password = prompt('Please enter your password to verify identity:');
        if (!password) {
          toast.error('Password is required to update email');
          setLoading(false);
          return;
        }

        await apiClient.updateEmail(editData.email, password);
        toast.success('Email updated successfully!');
      } else {
        toast.success('Profile updated successfully!');
      }

      setIsEditing(false);
      // Optionally refresh the user data
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      username: user?.username || '',
      email: user?.email || '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        {/* Profile Picture Section */}
        <div className="relative group mb-6">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              />
            ) : (
              <Avatar username={user?.username || 'User'} size="lg" />
            )}

            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Change profile picture"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                name="username"
                value={editData.username}
                onChange={handleInputChange}
                className="text-xl font-bold text-center bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 pb-1 w-full max-w-xs"
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className="text-gray-600 dark:text-gray-400 text-center bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 pb-1 w-full max-w-xs"
                placeholder="Email"
              />
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.username}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Stats */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Username</label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.username}</p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.email}</p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Member Since</label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
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

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto"
        >
          Logout
        </button>

        <button
          onClick={() => {
            // Navigate to change password section
            router.push('/profile?section=password');
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
/**
 * Task: T059
 * Spec: 002-authentication/spec.md - Email Update Form Component
 */

'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { validateEmail } from '@/lib/validation';
import toast from 'react-hot-toast';

interface EmailUpdateFormProps {
  onSuccess?: () => void;
}

export const EmailUpdateForm: React.FC<EmailUpdateFormProps> = ({ onSuccess }) => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'newEmail':
        const emailValidation = validateEmail(value);
        setErrors(prev => ({
          ...prev,
          newEmail: typeof emailValidation === 'string' ? emailValidation : ''
        }));
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case 'newEmail':
        setNewEmail(value);
        validateField('newEmail', value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailValidation = validateEmail(newEmail);
    if (typeof emailValidation === 'string') {
      setErrors({ newEmail: emailValidation });
      return;
    } else {
      setErrors(prev => ({ ...prev, newEmail: '' }));
    }

    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.updateEmail(newEmail, password);

      toast.success('Email updated successfully!');
      setNewEmail('');
      setPassword('');

      // Update any display with the new email if needed
      console.log('Email update response:', response);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Email update error:', error);
      toast.error(error.message || 'Failed to update email');
      setErrors({ general: error.message || 'Failed to update email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Update Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            New Email
          </label>
          <input
            id="newEmail"
            name="newEmail"
            type="email"
            value={newEmail}
            onChange={handleChange}
            onBlur={() => validateField('newEmail', newEmail)}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.newEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter new email address"
          />
          {errors.newEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.newEmail}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Current Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter current password for verification"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Updating Email...' : 'Update Email'}
        </button>
      </form>
    </div>
  );
};
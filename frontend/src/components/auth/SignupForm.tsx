/**
 * Task: T024
 * Spec: 002-authentication/spec.md - Signup Form Component
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { validateUsername, validateEmail, validatePassword, validatePasswordMatch } from '@/lib/validation';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFormValidation } from '@/hooks/useFormValidation';
import { ErrorMessage } from '@/components/ErrorMessage'; // Import the ErrorMessage component

export const SignupForm: React.FC = () => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationRules = {
    username: {
      required: true,
      validate: (value: string) => {
        const result = validateUsername(value);
        return typeof result === 'string' ? result : null;
      },
    },
    email: {
      required: true,
      validate: (value: string) => {
        const result = validateEmail(value);
        return typeof result === 'string' ? result : null;
      },
    },
    password: {
      required: true,
      validate: (value: string) => {
        const result = validatePassword(value);
        return typeof result === 'string' ? result : null;
      },
    },
    confirmPassword: {
      required: true,
      validate: (value: string, allValues?: Record<string, any>) => {
        const passwordValue = allValues?.password || '';
        const result = validatePasswordMatch(passwordValue, value);
        return typeof result === 'string' ? result : null;
      },
    },
  };

  const { values, errors, touched, valid, handleChange, handleBlur, validateAll } = useFormValidation(
    initialValues,
    validationRules
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false); // Track network error state

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isValid = validateAll();

    if (!isValid) {
      return;
    }

    setLoading(true);
    setGeneralError(null); // Clear any previous general errors
    setIsNetworkError(false); // Reset network error state

    try {
      await apiClient.signup(values.username, values.email, values.password, values.confirmPassword);

      toast.success('Account created successfully!');
      router.push('/dashboard'); // Redirect to dashboard after successful signup
    } catch (error: any) {
      console.error('Signup error:', error);

      // Check if it's a network error
      const errorMessage = error.message || 'Failed to create account';
      const isNetworkErr =
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('fetch') ||
        errorMessage.toLowerCase().includes('failed to fetch') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('timeout');

      setIsNetworkError(isNetworkErr);
      setGeneralError(errorMessage);

      if (isNetworkErr) {
        toast.error('Please check your internet connection and try again.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={values.username}
            onChange={handleInputChange}
            onBlur={() => handleBlur('username')}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.username && errors.username.length > 0 && touched.username ? 'border-red-500' :
              valid.username && touched.username ? 'border-green-500' :
              'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter username"
          />
          {errors.username && errors.username.length > 0 && (
            <p className="mt-1 text-sm text-red-600">{errors.username[0]?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleInputChange}
            onBlur={() => handleBlur('email')}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              errors.email && errors.email.length > 0 && touched.email ? 'border-red-500' :
              valid.email && touched.email ? 'border-green-500' :
              'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter email"
          />
          {errors.email && errors.email.length > 0 && (
            <p className="mt-1 text-sm text-red-600">{errors.email[0]?.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              className={`w-full px-3 py-2 pr-10 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.password && errors.password.length > 0 && touched.password ? 'border-red-500' :
                valid.password && touched.password ? 'border-green-500' :
                'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {showPassword ? (
                // Eye icon for showing password
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                // Eye slash icon for hiding password
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7.001.578 0 1.14-.046 1.684-.135l-.145.135z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && errors.password.length > 0 && (
            <p className="mt-1 text-sm text-red-600">{errors.password[0]?.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={values.confirmPassword}
              onChange={handleInputChange}
              onBlur={() => handleBlur('confirmPassword')}
              className={`w-full px-3 py-2 pr-10 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.confirmPassword && errors.confirmPassword.length > 0 && touched.confirmPassword ? 'border-red-500' :
                valid.confirmPassword && touched.confirmPassword ? 'border-green-500' :
                'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {showConfirmPassword ? (
                // Eye icon for showing password
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                // Eye slash icon for hiding password
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7.001.578 0 1.14-.046 1.684-.135l-.145.135z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && errors.confirmPassword.length > 0 && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword[0]?.message}</p>
          )}
        </div>

        {generalError && (
          <div className="mb-4">
            {isNetworkError ? (
              <ErrorMessage
                message={generalError}
                onRetry={() => {
                  // Attempt to retry the signup with current form values
                  handleSubmit(new Event('submit') as unknown as React.FormEvent);
                }}
              />
            ) : (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                {generalError}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          {loading && <LoadingSpinner size="sm" label="" />}
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
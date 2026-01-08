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

export const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'username':
        const usernameValidation = validateUsername(value);
        setErrors(prev => ({
          ...prev,
          username: typeof usernameValidation === 'string' ? usernameValidation : ''
        }));
        break;
      case 'email':
        const emailValidation = validateEmail(value);
        setErrors(prev => ({
          ...prev,
          email: typeof emailValidation === 'string' ? emailValidation : ''
        }));
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        setErrors(prev => ({
          ...prev,
          password: typeof passwordValidation === 'string' ? passwordValidation : ''
        }));
        // Also validate password match when password changes
        if (confirmPassword) {
          const matchValidation = validatePasswordMatch(value, confirmPassword);
          setErrors(prev => ({
            ...prev,
            confirmPassword: typeof matchValidation === 'string' ? matchValidation : ''
          }));
        }
        break;
      case 'confirmPassword':
        const matchValidation = validatePasswordMatch(password, value);
        setErrors(prev => ({
          ...prev,
          confirmPassword: typeof matchValidation === 'string' ? matchValidation : ''
        }));
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case 'username':
        setUsername(value);
        validateField('username', value);
        break;
      case 'email':
        setEmail(value);
        validateField('email', value);
        break;
      case 'password':
        setPassword(value);
        validateField('password', value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        validateField('confirmPassword', value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validations = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validatePasswordMatch(password, confirmPassword)
    };

    const newErrors: Record<string, string> = {};
    Object.entries(validations).forEach(([key, value]) => {
      if (typeof value === 'string') {
        newErrors[key] = value;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.signup(username, email, password, confirmPassword);

      toast.success('Account created successfully!');
      router.push('/tasks'); // Redirect to tasks page after successful signup
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={handleChange}
            onBlur={() => validateField('username', username)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            onBlur={() => validateField('email', email)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleChange}
              onBlur={() => validateField('password', password)}
              className={`w-full px-3 py-2 pr-10 border rounded-md ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleChange}
              onBlur={() => validateField('confirmPassword', confirmPassword)}
              className={`w-full px-3 py-2 pr-10 border rounded-md ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
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
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
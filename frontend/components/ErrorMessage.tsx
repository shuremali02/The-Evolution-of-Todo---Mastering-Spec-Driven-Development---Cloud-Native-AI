/**
 * Task: T1006
 * Spec: dashboard-fixes/spec.md - Error Message Component
 */

import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  className = ''
}) => {
  // Map technical error messages to user-friendly messages
  const getUserFriendlyMessage = (errorMessage: string): string => {
    // Common technical error messages and their user-friendly equivalents
    const errorMap: Record<string, string> = {
      // Authentication errors
      'Could not validate credentials': 'Session expired. Please log in again.',
      'Unauthorized': 'Access denied. Please log in to continue.',
      'Expired signature': 'Your session has expired. Please log in again.',

      // Network errors
      'Network Error': 'Unable to connect to the server. Please check your internet connection.',
      'Failed to fetch': 'Unable to connect to the server. Please check your internet connection.',
      'NetworkError when attempting to fetch resource.': 'Unable to connect to the server. Please check your internet connection.',

      // Server errors
      'Internal Server Error': 'Something went wrong on our end. Please try again later.',
      'Service Unavailable': 'The service is temporarily unavailable. Please try again later.',

      // Database errors
      'Database connection failed': 'Unable to access data. Please try again later.',

      // Validation errors
      'Invalid input': 'The information provided is not valid. Please check and try again.',
      'Validation Error': 'Please check the information you entered and try again.',

      // Task-related errors
      'Task not found': 'The task you are looking for does not exist.',
      'Task does not belong to user': 'You do not have permission to access this task.',
    };

    // Check if the error message contains any of the keys as substrings
    for (const [technical, userFriendly] of Object.entries(errorMap)) {
      if (errorMessage.toLowerCase().includes(technical.toLowerCase())) {
        return userFriendly;
      }
    }

    // If no mapping found, return a generic message
    return 'An unexpected error occurred. Please try again.';
  };

  const friendlyMessage = getUserFriendlyMessage(message);

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{friendlyMessage}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
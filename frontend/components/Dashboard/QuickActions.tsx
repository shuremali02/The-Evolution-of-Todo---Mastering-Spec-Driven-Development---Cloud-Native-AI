/**
 * Task: T006, T024, T025
 * Spec: 006 Dashboard
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QuickActionsProps {}

export const QuickActions: React.FC<QuickActionsProps> = () => {
  const router = useRouter();

  const handleCreateTask = () => {
    // Scroll to the QuickTaskForm on the dashboard page
    const element = document.getElementById('create-new-task-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Optionally focus on the title input
      const titleInput = element.querySelector('input[name="title"]');
      if (titleInput) {
        setTimeout(() => (titleInput as HTMLElement).focus(), 300);
      }
    }
  };

  const handleViewAllTasks = () => {
    router.push('/tasks');
  };

  const handleSetReminder = () => {
    // For now, just redirect to profile where reminder settings might be
    router.push('/profile');
  };

  const handleExportTasks = () => {
    // Export functionality would be implemented here
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_10%)]">Quick Actions</h2>

      <div className="space-y-4">
        <button
          onClick={handleCreateTask}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Task
        </button>

        <button
          onClick={handleViewAllTasks}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View All Tasks
        </button>

        <button
          onClick={handleSetReminder}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Set Reminder
        </button>

        <button
          onClick={handleExportTasks}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Tasks
        </button>
      </div>
    </div>
  );
};
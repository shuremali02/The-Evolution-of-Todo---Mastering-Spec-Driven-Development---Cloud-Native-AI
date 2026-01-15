/**
 * Task: T1004
 * Spec: dashboard-fixes/spec.md - Reminder Modal Component
 */

'use client';

import React, { useState } from 'react';
import { Task } from '@/types/task';
import { apiClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

interface ReminderModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [reminderDateTime, setReminderDateTime] = useState<string>(task.reminder || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reminderDateTime) {
      setError('Please select a reminder date and time');
      return;
    }

    // Validate that the reminder time is in the future
    const reminderTime = new Date(reminderDateTime);
    const currentTime = new Date();

    if (reminderTime <= currentTime) {
      setError('Reminder time must be in the future');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update the task with the reminder
      const updatedTask = await apiClient.updateTask(task.id, {
        reminder: reminderDateTime
      });

      toast.success('Reminder set successfully!');
      onUpdate(updatedTask);
      onClose();
    } catch (err: any) {
      console.error('Failed to set reminder:', err);
      const errorMessage = err.message || 'Failed to set reminder';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to remove this reminder?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update the task to remove the reminder
      const updatedTask = await apiClient.updateTask(task.id, {
        reminder: null
      });

      toast.success('Reminder removed successfully!');
      onUpdate(updatedTask);
      onClose();
    } catch (err: any) {
      console.error('Failed to remove reminder:', err);
      const errorMessage = err.message || 'Failed to remove reminder';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Set Reminder for "{task.title}"
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="reminderDateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Date and Time
              </label>
              <input
                type="datetime-local"
                id="reminderDateTime"
                value={reminderDateTime}
                onChange={(e) => setReminderDateTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min={new Date().toISOString().slice(0, 16)} // Prevent selecting past times
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-between space-x-3">
              {task.reminder && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Removing...' : 'Remove'}
                </button>
              )}

              <div className="flex-1 flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {loading && <LoadingSpinner size="sm" label="" />}
                  <span>{loading ? 'Setting...' : 'Set Reminder'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
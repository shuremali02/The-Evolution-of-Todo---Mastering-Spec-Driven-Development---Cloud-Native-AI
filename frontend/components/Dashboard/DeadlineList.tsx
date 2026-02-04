/**
 * Task: T005, T019, T020, T021, T022
 * Spec: 006 Dashboard
 */

'use client';

import React from 'react';
import { format, isToday, isTomorrow } from 'date-fns';
import { UpcomingDeadlineItem } from '@/types/dashboard';

interface DeadlineListProps {
  deadlines: UpcomingDeadlineItem[];
}

export const DeadlineList: React.FC<DeadlineListProps> = ({ deadlines }) => {
  const getPriorityColor = (priority: string, isOverdue: boolean) => {
    if (isOverdue) {
      return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20';
    }

    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const getDaysText = (days: number, isOverdue: boolean) => {
    if (isOverdue) {
      return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
    } else if (days === 0) {
      return 'Due today';
    } else if (days === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${days} day${days !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_10%)]">Upcoming Deadlines</h2>

      {deadlines.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={`p-4 rounded-lg shadow-sm ${getPriorityColor(deadline.priority, deadline.is_overdue)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_10%)]">{deadline.title}</h3>
                  <div className="mt-1 flex items-center space-x-4 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deadline.is_overdue
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : deadline.priority === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : deadline.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    } [text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_15%)]`}>
                      {deadline.priority}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 [text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_15%)]">
                      {formatDate(deadline.due_date)}
                    </span>
                    {deadline.reminder && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Reminder
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  deadline.is_overdue
                    ? 'text-red-600 dark:text-red-400'
                    : deadline.days_until_due <= 1
                      ? 'text-red-600 dark:text-red-400'
                      : deadline.days_until_due <= 3
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-green-600 dark:text-green-400'
                } [text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_15%)]`}>
                  {getDaysText(deadline.days_until_due, deadline.is_overdue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
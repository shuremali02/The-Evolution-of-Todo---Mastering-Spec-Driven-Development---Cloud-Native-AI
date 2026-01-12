/**
 * Task: T003, T009, T010, T011
 * Spec: 006 Dashboard
 */

'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DashboardStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  tasks_due_today: number;
  tasks_completed_today: number;
  tasks_completed_week: number;
  tasks_completed_last_week: number;
  streak_days: number;
  average_completion_time: number;
  high_priority_tasks?: number;
  medium_priority_tasks?: number;
  low_priority_tasks?: number;
}

interface TaskStatsCardProps {
  stats: DashboardStats;
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444'];

export const TaskStatsCard: React.FC<TaskStatsCardProps> = ({ stats }) => {
  const data = [
    { name: 'Completed', value: stats.completed_tasks },
    { name: 'Pending', value: stats.pending_tasks },
    { name: 'Overdue', value: stats.overdue_tasks },
  ];

  // Calculate completion percentage
  const completionPercentage = stats.total_tasks > 0
    ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
    : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task Overview</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
            Today
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
            This Week
          </button>
          <button className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 rounded-md text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50">
            Overdue
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : '0'}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Completion Rate</h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-right">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {completionPercentage}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total_tasks}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed_tasks}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending_tasks}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">Overdue</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue_tasks}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
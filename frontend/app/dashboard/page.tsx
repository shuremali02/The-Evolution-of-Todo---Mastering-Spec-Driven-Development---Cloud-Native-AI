/**
 * Task: T001
 * Spec: 006 Dashboard
 */

'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { TaskStatsCard } from '@/components/Dashboard/TaskStatsCard';
import { ActivityFeed } from '@/components/Dashboard/ActivityFeed';
import { DeadlineList } from '@/components/Dashboard/DeadlineList';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { useDashboardData } from '@/hooks/useDashboardData';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex justify-center items-center h-full min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <ErrorState
          message={error}
          onRetry={refetch}
          title="Dashboard Error"
        />
      </AuthGuard>
    );
  }

  if (!data) {
    return (
      <AuthGuard>
        <ErrorState
          message="No dashboard data available"
          onRetry={refetch}
          title="No Data"
        />
      </AuthGuard>
    );
  }

  const { stats, recent_activity, upcoming_deadlines } = data;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back! Here's your overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </header>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Total Tasks</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total_tasks}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Completed Today</h3>
              <p className="text-3xl font-bold text-green-600">{stats.tasks_completed_today}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Overdue Tasks</h3>
              <p className="text-3xl font-bold text-red-600">{stats.overdue_tasks}</p>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (60% width on larger screens) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Task Overview Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <TaskStatsCard stats={stats} />
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <ActivityFeed activities={recent_activity} />
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <DeadlineList deadlines={upcoming_deadlines} />
              </div>
            </div>

            {/* Right Column (40% width on larger screens) */}
            <div className="space-y-8">
              {/* Quick Actions Panel */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <QuickActions />
              </div>

              {/* Productivity Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Productivity Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This Week vs Last Week</p>
                    <p className="text-xl font-semibold">
                      {stats.tasks_completed_week} vs {stats.tasks_completed_last_week}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completion Streak</p>
                    <p className="text-xl font-semibold text-orange-600">{stats.streak_days} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Completion Time</p>
                    <p className="text-xl font-semibold">{stats.average_completion_time.toFixed(1)} hrs</p>
                  </div>
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">High Priority</span>
                    <span className="font-medium text-red-600">{stats.high_priority_tasks || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Medium Priority</span>
                    <span className="font-medium text-yellow-600">{stats.medium_priority_tasks || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Low Priority</span>
                    <span className="font-medium text-green-600">{stats.low_priority_tasks || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
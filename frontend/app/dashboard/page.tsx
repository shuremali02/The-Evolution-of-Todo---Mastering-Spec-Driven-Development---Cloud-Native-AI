/**
 * Task: T001
 * Spec: 006 Dashboard
 */

'use client';

import { TaskStatsCard } from '@/components/Dashboard/TaskStatsCard';
import { ActivityFeed } from '@/components/Dashboard/ActivityFeed';
import { DeadlineList } from '@/components/Dashboard/DeadlineList';
import { QuickActions } from '@/components/Dashboard/QuickActions';
import { useDashboardData } from '@/hooks/useDashboardData';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { format } from 'date-fns';
import { WelcomeMessage } from '@/components/Dashboard/WelcomeMessage';
import { QuickTaskForm } from '@/components/QuickTaskForm';
import { FadeInWhenVisible, StaggerContainer, StaggerChild } from '@/components/ScrollAnimations';
import { FloatingChatIcon } from '@/components/FloatingChatIcon';

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={refetch}
        title="Dashboard Error"
      />
    );
  }

  if (!data) {
    return (
      <ErrorState
        message="No dashboard data available"
        onRetry={refetch}
        title="No Data"
      />
    );
  }

  const { stats, recent_activity, upcoming_deadlines } = data;

  return (
    <div className="relative">
      <FloatingChatIcon />
      <FadeInWhenVisible className="min-h-screen bg-gray-50 dark:bg-gray-900" distance={30}>
        {/* Header Section */}
        <FadeInWhenVisible className="mb-8" distance={30}>
          <header>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              <WelcomeMessage />
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </header>
        </FadeInWhenVisible>

        {/* Stats Summary */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" staggerChildren={0.1}>
          <StaggerChild>
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow p-6" distance={30}>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Total Tasks</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total_tasks}</p>
            </FadeInWhenVisible>
          </StaggerChild>
          <StaggerChild>
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow p-6" distance={30}>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Completed Today</h3>
              <p className="text-3xl font-bold text-green-600">{stats.tasks_completed_today}</p>
            </FadeInWhenVisible>
          </StaggerChild>
          <StaggerChild>
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow p-6" distance={30}>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Overdue Tasks</h3>
              <p className="text-3xl font-bold text-red-600">{stats.overdue_tasks}</p>
            </FadeInWhenVisible>
          </StaggerChild>
        </StaggerContainer>

        {/* Main Dashboard Layout */}
        <FadeInWhenVisible className="grid grid-cols-1 lg:grid-cols-3 gap-8" distance={30} delay={0.2}>
          {/* Left Column (60% width on larger screens) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Task Overview Card */}
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow" distance={30} delay={0.3}>
              <TaskStatsCard stats={stats} />
            </FadeInWhenVisible>

            {/* Recent Activity Feed */}
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow" distance={30} delay={0.4}>
              <ActivityFeed activities={recent_activity} />
            </FadeInWhenVisible>

            {/* Upcoming Deadlines */}
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow" distance={30} delay={0.5}>
              <DeadlineList deadlines={upcoming_deadlines} />
            </FadeInWhenVisible>
          </div>

          {/* Right Column (40% width on larger screens) */}
          <div className="space-y-8">
            {/* Quick Task Form */}
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow" distance={30} delay={0.3}>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Task</h3>
                <QuickTaskForm
                  onSuccess={() => {
                    // Refetch dashboard data to update stats after task creation
                    refetch();
                  }}
                />
              </div>
            </FadeInWhenVisible>

            {/* Quick Actions Panel */}
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow" distance={30} delay={0.4}>
              <QuickActions />
            </FadeInWhenVisible>

            {/* Productivity Stats */}
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow p-6" distance={30} delay={0.5}>
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
            </FadeInWhenVisible>

            {/* Priority Distribution */}
            <FadeInWhenVisible className="bg-white dark:bg-gray-800 rounded-lg shadow p-6" distance={30} delay={0.6}>
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
            </FadeInWhenVisible>
          </div>
        </FadeInWhenVisible>
      </FadeInWhenVisible>
    </div>
  );
}
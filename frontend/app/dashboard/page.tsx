/**
 * Task: T060, T061, T062, T063, T064, T065, T066, T067, T068
 * Spec: 012-AI-Powered UI Enhancements
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
import { AIDashboardOverview } from '@/components/AIDashboardOverview';

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
      <FadeInWhenVisible className="min-h-screen bg-gradient-ai" distance={30}>
        {/* Header Section */}
        <FadeInWhenVisible className="mb-8" distance={30}>
          <header>
            <h1 className="text-3xl font-bold text-white mb-2 [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)] dark:[text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]">
              <WelcomeMessage />
            </h1>
            <p className="text-white/80 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </header>
        </FadeInWhenVisible>

        {/* AI-Powered Insights */}
        <FadeInWhenVisible className="mb-8" distance={30} delay={0.1}>
          <AIDashboardOverview dashboardData={data} loading={loading} />
        </FadeInWhenVisible>

        {/* Stats Summary */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" staggerChildren={0.1}>
          <StaggerChild>
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/20" distance={30}>
              <h3 className="text-lg font-medium text-white mb-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Total Tasks</h3>
              <p className="text-3xl font-bold text-blue-300 [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)] dark:[text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]">{stats.total_tasks}</p>
            </FadeInWhenVisible>
          </StaggerChild>
          <StaggerChild>
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/20" distance={30}>
              <h3 className="text-lg font-medium text-white mb-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Completed Today</h3>
              <p className="text-3xl font-bold text-green-300 [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)] dark:[text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]">{stats.tasks_completed_today}</p>
            </FadeInWhenVisible>
          </StaggerChild>
          <StaggerChild>
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/20" distance={30}>
              <h3 className="text-lg font-medium text-white mb-2 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Overdue Tasks</h3>
              <p className="text-3xl font-bold text-red-300 [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)] dark:[text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]">{stats.overdue_tasks}</p>
            </FadeInWhenVisible>
          </StaggerChild>
        </StaggerContainer>

        {/* Main Dashboard Layout */}
        <FadeInWhenVisible className="grid grid-cols-1 lg:grid-cols-3 gap-8" distance={30} delay={0.2}>
          {/* Left Column (60% width on larger screens) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Task Overview Card */}
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20" distance={30} delay={0.3}>
              <TaskStatsCard stats={stats} />
            </FadeInWhenVisible>

            {/* Recent Activity Feed */}
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20" distance={30} delay={0.4}>
              <ActivityFeed activities={recent_activity} />
            </FadeInWhenVisible>

            {/* Upcoming Deadlines */}
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20" distance={30} delay={0.5}>
              <DeadlineList deadlines={upcoming_deadlines} />
            </FadeInWhenVisible>
          </div>

          {/* Right Column (40% width on larger screens) */}
          <div className="space-y-8">
            {/* Quick Task Form */}
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20" distance={30} delay={0.3}>
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Create New Task</h3>
                <QuickTaskForm
                  onSuccess={() => {
                    // Refetch dashboard data to update stats after task creation
                    refetch();
                  }}
                />
              </div>
            </FadeInWhenVisible>

            {/* Quick Actions Panel */}
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20" distance={30} delay={0.4}>
              <QuickActions />
            </FadeInWhenVisible>

            {/* Productivity Stats */}
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6" distance={30} delay={0.5}>
              <h3 className="text-lg font-medium text-white mb-4 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Productivity Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/70 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">This Week vs Last Week</p>
                  <p className="text-xl font-semibold text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">
                    {stats.tasks_completed_week} vs {stats.tasks_completed_last_week}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/70 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Completion Streak</p>
                  <p className="text-xl font-semibold text-orange-300 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">{stats.streak_days} days</p>
                </div>
                <div>
                  <p className="text-sm text-white/70 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Avg. Completion Time</p>
                  <p className="text-xl font-semibold text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">{stats.average_completion_time.toFixed(1)} hrs</p>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Priority Distribution */}
            <FadeInWhenVisible className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 p-6" distance={30} delay={0.6}>
              <h3 className="text-lg font-medium text-white mb-4 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Priority Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">High Priority</span>
                  <span className="font-medium text-red-300 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">{stats.high_priority_tasks || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Medium Priority</span>
                  <span className="font-medium text-yellow-300 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">{stats.medium_priority_tasks || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">Low Priority</span>
                  <span className="font-medium text-green-300 [text-shadow:_0_1px_2px_rgb(0_0_0_/_60%)] dark:[text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">{stats.low_priority_tasks || 0}</span>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </FadeInWhenVisible>
      </FadeInWhenVisible>
    </div>
  );
}
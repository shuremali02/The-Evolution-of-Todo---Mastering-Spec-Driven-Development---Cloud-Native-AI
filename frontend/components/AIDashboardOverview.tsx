/**
 * Task: T060, T061, T062, T063, T064, T065, T066, T067, T068
 * Spec: 012-AI-Powered UI Enhancements
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiClock, FiCheckCircle, FiZap, FiActivity, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { DashboardResponse } from '@/types/dashboard';

interface AIMetricDisplay {
  id: string;
  metricType: 'productivity-boost' | 'automated-tasks' | 'priority-tasks' | 'ai-status' | 'ai-suggestions' | 'intelligent-insights';
  currentValue: number;
  previousValue?: number;
  trend?: 'positive' | 'negative' | 'neutral';
  displayFormat: 'percentage' | 'count' | 'status' | 'ratio';
  lastUpdated: string;
  title: string;
  description: string;
}

interface AIDashboardOverviewProps {
  dashboardData: DashboardResponse | null;
  loading?: boolean;
}

export const AIDashboardOverview: React.FC<AIDashboardOverviewProps> = ({
  dashboardData,
  loading = false
}) => {
  // Simulate AI-powered metrics based on dashboard data
  const aiMetrics: AIMetricDisplay[] = [
    {
      id: 'productivity-boost',
      metricType: 'productivity-boost',
      currentValue: dashboardData?.stats.tasks_completed_last_week
        ? Math.round(((dashboardData.stats.tasks_completed_week - dashboardData.stats.tasks_completed_last_week) / dashboardData.stats.tasks_completed_last_week) * 100)
        : 12,
      previousValue: 8,
      trend: 'positive',
      displayFormat: 'percentage',
      lastUpdated: new Date().toISOString(),
      title: 'Productivity Boost',
      description: 'Increase in task completion rate compared to last week'
    },
    {
      id: 'automated-tasks',
      metricType: 'automated-tasks',
      currentValue: 15, // Simulated value
      previousValue: 12,
      trend: 'positive',
      displayFormat: 'count',
      lastUpdated: new Date().toISOString(),
      title: 'Automated Tasks',
      description: 'Tasks managed automatically by AI recommendations'
    },
    {
      id: 'priority-tasks',
      metricType: 'priority-tasks',
      currentValue: dashboardData?.stats.high_priority_tasks || 5,
      previousValue: 7,
      trend: 'negative', // Less high priority tasks is positive
      displayFormat: 'count',
      lastUpdated: new Date().toISOString(),
      title: 'Optimized Priorities',
      description: 'High priority tasks based on AI analysis'
    },
    {
      id: 'ai-suggestions',
      metricType: 'ai-suggestions',
      currentValue: 8,
      previousValue: 6,
      trend: 'positive',
      displayFormat: 'count',
      lastUpdated: new Date().toISOString(),
      title: 'AI Suggestions',
      description: 'Intelligent suggestions implemented this week'
    }
  ];

  // Calculate productivity trend
  const getProductivityTrend = (metric: AIMetricDisplay) => {
    if (metric.trend === 'positive') {
      return <FiTrendingUp className="text-green-500" />;
    } else if (metric.trend === 'negative') {
      return <FiTrendingDown className="text-red-500" />;
    }
    return <FiBarChart2 className="text-gray-500" />;
  };

  // Format value based on display format
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage':
        return `${value >= 0 ? '+' : ''}${value}%`;
      case 'count':
        return value.toString();
      default:
        return value.toString();
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-gradient-ai p-6 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="animate-pulse">
              <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-white/20 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-full"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <FiActivity className="text-2xl text-blue-400" />
        <h2 className="text-2xl font-bold text-white">AI-Powered Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            className="bg-gradient-ai p-6 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm glow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-lg">
                {metric.metricType === 'productivity-boost' && <FiZap className="text-xl text-yellow-300" />}
                {metric.metricType === 'automated-tasks' && <FiClock className="text-xl text-blue-300" />}
                {metric.metricType === 'priority-tasks' && <FiBarChart2 className="text-xl text-purple-300" />}
                {metric.metricType === 'ai-suggestions' && <FiCheckCircle className="text-xl text-green-300" />}
              </div>
              {metric.trend && (
                <div className="text-lg">
                  {getProductivityTrend(metric)}
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{metric.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {formatValue(metric.currentValue, metric.displayFormat)}
              </span>
              {metric.previousValue !== undefined && (
                <span className={`text-sm ${
                  ((metric.displayFormat === 'percentage' && metric.currentValue > metric.previousValue) ||
                   (metric.displayFormat === 'count' &&
                    (['automated-tasks', 'ai-suggestions'].includes(metric.metricType) && metric.currentValue > metric.previousValue) ||
                    (['priority-tasks'].includes(metric.metricType) && metric.currentValue < metric.previousValue)))
                  ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatValue(
                    metric.displayFormat === 'percentage'
                      ? metric.currentValue - metric.previousValue
                      : metric.currentValue - metric.previousValue,
                    'percentage'
                  )}
                </span>
              )}
            </div>
            <p className="text-sm text-white/80 mt-2">{metric.description}</p>

            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center text-xs text-white/60">
                <FiActivity className="mr-1" />
                <span>AI Analysis</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Assistant Status Card */}
      <motion.div
        className="mt-6 bg-gradient-ai p-6 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/10 rounded-full">
            <FiActivity className="text-2xl text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Assistant Status</h3>
            <p className="text-white/80">Active and analyzing your tasks for optimization</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Online</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiZap className="text-yellow-300" />
              <span className="text-white/80 text-sm">Suggestions Today</span>
            </div>
            <div className="text-2xl font-bold text-white">5</div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className="text-green-300" />
              <span className="text-white/80 text-sm">Tasks Optimized</span>
            </div>
            <div className="text-2xl font-bold text-white">12</div>
          </div>

          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp className="text-blue-300" />
              <span className="text-white/80 text-sm">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-white">94%</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
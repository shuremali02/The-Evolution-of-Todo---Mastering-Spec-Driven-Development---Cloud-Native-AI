/**
 * Task: T007, T011
 * Spec: 006 Dashboard
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import {
  DashboardStats,
  RecentActivityItem,
  UpcomingDeadlineItem,
  DashboardResponse
} from '@/types/dashboard';

interface UseDashboardDataReturn {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [stats, recentActivity, upcomingDeadlines] = await Promise.all([
        apiClient.getTaskStats(),
        apiClient.getRecentActivity(),
        apiClient.getUpcomingDeadlines()
      ]);

      // Combine all data into a single response object
      const dashboardData: DashboardResponse = {
        stats,
        recent_activity: recentActivity,
        upcoming_deadlines: upcomingDeadlines,
        priority_distribution: {
          low: stats.low_priority_tasks || 0,
          medium: stats.medium_priority_tasks || 0,
          high: stats.high_priority_tasks || 0
        }
      };

      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
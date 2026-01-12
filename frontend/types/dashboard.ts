/**
 * Task: T035
 * Spec: 006 Dashboard
 */

export interface DashboardStats {
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

export interface RecentActivityItem {
  id: string;
  type: 'task_created' | 'task_completed' | 'task_updated' | 'task_deleted';
  task_id: string;
  task_title: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string; // ISO date string
  description: string;
}

export interface UpcomingDeadlineItem {
  id: string;
  task_id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string; // ISO date string
  days_until_due: number;
  is_overdue: boolean;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recent_activity: RecentActivityItem[];
  upcoming_deadlines: UpcomingDeadlineItem[];
  priority_distribution: {
    low: number;
    medium: number;
    high: number;
  };
}
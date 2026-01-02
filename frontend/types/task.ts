/**
 * Task: T017
 * Spec: 005-task-management-ui/task-ui/spec.md - Task TypeScript Interfaces with UI Enhancements
 */

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: string;
  priority: TaskPriority;
  due_date: string | null; // ISO 8601 timestamp
  position: number;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
  completed?: boolean;
}

export interface TaskReorder {
  task_ids: string[];
}

/**
 * Task: T003
 * Spec: 005-task-management-ui - Formatting Utilities
 */

import type { Task } from '@/types/task'

/**
 * Format a date string into a readable format
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string (e.g., "Jan 1, 2026")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a date string into time format
 * @param dateString - ISO 8601 date string
 * @returns Formatted time string (e.g., "10:30 AM")
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a date string into full datetime format
 * @param dateString - ISO 8601 date string
 * @returns Formatted datetime string (e.g., "Jan 1, 2026 at 10:30 AM")
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get relative time string (e.g., "2 hours ago", "Yesterday")
 * @param dateString - ISO 8601 date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) {
    return 'yesterday'
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks === 1) {
    return '1 week ago'
  }

  if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`
  }

  // Default to date format for older dates
  return formatDate(dateString)
}

/**
 * Get relative time for task created/updated
 * @param task - Task object
 * @param field - Which timestamp to use ('created_at' | 'updated_at')
 * @returns Relative time string
 */
export function formatTaskTime(task: Task, field: 'created_at' | 'updated_at' = 'created_at'): string {
  return formatRelativeTime(task[field])
}

/**
 * Format task count for display
 * @param count - Number of tasks
 * @param completedCount - Number of completed tasks (optional)
 * @returns Formatted count string
 */
export function formatTaskCount(count: number, completedCount?: number): string {
  if (completedCount !== undefined) {
    return `${completedCount} of ${count} completed`
  }
  return count === 1 ? '1 task' : `${count} tasks`
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Get completion status badge text
 * @param completed - Whether task is completed
 * @returns Status text
 */
export function getCompletionStatus(completed: boolean): string {
  return completed ? 'Completed' : 'Pending'
}

/**
 * Get completion status class for styling
 * @param completed - Whether task is completed
 * @returns Tailwind CSS classes for status badge
 */
export function getCompletionStatusClass(completed: boolean): string {
  return completed
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'
}

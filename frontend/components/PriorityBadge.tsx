/**
 * Task: T020
 * Spec: 005-task-management-ui/task-ui/spec.md - PriorityBadge Component
 *
 * Color-coded priority badge with:
 * - High: Red
 * - Medium: Yellow/Orange
 * - Low: Gray/Blue
 */

'use client'

import type { TaskPriority } from '@/types/task'

interface PriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const priorityConfig = {
    high: {
      text: 'High',
      bg: 'bg-red-100',
      textClass: 'text-red-800',
      border: 'border-red-200',
    },
    medium: {
      text: 'Medium',
      bg: 'bg-yellow-100',
      textClass: 'text-yellow-800',
      border: 'border-yellow-200',
    },
    low: {
      text: 'Low',
      bg: 'bg-blue-100',
      textClass: 'text-blue-800',
      border: 'border-blue-200',
    },
  }[priority]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${priorityConfig.bg} ${priorityConfig.textClass} ${priorityConfig.border} ${className}`}
      aria-label={`Priority: ${priorityConfig.text}`}
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      {priorityConfig.text}
    </span>
  )
}
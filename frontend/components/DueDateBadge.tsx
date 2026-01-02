/**
 * Task: T030
 * Spec: 005-task-management-ui/task-ui/spec.md - DueDateBadge Component
 *
 * Date display with overdue/today/soon indicators using date-fns
 */

'use client'

import { format, isToday, isTomorrow, isAfter, parseISO } from 'date-fns'

interface DueDateBadgeProps {
  dueDate: string | null
  className?: string
}

export function DueDateBadge({ dueDate, className = '' }: DueDateBadgeProps) {
  if (!dueDate) {
    return null
  }

  const date = parseISO(dueDate)
  const isOverdue = isAfter(new Date(), date) && !isToday(date)
  const isTodayDate = isToday(date)
  const isTomorrowDate = isTomorrow(date)

  let dateText = format(date, 'MMM d, yyyy')
  let badgeStyle = 'bg-gray-100 text-gray-800 border-gray-200'

  if (isOverdue) {
    dateText = `Overdue: ${dateText}`
    badgeStyle = 'bg-red-100 text-red-800 border-red-200'
  } else if (isTodayDate) {
    dateText = 'Today'
    badgeStyle = 'bg-blue-100 text-blue-800 border-blue-200'
  } else if (isTomorrowDate) {
    dateText = 'Tomorrow'
    badgeStyle = 'bg-amber-100 text-amber-800 border-amber-200'
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${badgeStyle} ${className}`}
      aria-label={`Due date: ${format(date, 'MMM d, yyyy')}`}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {dateText}
    </span>
  )
}
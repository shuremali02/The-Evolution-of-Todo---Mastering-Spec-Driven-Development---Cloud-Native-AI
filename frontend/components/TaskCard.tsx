/**
 * Task: T002, T014, T017, T034, T035
 * Spec: 005-task-management-ui/tasks.md - Task Card Component (Clean UI)
 *
 * Clean task card with:
 * - Status colors (gray for pending, green for completed)
 * - Simple hover effects
 * - Professional look
 */

'use client'

import { useState, useEffect } from 'react'
import type { Task } from '@/types/task'
import { formatRelativeTime, formatDateTime } from '@/lib/format'
import { PriorityBadge } from '@/components/PriorityBadge'
import { DueDateBadge } from '@/components/DueDateBadge'

interface TaskCardProps {
  task: Task
  onComplete: (id: string) => Promise<void>
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  loadingOperations?: {
    complete?: boolean
    delete?: boolean
  }
}

export function TaskCard({
  task,
  onComplete,
  onDelete,
  onEdit,
  loadingOperations = {},
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    if (isCompleting) return
    setIsCompleting(true)
    try {
      await onComplete(task.id)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = () => {
    if (loadingOperations.delete) return
    setIsDeleting(true)
    try {
      onDelete(task.id)
    } finally {
      // Keep isDeleting true until parent clears it via loadingOperations.delete
    }
  }

  const handleEdit = () => {
    onEdit(task)
  }

  const handleCheckboxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isCompleting && !task.completed) {
        handleComplete()
      }
    }
  }

  // Sync local state with loadingOperations prop
  useEffect(() => {
    if (!loadingOperations.delete) {
      setIsDeleting(false)
    }
  }, [loadingOperations.delete])

  useEffect(() => {
    if (!loadingOperations.complete) {
      setIsCompleting(false)
    }
  }, [loadingOperations.complete])

  const isLoading = isCompleting || isDeleting
  const isPending = !task.completed

  // Status color classes
  const statusConfig = task.completed
    ? {
        border: 'border-green-200 bg-green-50/50',
        checkbox: 'text-green-600 focus:ring-green-500',
        badge: 'bg-green-100 text-green-700',
        icon: (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      }
    : {
        border: 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md',
        checkbox: 'text-blue-600 focus:ring-blue-500',
        badge: 'bg-blue-100 text-blue-700',
        icon: null,
      }

  return (
    <article
      className={`group flex items-start gap-4 p-4 rounded-lg border transition-all ${
        statusConfig.border
      } ${isLoading ? 'opacity-50' : ''}`}
      aria-labelledby={`task-title-${task.id}`}
    >
      {/* Checkbox */}
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleComplete}
          disabled={isCompleting || isDeleting}
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          className={`w-5 h-5 rounded border-gray-300 ${statusConfig.checkbox} focus:ring-2 cursor-pointer disabled:cursor-not-allowed transition-colors`}
          onKeyDown={handleCheckboxKeyDown}
        />
        {isCompleting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.badge}`}>
                {task.completed ? 'Completed' : 'Active'}
              </span>
              <PriorityBadge priority={task.priority} />
              <DueDateBadge dueDate={task.due_date} />
              {task.reminder && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reminder
                </span>
              )}
            </div>
            <h3
              id={`task-title-${task.id}`}
              className={`font-medium truncate ${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm line-clamp-2 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400" title={formatDateTime(task.created_at)}>
              {formatRelativeTime(task.created_at)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isPending && (
              <button
                type="button"
                onClick={handleEdit}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                aria-label={`Edit ${task.title}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              aria-label={`Delete ${task.title}`}
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

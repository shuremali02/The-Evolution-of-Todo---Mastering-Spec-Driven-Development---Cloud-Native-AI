/**
 * Task: T021
 * Spec: 005-task-management-ui/tasks.md - Task Form Component with Priority & Due Date
 *
 * Professional task form with:
 * - Clean, minimal styling
 * - Focus states
 * - Form validation
 * - Loading indicators
 * - Priority selector
 * - Due date picker
 */

'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { validateTitle, validateDescription } from '@/lib/validation'
import type { TaskPriority } from '@/types/task'
import { LoadingSpinner } from './LoadingSpinner'
import { useFormValidation } from '@/hooks/useFormValidation'

interface TaskFormProps {
  /** Optional initial data for edit mode */
  initialData?: {
    title: string
    description: string | null
    priority?: TaskPriority
    due_date?: string | null
  }
  /** Callback when form is submitted */
  onSubmit: (data: { title: string; description: string | null; priority?: TaskPriority; due_date?: string | null }) => Promise<void>
  /** Callback when form is cancelled */
  onCancel: () => void
  /** Label for the submit button */
  submitLabel?: string
  /** Whether the form is in loading state */
  loading?: boolean
}

const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
]

export function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  loading = false,
}: TaskFormProps) {
  // Use local state for form values
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData?.due_date?.split('T')[0] || '');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!initialData;

  // Auto-focus title field when form appears
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // Reset form when switching to create mode (when initialData is null/undefined)
  useEffect(() => {
    if (!initialData) {
      // Creating new task - reset to empty values
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!title.trim()) {
      setFormError('Title is required');
      titleInputRef.current?.focus();
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      const data = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      };
      await onSubmit(data);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Submission failed');
      setIsSubmitting(false);
    }
  };

  // Combined loading state (prop + local)
  const isLoading = loading || isSubmitting;
  const isFormValid = title.trim().length > 0;

  return (
    <div
      className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      role="form"
      aria-label={isEditMode ? 'Edit task form' : 'Create task form'}
    >
      {/* Form header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white" id="task-form-title">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} aria-labelledby="task-form-title" className="p-6">
        {formError && (
          <div
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {formError}
            </div>
          </div>
        )}

        {/* Title Field */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Title <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            ref={titleInputRef}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            required
            disabled={isLoading}
            placeholder="What needs to be done?"
            aria-required="true"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              title && title.trim() === '' ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          />
          <p id="title-counter" className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            {title.length}/200 characters
          </p>
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Description <span className="text-gray-400 dark:text-gray-500 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={3}
            disabled={isLoading}
            placeholder="Add more details about this task..."
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
          />
          <p id="description-counter" className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            {description.length}/1000 characters
          </p>
        </div>

        {/* Priority and Due Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Priority Selector */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date Picker */}
          <div>
            <label
              htmlFor="due_date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3" role="group" aria-label="Form actions">
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            aria-busy={isLoading}
          >
            {isLoading && <LoadingSpinner size="sm" label="" />}
            {isLoading ? 'Saving...' : submitLabel}
          </button>

          {!isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Required field note for screen readers */}
        <p className="sr-only">Required field indicated by asterisk</p>
      </form>
    </div>
  )
}

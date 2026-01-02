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

import { useState, useEffect, useRef } from 'react'
import { validateTitle, validateDescription } from '@/lib/validation'
import type { TaskPriority } from '@/types/task'

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
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium')
  const [dueDate, setDueDate] = useState(initialData?.due_date?.split('T')[0] || '')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const isEditMode = !!initialData

  // Auto-focus title field when form appears
  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  // Sync form with initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description || '')
      setPriority(initialData.priority || 'medium')
      setDueDate(initialData.due_date?.split('T')[0] || '')
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
    }
  }, [initialData])

  // Clear errors when user types
  const handleTitleChange = (value: string) => {
    setTitle(value)
    setTitleError(null)
    setFormError(null)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    setDescriptionError(null)
    setFormError(null)
  }

  // Validate on blur
  const handleTitleBlur = () => {
    const result = validateTitle(title)
    setTitleError(result.error ?? null)
  }

  const handleDescriptionBlur = () => {
    const result = validateDescription(description)
    setDescriptionError(result.error ?? null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const titleResult = validateTitle(title)
    const descResult = validateDescription(description)

    setTitleError(titleResult.error ?? null)
    setDescriptionError(descResult.error ?? null)

    if (!titleResult.isValid) {
      titleInputRef.current?.focus()
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)
      const data = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      }
      await onSubmit(data)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Submission failed')
      setIsSubmitting(false)
    }
  }

  // Combined loading state (prop + local)
  const isLoading = loading || isSubmitting
  const isFormValid = title.trim().length > 0 && !titleError && !descriptionError

  return (
    <div
      className="mb-6 bg-white rounded-lg border border-gray-200"
      role="form"
      aria-label={isEditMode ? 'Edit task form' : 'Create task form'}
    >
      {/* Form header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900" id="task-form-title">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} aria-labelledby="task-form-title" className="p-6">
        {formError && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
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
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Title <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            ref={titleInputRef}
            type="text"
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={handleTitleBlur}
            maxLength={200}
            required
            disabled={isLoading}
            placeholder="What needs to be done?"
            aria-required="true"
            aria-invalid={!!titleError}
            aria-describedby={titleError ? 'title-error' : 'title-counter'}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors ${
              titleError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {titleError ? (
            <p id="title-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {titleError}
            </p>
          ) : (
            <p id="title-counter" className="mt-1.5 text-xs text-gray-400">
              {title.length}/200 characters
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Description <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onBlur={handleDescriptionBlur}
            maxLength={1000}
            rows={3}
            disabled={isLoading}
            placeholder="Add more details about this task..."
            aria-invalid={!!descriptionError}
            aria-describedby={descriptionError ? 'description-error' : 'description-counter'}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors ${
              descriptionError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {descriptionError ? (
            <p id="description-error" className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {descriptionError}
            </p>
          ) : (
            <p id="description-counter" className="mt-1.5 text-xs text-gray-400">
              {description.length}/1000 characters
            </p>
          )}
        </div>

        {/* Priority and Due Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Priority Selector */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors bg-white"
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
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
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
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            )}
            {isLoading ? 'Saving...' : submitLabel}
          </button>

          {!isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
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

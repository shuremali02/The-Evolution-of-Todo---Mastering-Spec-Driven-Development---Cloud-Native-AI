/**
 * Task: T007
 * Spec: 005-task-management-ui/tasks.md - EmptyState Component
 *
 * Displays a friendly empty state when no tasks exist.
 * Includes a call-to-action to create the first task.
 */

'use client'

interface EmptyStateProps {
  /** Title to display (default: "No tasks yet") */
  title?: string
  /** Description text (default: helpful message) */
  description?: string
  /** Icon name for SVG display */
  icon?: 'checklist' | 'search' | 'filter' | 'task'
  /** Label for the action button */
  actionLabel?: string
  /** Callback when action button is clicked */
  onAction?: () => void
  /** Whether to show the action button */
  showAction?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Get SVG icon component based on icon name
 */
function getIcon(iconName: string) {
  const icons: Record<string, JSX.Element> = {
    checklist: (
      <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    search: (
      <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    filter: (
      <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
    task: (
      <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  }
  return icons[iconName] || icons.task
}

/**
 * EmptyState component for displaying when no content exists.
 *
 * **Default Content**:
 * - Title: "No tasks yet"
 * - Description: "Create your first task to get started!"
 * - Icon: checklist
 * - Action: "Create Task" button
 *
 * **Usage**:
 * ```tsx
 * <EmptyState
 *   onAction={() => setShowForm(true)}
 * />
 * ```
 */
export function EmptyState({
  title = 'No tasks yet',
  description = 'Create your first task to get started!',
  icon = 'task',
  actionLabel = 'Create Task',
  onAction,
  showAction = true,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-12 text-center ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Icon */}
      <div className="mb-6" aria-hidden="true">
        {getIcon(icon)}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>

      {/* Action Button */}
      {showAction && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label={actionLabel}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/**
 * Empty state for search results with no matches
 */
export function EmptySearchState({
  searchTerm,
  onClear,
}: {
  searchTerm: string
  onClear: () => void
}) {
  return (
    <EmptyState
      title="No tasks found"
      description={`No tasks match "${searchTerm}". Try a different search term or clear the filter.`}
      icon="search"
      actionLabel="Clear Search"
      onAction={onClear}
    />
  )
}

/**
 * Empty state for filtered views with no results
 */
export function EmptyFilterState({
  filterName,
  onClear,
}: {
  filterName: string
  onClear: () => void
}) {
  return (
    <EmptyState
      title={`No ${filterName} tasks`}
      description={`You don't have any ${filterName.toLowerCase()} tasks at the moment.`}
      icon="filter"
      actionLabel="View All Tasks"
      onAction={onClear}
    />
  )
}

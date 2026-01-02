/**
 * Task: T008
 * Spec: 005-task-management-ui/tasks.md - ErrorState Component
 *
 * Displays error state with retry option when operations fail.
 */

'use client'

interface ErrorStateProps {
  /** Error message to display */
  message: string
  /** Title for the error state */
  title?: string
  /** Callback when retry button is clicked */
  onRetry?: () => void
  /** Label for the retry button */
  retryLabel?: string
  /** Whether to show the retry button */
  showRetry?: boolean
  /** Additional error details (optional) */
  details?: string
  /** Error icon name */
  icon?: 'warning' | 'network' | 'auth' | 'error'
  /** Callback for dismiss action */
  onDismiss?: () => void
  /** Whether this is a dismissible error */
  dismissible?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Get SVG icon component based on icon name
 */
function getIcon(iconName: string): JSX.Element {
  const icons: Record<string, JSX.Element> = {
    warning: (
      <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    network: (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    auth: (
      <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }
  return icons[iconName] || icons.error
}

/**
 * ErrorState component for displaying error messages with optional retry.
 *
 * **Features**:
 * - Displays user-friendly error message
 * - Optional retry button for recoverable errors
 * - Optional dismiss button for non-critical errors
 * - Accessible with proper ARIA attributes
 *
 * **Usage**:
 * ```tsx
 * <ErrorState
 *   message="Failed to load tasks"
 *   onRetry={fetchTasks}
 * />
 * ```
 */
export function ErrorState({
  message,
  title = 'Something went wrong',
  onRetry,
  retryLabel = 'Try Again',
  showRetry = true,
  details,
  icon = 'error',
  onDismiss,
  dismissible = false,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-red-200 p-6 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
          {getIcon(icon)}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>

          {/* Error message */}
          <p className="text-gray-600 text-sm">{message}</p>

          {/* Error details */}
          {details && (
            <p className="text-sm text-gray-500 mt-2">{details}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            {/* Retry button */}
            {showRetry && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                aria-label={retryLabel}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {retryLabel}
              </button>
            )}

            {/* Dismiss button */}
            {dismissible && onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Inline error message for forms
 */
export function ErrorMessage({
  message,
  className = '',
}: {
  message: string | null | undefined
  className?: string
}) {
  if (!message) return null

  return (
    <p
      className={`mt-1 text-sm text-red-600 ${className}`}
      role="alert"
    >
      {message}
    </p>
  )
}

/**
 * Banner error state for page-level errors
 */
export function ErrorBanner({
  message,
  onRetry,
  onDismiss,
}: {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}) {
  return (
    <div
      className="mb-6 p-4 bg-white border border-red-200 rounded-lg"
      role="alert"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-900 font-medium text-sm">{message}</span>
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Network error state with offline indicator
 */
export function NetworkErrorState({
  onRetry,
}: {
  onRetry: () => void
}) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection."
      details="Make sure you're connected to the internet and try again."
      icon="network"
      onRetry={onRetry}
      retryLabel="Retry Connection"
    />
  )
}

/**
 * Authentication error state
 */
export function AuthErrorState({
  message = 'Your session has expired. Please log in again.',
  onLogin,
}: {
  message?: string
  onLogin: () => void
}) {
  return (
    <div
      className="bg-white rounded-lg border border-amber-200 p-6 text-center"
      role="alert"
    >
      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">
        Authentication Required
      </h3>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      <button
        type="button"
        onClick={onLogin}
        className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Go to Login
      </button>
    </div>
  )
}

# Contract: ErrorState Component

**Component**: ErrorState
**File**: `frontend/components/ErrorState.tsx`
**Status**: Design Specification
**Date**: 2026-01-02

## Overview

ErrorState displays a user-friendly error message with retry option when data fetching or operations fail.

## Interface

```typescript
/**
 * Props for ErrorState component.
 */
interface ErrorStateProps {
  /** Error message to display */
  message: string
  /** Optional custom title (default: "Something went wrong") */
  title?: string
  /** Optional custom retry button text (default: "Try again") */
  retryText?: string
  /** Callback when retry button is clicked */
  onRetry: () => void
  /** Optional callback for dismiss action (if dismissible) */
  onDismiss?: () => void
}
```

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `ErrorState` | Component | Default export - main component |
| `ErrorStateProps` | Type | Props interface |

## Behavior

### Rendering

1. **Icon**: Show error/warning icon to indicate failure
2. **Title**: Display "Something went wrong" or custom title
3. **Message**: Display the provided error message
4. **Retry Button**: "Try again" button that triggers onRetry callback
5. **Dismiss Button** (optional): If onDismiss provided, show close button

### Interactions

1. **Retry Click**
   - Call onRetry() callback
   - Typically re-fetches data or retries operation

2. **Dismiss Click** (if provided)
   - Call onDismiss() callback
   - Close/hide the error state

### Default Values

| Prop | Default |
|------|---------|
| title | "Something went wrong" |
| retryText | "Try again" |

## Styling (Tailwind CSS)

```tsx
// Container
<div className="flex flex-col items-center justify-center py-8 px-4 text-center">

  // Error Icon
  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  </div>

  // Title
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    {title || 'Something went wrong'}
  </h3>

  // Message
  <p className="text-gray-500 mb-4 max-w-sm">
    {message}
  </p>

  // Actions
  <div className="flex gap-3">
    // Retry Button
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg
        hover:bg-indigo-700 focus:outline-none focus:ring-2
        focus:ring-offset-2 focus:ring-indigo-500"
    >
      {retryText || 'Try again'}
    </button>

    // Dismiss Button (if provided)
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="px-4 py-2 text-gray-700 bg-white border border-gray-300
          rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2
          focus:ring-offset-2 focus:ring-indigo-500"
      >
        Dismiss
      </button>
    )}
  </div>
</div>
```

## Accessibility

- `aria-live="polite"` on container
- Error icon has `aria-hidden="true"` (decorative)
- Retry button clearly labeled
- `aria-describedby` linking message to container

## Testing Requirements

### Unit Tests

```typescript
describe('ErrorState', () => {
  it('renders with default values', () => {
    render(<ErrorState message="Network error" onRetry={() => {}} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('renders with custom values', () => {
    render(
      <ErrorState
        title="Custom Title"
        message="Custom error message"
        retryText="Retry Now"
        onRetry={() => {}}
      />
    )
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry Now' })).toBeInTheDocument()
  })

  it('calls onRetry when button clicked', () => {
    const onRetry = jest.fn()
    render(<ErrorState message="Error" onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('shows dismiss button when onDismiss provided', () => {
    render(<ErrorState message="Error" onRetry={() => {}} onDismiss={() => {}} />)
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = jest.fn()
    render(<ErrorState message="Error" onRetry={() => {}} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalled()
  })
})
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| react | 18+ | UI rendering |

## Related Components

- **TasksPage**: Uses ErrorState when task fetch fails
- **useTasks hook**: Provides error state that triggers ErrorState

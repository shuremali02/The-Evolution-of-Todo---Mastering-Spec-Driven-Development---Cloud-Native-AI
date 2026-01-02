# Contract: EmptyState Component

**Component**: EmptyState
**File**: `frontend/components/EmptyState.tsx`
**Status**: Design Specification
**Date**: 2026-01-02

## Overview

EmptyState displays a friendly message and call-to-action when the user has no tasks. It encourages first task creation.

## Interface

```typescript
/**
 * Props for EmptyState component.
 */
interface EmptyStateProps {
  /** Optional custom title (default: "No tasks yet") */
  title?: string
  /** Optional custom message (default: message encouraging first task) */
  message?: string
  /** Optional custom button text (default: "Create your first task") */
  buttonText?: string
  /** Callback when action button is clicked */
  onAction: () => void
}
```

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `EmptyState` | Component | Default export - main component |
| `EmptyStateProps` | Type | Props interface |

## Behavior

### Rendering

1. **Icon**: Show a friendly icon (e.g., clipboard/checklist) to indicate empty state
2. **Title**: Display "No tasks yet" or custom title
3. **Message**: Display encouraging message about creating first task
4. **Action Button**: "Create your first task" button that triggers onAction callback

### Interactions

1. **Button Click**
   - Call onAction() callback
   - Typically opens TaskForm in create mode

### Default Values

| Prop | Default |
|------|---------|
| title | "No tasks yet" |
| message | "Get started by creating your first task. What would you like to accomplish?" |
| buttonText | "Create your first task" |

## Styling (Tailwind CSS)

```tsx
// Container
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">

  // Icon
  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  </div>

  // Title
  <h3 className="text-lg font-medium text-gray-900 mb-2">
    {title || 'No tasks yet'}
  </h3>

  // Message
  <p className="text-gray-500 mb-6 max-w-sm">
    {message || 'Get started by creating your first task. What would you like to accomplish?'}
  </p>

  // Action Button
  <button
    onClick={onAction}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg
      hover:bg-indigo-700 focus:outline-none focus:ring-2
      focus:ring-offset-2 focus:ring-indigo-500"
  >
    {buttonText || 'Create your first task'}
  </button>
</div>
```

## Accessibility

- `aria-live="polite"` on container for screen readers
- Button has clear label describing action
- Icon has `aria-hidden="true"` (decorative)

## Testing Requirements

### Unit Tests

```typescript
describe('EmptyState', () => {
  it('renders with default values', () => {
    render(<EmptyState onAction={() => {}} />)
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
    expect(screen.getByText('Create your first task')).toBeInTheDocument()
  })

  it('renders with custom values', () => {
    render(
      <EmptyState
        title="Custom Title"
        message="Custom message"
        buttonText="Custom Button"
        onAction={() => {}}
      />
    )
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument()
  })

  it('calls onAction when button clicked', () => {
    const onAction = jest.fn()
    render(<EmptyState onAction={onAction} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onAction).toHaveBeenCalled()
  })
})
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| react | 18+ | UI rendering |

## Related Components

- **TasksPage**: Uses EmptyState when task list is empty
- **TaskForm**: Opened when action button clicked

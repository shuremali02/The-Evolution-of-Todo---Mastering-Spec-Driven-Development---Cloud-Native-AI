# Contract: ConfirmDialog Component

**Component**: ConfirmDialog
**File**: `frontend/components/ConfirmDialog.tsx`
**Status**: Design Specification
**Date**: 2026-01-02

## Overview

ConfirmDialog is a reusable modal component that displays a confirmation message and requires user action before proceeding. Used for destructive actions like task deletion.

## Interface

```typescript
/**
 * Props for ConfirmDialog component.
 */
interface ConfirmDialogProps {
  /** Dialog title */
  title: string
  /** Confirmation message */
  message: string
  /** Text for confirm button (default: "Confirm") */
  confirmText?: string
  /** Text for cancel button (default: "Cancel") */
  cancelText?: string
  /** Callback when user confirms */
  onConfirm: () => void
  /** Callback when user cancels */
  onCancel: () => void
  /** Show/hide dialog */
  isOpen: boolean
  /** Confirm button variant (default: "danger") */
  variant?: 'danger' | 'primary'
}
```

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `ConfirmDialog` | Component | Default export - main component |
| `ConfirmDialogProps` | Type | Props interface |

## Behavior

### Visibility

- Dialog is rendered when isOpen is true
- Dialog is hidden when isOpen is false
- No mounting/unmounting animation required (simple show/hide)

### Open State

- Receives isOpen prop from parent
- Parent controls visibility (typically local state in TasksPage)

### Confirmation Flow

1. User clicks confirm button
2. onConfirm() callback invoked
3. Parent component handles actual action (e.g., delete API call)
4. Dialog remains open during action
5. Parent closes dialog on success

### Cancellation Flow

1. User clicks cancel button
2. onCancel() callback invoked
3. Dialog closes immediately
4. No action taken

### Backdrop Click

- Clicking backdrop calls onCancel()
- Prevents accidental confirmations
- Can be disabled if needed (future enhancement)

### Keyboard

- Escape key: calls onCancel()
- Enter key: calls onConfirm()
- Tab navigation within dialog

## Styling (Tailwind CSS)

```tsx
// Backdrop
{isOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    // Dialog container
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4
      animate-in fade-in zoom-in duration-200">

      // Title
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      // Message
      <div className="px-6 py-4">
        <p className="text-gray-600">{message}</p>
      </div>

      // Actions
      <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl
        flex justify-end gap-3">

        // Cancel button
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300
            rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-indigo-500"
        >
          {cancelText || 'Cancel'}
        </button>

        // Confirm button
        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-white rounded-lg
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
        >
          {confirmText || 'Confirm'}
        </button>
      </div>
    </div>
  </div>
)}
```

## Accessibility

- `role="dialog"` on modal container
- `aria-modal="true"` indicates modal
- `aria-labelledby` pointing to title
- `aria-describedby` pointing to message
- Focus trap inside modal when opened
- Focus restoration when dialog closed
- Escape key support

## Testing Requirements

### Unit Tests

```typescript
describe('ConfirmDialog', () => {
  it('renders when isOpen is true', () => {
    render(<ConfirmDialog {...props} isOpen={true} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<ConfirmDialog {...props} isOpen={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays correct title and message', () => {
    render(<ConfirmDialog title="Delete Task" message="Are you sure?" {...props} />)
    expect(screen.getByText('Delete Task')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = jest.fn()
    render(<ConfirmDialog {...props} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = jest.fn()
    render(<ConfirmDialog {...props} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('calls onCancel when backdrop clicked', () => {
    const onCancel = jest.fn()
    render(<ConfirmDialog {...props} onCancel={onCancel} />)
    fireEvent.click(screen.getByRole('dialog').parentElement)
    expect(onCancel).toHaveBeenCalled()
  })

  it('uses danger variant styling when specified', () => {
    render(<ConfirmDialog {...props} variant="danger" />)
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toHaveClass('bg-red-600')
  })
})
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| react | 18+ | UI rendering |
| None | - | Stateless component |

## Related Components

- **TaskCard**: Triggers dialog when delete button clicked
- **TasksPage**: Manages dialog state and handles delete action

## Usage Example

```tsx
// In TasksPage component
const [deleteDialog, setDeleteDialog] = useState<{
  isOpen: boolean
  taskId: string | null
  taskTitle: string
}>({ isOpen: false, taskId: null, taskTitle: '' })

const handleDeleteClick = (task: Task) => {
  setDeleteDialog({
    isOpen: true,
    taskId: task.id,
    taskTitle: task.title,
  })
}

const handleConfirmDelete = async () => {
  if (deleteDialog.taskId) {
    await deleteTask(deleteDialog.taskId)
    setDeleteDialog({ isOpen: false, taskId: null, taskTitle: '' })
  }
}

return (
  <>
    <TaskCard task={task} onDelete={handleDeleteClick} />

    <ConfirmDialog
      isOpen={deleteDialog.isOpen}
      title="Delete Task"
      message={`Are you sure you want to delete "${deleteDialog.taskTitle}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      onConfirm={handleConfirmDelete}
      onCancel={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
    />
  </>
)
```

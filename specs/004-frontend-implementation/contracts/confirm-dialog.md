# ConfirmDialog Component API Contract

**Component File**: `frontend/components/ConfirmDialog.tsx`
**Spec Reference**: `specs/ui/components.md#7-confirmdialog`
**Task**: T-001

---

## Purpose

Confirmation modal for destructive actions (e.g., delete task). Renders as a portal overlay to prevent interaction with background elements.

---

## TypeScript Interface

```typescript
interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string   // Default: "Confirm"
  cancelLabel?: string    // Default: "Cancel"
  onConfirm: () => void
  onCancel: () => void
  variant?: 'info' | 'warning' | 'danger'  // Default: 'danger'
}
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Controls dialog visibility. `false` renders nothing. |
| `title` | `string` | Yes | - | Modal heading text. |
| `message` | `string` | Yes | - | Modal body text (can contain newlines). |
| `confirmLabel` | `string` | No | `"Confirm"` | Text for confirm button. |
| `cancelLabel` | `string` | No | `"Cancel"` | Text for cancel button. |
| `onConfirm` | `() => void` | Yes | - | Called when confirm button clicked. |
| `onCancel` | `() => void` | Yes | - | Called when cancel button clicked or dialog dismissed. |
| `variant` | `'info' \| 'warning' \| 'danger'` | No | `'danger'` | Visual style variant (affects confirm button color). |

---

## Behavior

### Rendering

- **Closed**: When `isOpen === false`, component renders `null`
- **Open**: When `isOpen === true`, component renders portal modal:
  1. **Overlay**: Fixed-position div covering entire viewport with `z-index: 50`
  2. **Backdrop**: Semi-transparent black background (`bg-black/50`)
  3. **Modal**: Centered white card with shadow and rounded corners

### Body Scroll Lock

- When dialog opens: Set `document.body.style.overflow = 'hidden'`
- When dialog closes: Restore `document.body.style.overflow = 'unset'`

### Keyboard Shortcuts

- **Escape key**: Calls `onCancel()` (closes dialog)
- **Enter key**: Calls `onConfirm()` (confirms action)

### Outside Click

- Clicking outside modal (on backdrop): Calls `onCancel()` (closes dialog)

### Focus Management

- **On Open**: Move focus to confirm button
- **On Close**: Restore focus to triggering element (handled by parent)

---

## Visual States

### Variants

| Variant | Confirm Button | Border/Icon Color | Use Case |
|---------|----------------|-------------------|----------|
| `info` | Blue (`bg-blue-600`) | Blue borders | Information confirmations |
| `warning` | Yellow (`bg-yellow-600`) | Yellow borders | Warning confirmations |
| `danger` | Red (`bg-red-600`) | Red borders | Destructive actions (delete) |

### Button States

- **Default**: Full opacity, hover effect
- **Hover**: Darker shade, cursor pointer
- **Focus**: Blue ring outline (`focus:ring-2`)
- **Disabled**: Gray, cursor not-allowed (not implemented in v1)

---

## Accessibility

- **ARIA**:
  - Dialog: `role="dialog"`
  - Title: `aria-labelledby` pointing to heading
  - Overlay: `aria-modal="true"`
- **Keyboard**: Escape to close, Tab navigation within modal
- **Focus**: Auto-focus on confirm button on open
- **Screen Reader**: Title and message announced on open

---

## Usage Example

```typescript
'use client'

import { useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export function TasksPage() {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleDeleteTask = async (taskId: string) => {
    // Trigger delete confirmation
    setDeleteConfirm(taskId)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    try {
      await apiClient.deleteTask(deleteConfirm)
      refetchTasks()
    } finally {
      setDeleteConfirm(null)
    }
  }

  return (
    <div>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={() => handleDeleteTask(task.id)}
        />
      ))}

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Task?"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </div>
  )
}
```

---

## Implementation Notes

### React Portal

Uses `ReactDOM.createPortal()` to render modal at end of `<body>`:
```typescript
import { createPortal } from 'react-dom'

return createPortal(
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    {/* Modal content */}
  </div>,
  document.body
)
```

### Tailwind Classes

- **Overlay**: `fixed inset-0 z-50 flex items-center justify-center bg-black/50`
- **Modal**: `bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4`
- **Title**: `text-lg font-semibold mb-2`
- **Message**: `text-gray-600 mb-4`
- **Buttons**: Flex row, gap-3, confirm/danger variant

---

## Testing

### Unit Tests
- Renders nothing when `isOpen === false`
- Renders portal when `isOpen === true`
- Calls `onConfirm()` when confirm button clicked
- Calls `onCancel()` when cancel button clicked
- Calls `onCancel()` when Escape key pressed
- Calls `onCancel()` when backdrop clicked
- Locks body scroll when open, unlocks when closed

### Integration Tests
- Delete task flow: click delete → confirm dialog → confirm → task removed
- Cancel delete flow: click delete → confirm dialog → cancel → dialog closes, task remains

---

## Future Enhancements

- **Loading state**: Show spinner while `onConfirm()` is async
- **Danger zone**: Checkbox "I understand this cannot be undone" before enabling confirm
- **Multi-select**: Support confirming deletion of multiple items
- **Custom icon**: Support custom icon in header (warning, trash, etc.)

---

**Contract Version**: 1.0.0
**Last Updated**: 2026-01-01

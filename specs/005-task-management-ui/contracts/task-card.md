# Contract: TaskCard Component

**Component**: TaskCard
**File**: `frontend/components/TaskCard.tsx`
**Status**: Design Specification
**Date**: 2026-01-02

## Overview

TaskCard displays a single task item with its title, description, completion status, and action buttons. It is the primary visual representation of tasks in the list.

## Interface

```typescript
/**
 * Props for TaskCard component.
 */
interface TaskCardProps {
  /** The task to display */
  task: Task
  /** Callback when task is updated (refresh list) */
  onUpdate: () => void
  /** Optional callback when edit is triggered */
  onEdit?: (task: Task) => void
  /** Optional callback when delete is triggered */
  onDelete?: (taskId: string) => void
}

/**
 * Task entity (from types/task.ts)
 */
interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}
```

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `TaskCard` | Component | Default export - main component |
| `TaskCardProps` | Type | Props interface |

## Behavior

### Rendering

1. **Title Display**
   - Show task.title prominently
   - Apply strikethrough if task.completed is true
   - Use `text-lg font-semibold` styling

2. **Description Display**
   - Show task.description if present (not null)
   - Use `text-gray-600` styling
   - Truncate if > 3 lines (line-clamp-3)

3. **Completion Status**
   - Visual indicator: checkmark icon or badge
   - Green color for completed, gray for pending
   - Include in title styling (strikethrough for completed)

4. **Timestamps**
   - Show task.created_at in readable format
   - Use formatRelativeTime() utility
   - Small text, muted color

5. **Action Buttons**
   - **Complete/Toggle**: Show "Complete" if pending, "Undo" if completed
   - **Edit**: Pencil icon button
   - **Delete**: Trash icon button
   - Disable all buttons while any operation is in progress

### Interactions

1. **Complete Button Click**
   - Call apiClient.completeTask(task.id)
   - On success: call onUpdate() callback
   - On error: show error toast/message

2. **Edit Button Click**
   - If onEdit callback provided: call onEdit(task)
   - Otherwise: log a warning to console (component not configured for edit)
   - Note: In typical usage, TasksPage provides onEdit callback

3. **Delete Button Click**
   - If onDelete callback provided: call onDelete(task.id)
   - Otherwise: log a warning to console (component not configured for delete)
   - Note: In typical usage, TasksPage provides onDelete callback

### Loading States

- Show spinner inside button when operation in progress
- Disable all buttons during operation
- Show visual feedback (opacity change) when disabled

### Error Handling

- Display error message if API call fails
- Re-enable buttons on error
- Do not remove task from UI on error (user can retry)

## Styling (Tailwind CSS)

```tsx
// Card container
<div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">

  // Title
  <h3 className="text-lg font-semibold text-gray-900
    {task.completed ? 'line-through text-gray-400' : ''}">

  // Description
  {task.description && (
    <p className="mt-2 text-gray-600 line-clamp-3">{task.description}</p>
  )}

  // Timestamp
  <p className="mt-4 text-xs text-gray-400">
    Created {formatRelativeTime(task.created_at)}
  </p>

  // Action buttons container
  <div className="mt-4 flex gap-2">
    <button className="...">Complete</button>
    <button className="...">Edit</button>
    <button className="...">Delete</button>
  </div>
</div>
```

## Accessibility

- `aria-label` on complete button: "Mark task as complete"
- `aria-label` on edit button: "Edit task"
- `aria-label` on delete button: "Delete task"
- `aria-checked` on complete button reflecting task.completed
- Keyboard navigation through buttons
- Focus visible states

## Testing Requirements

### Unit Tests

```typescript
describe('TaskCard', () => {
  it('renders task title', () => {
    // Test title display
  })

  it('applies strikethrough for completed task', () => {
    // Test completed styling
  })

  it('shows complete button for pending task', () => {
    // Test button visibility
  })

  it('shows undo button for completed task', () => {
    // Test toggle behavior
  })

  it('calls onUpdate when complete button clicked', () => {
    // Test complete action
  })

  it('calls onEdit when edit button clicked', () => {
    // Test edit action
  })

  it('calls onDelete when delete button clicked', () => {
    // Test delete action
  })

  it('disables buttons during operation', () => {
    // Test loading state
  })

  it('displays error message on API failure', () => {
    // Test error handling
  })
})
```

### Test Data

```typescript
const mockTask: Task = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Buy groceries',
  description: 'Milk, eggs, bread',
  completed: false,
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: '2026-01-01T10:00:00Z',
  updated_at: '2026-01-01T10:00:00Z',
}
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| react | 18+ | UI rendering |
| apiClient | - | API calls (from lib/api.ts) |
| formatRelativeTime | - | Date formatting |

## Related Components

- **TaskForm**: Opens in edit mode when edit button clicked
- **ConfirmDialog**: Used for delete confirmation
- **TasksPage**: Parent component that provides onUpdate callback

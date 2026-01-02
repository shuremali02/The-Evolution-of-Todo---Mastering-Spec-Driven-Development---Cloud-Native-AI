# Data Model: Task Management Frontend UI

**Feature**: Task Management Frontend UI
**Date**: 2026-01-02
**Branch**: `005-task-management-ui`

## TypeScript Interfaces

### Task (from existing types/task.ts)

```typescript
/**
 * Task entity representing a single task item.
 * Matches backend TaskResponse schema.
 */
interface Task {
  /** Unique identifier (UUID) */
  id: string
  /** Task title (1-200 characters) */
  title: string
  /** Task description (optional, max 1000 characters) */
  description: string | null
  /** Completion status */
  completed: boolean
  /** User ID who owns this task (from JWT) */
  user_id: string
  /** ISO timestamp of creation */
  created_at: string
  /** ISO timestamp of last update */
  updated_at: string
}
```

### TaskCreate (for creating new tasks)

```typescript
/**
 * Data for creating a new task.
 */
interface TaskCreate {
  /** Task title (required, 1-200 characters) */
  title: string
  /** Task description (optional, max 1000 characters) */
  description?: string
}
```

### TaskUpdate (for editing tasks)

```typescript
/**
 * Data for updating an existing task.
 * All fields optional - only provided fields will be updated.
 */
interface TaskUpdate {
  /** Task title (1-200 characters) */
  title?: string
  /** Task description (max 1000 characters) */
  description?: string
  /** Completion status toggle */
  completed?: boolean
}
```

### TaskFormData (internal form state)

```typescript
/**
 * Internal form state for TaskForm component.
 * Extends TaskCreate with validation state.
 */
interface TaskFormData {
  title: string
  description: string
}

interface TaskFormErrors {
  title?: string
  description?: string
  general?: string
}

interface TaskFormState {
  data: TaskFormData
  errors: TaskFormErrors
  isValid: boolean
  isSubmitting: boolean
}
```

### TaskCardProps

```typescript
/**
 * Props for TaskCard component.
 */
interface TaskCardProps {
  /** The task to display */
  task: Task
  /** Callback when task is updated (refresh list) */
  onUpdate: () => void
  /** Callback when edit mode is triggered */
  onEdit?: (task: Task) => void
  /** Callback when delete is confirmed */
  onDelete?: (taskId: string) => void
}
```

### TaskFormProps

```typescript
/**
 * Props for TaskForm component.
 * Supports both create and edit modes.
 */
interface TaskFormProps {
  /** Optional existing task for edit mode */
  task?: Task
  /** Callback when form is closed/cancelled */
  onClose: () => void
  /** Callback when task is successfully saved */
  onSave: () => void
  /** Form mode indicator */
  mode: 'create' | 'edit'
}
```

### ConfirmDialogProps

```typescript
/**
 * Props for ConfirmDialog component.
 */
interface ConfirmDialogProps {
  /** Dialog title */
  title: string
  /** Confirmation message */
  message: string
  /** Text for confirm button */
  confirmText?: string
  /** Text for cancel button */
  cancelText?: string
  /** Callback when user confirms */
  onConfirm: () => void
  /** Callback when user cancels */
  onCancel: () => void
  /** Show/hide dialog */
  isOpen: boolean
  /** Confirm button variant */
  variant?: 'danger' | 'primary'
}
```

### TasksPageState

```typescript
/**
 * State for the tasks page (useTasks hook).
 */
interface TasksState {
  tasks: Task[]
  loading: 'idle' | 'loading' | 'submitting'
  error: string | null
  empty: boolean
}

interface TasksActions {
  /** Fetch all tasks from API */
  fetchTasks: () => Promise<void>
  /** Create a new task */
  createTask: (data: TaskCreate) => Promise<void>
  /** Update an existing task */
  updateTask: (id: string, data: TaskUpdate) => Promise<void>
  /** Delete a task */
  deleteTask: (id: string) => Promise<void>
  /** Toggle task completion */
  completeTask: (id: string) => Promise<void>
  /** Clear error state */
  clearError: () => void
}

type TasksStore = TasksState & TasksActions
```

## Validation Rules

> **Note**: Validation logic is implemented in `frontend/lib/validation.ts` and imported from there.

```typescript
// Validation constants and functions are exported from:
// frontend/lib/validation.ts

export const VALIDATION = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const

// Functions exported:
// validateTitle(title: string): ValidationResult
// validateDescription(description: string | null | undefined): ValidationResult
// validateTaskForm(title: string, description: string | null | undefined): {...}
// prepareTaskData(title: string, description: string | null | undefined): {...}
```

## API Response Types

### TaskListResponse

```typescript
type TaskListResponse = Task[]
```

### TaskResponse

```typescript
type TaskResponse = Task
```

### ErrorResponse

```typescript
interface ErrorResponse {
  detail: string
}
```

## Component State Types

### TaskList Display States

```typescript
type TasksDisplayState =
  | { type: 'loading' }
  | { type: 'error'; message: string; onRetry: () => void }
  | { type: 'empty'; onCreate: () => void }
  | { type: 'success'; tasks: Task[] }
```

### Modal States

```typescript
type ModalState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; task: Task }
  | { type: 'delete'; taskId: string; taskTitle: string }
```

## Utility Types

### API Error Handler

```typescript
function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
```

### Formatting Utilities

```typescript
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return formatDate(dateString)
}
```

## Export Statements

```typescript
// types/task.ts exports
export type { Task, TaskCreate, TaskUpdate }

// components/TaskCard.tsx exports
export type { TaskCardProps }

// components/TaskForm.tsx exports
export type { TaskFormProps, TaskFormData, TaskFormErrors, TaskFormState }

// components/ConfirmDialog.tsx exports
export type { ConfirmDialogProps }

// hooks/useTasks.ts exports
export type { TasksState, TasksActions, TasksStore }
```

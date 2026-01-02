# Contract: TaskForm Component

**Component**: TaskForm
**File**: `frontend/components/TaskForm.tsx`
**Status**: Design Specification
**Date**: 2026-01-02

## Overview

TaskForm provides a modal dialog for creating new tasks or editing existing tasks. It handles form validation, submission, and error display.

## Interface

```typescript
/**
 * Props for TaskForm component.
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
| `TaskForm` | Component | Default export - main component |
| `TaskFormProps` | Type | Props interface |

## Form Fields

### Title Field

| Property | Value |
|----------|-------|
| Label | "Title" |
| Required | Yes |
| Min Length | 1 character |
| Max Length | 200 characters |
| Placeholder | "Enter task title" |
| Validation | Required, length check |
| Error Message | "Title is required" / "Title must be 200 characters or less" |

### Description Field

| Property | Value |
|----------|-------|
| Label | "Description" |
| Required | No |
| Max Length | 1000 characters |
| Placeholder | "Enter optional description" |
| Validation | Length check (max 1000) |
| Error Message | "Description must be 1000 characters or less" |
| UI | Textarea, 3 rows default |

## Behavior

### Mode Handling

**Create Mode (mode === 'create')**:
- Title field empty
- Description field empty
- Submit button: "Create Task"
- Modal title: "Create New Task"

**Edit Mode (mode === 'edit')**:
- Title field pre-filled with task.title
- Description field pre-filled with task.description (or empty string if null)
- Submit button: "Save Changes"
- Modal title: "Edit Task"

### Opening

- Component receives props
- Form initialized with task data (if edit mode)
- Validation rules active

### Validation

1. **On Blur**
   - Validate individual field
   - Show inline error if invalid
   - Clear error when field becomes valid

2. **On Submit**
   - Validate all fields
   - If invalid: show all errors, prevent submission
   - If valid: proceed to API call

### Submission

1. Set isSubmitting to true
2. Clear previous errors
3. Call appropriate API:
   - Create: apiClient.createTask({ title, description })
   - Edit: apiClient.updateTask(task.id, { title, description })
4. On success:
   - Set isSubmitting to false
   - Call onSave() callback
   - Call onClose() callback
5. On error:
   - Set isSubmitting to false
   - Display error message (general or field-specific)
   - Keep form open for retry

### Cancellation

- Click "Cancel" button: call onClose()
- Click backdrop: call onClose() (unless isSubmitting)
- Press Escape: call onClose() (unless isSubmitting)
- No data loss on cancel

### Loading State

- Disable all form inputs
- Disable Cancel button
- Show spinner in submit button
- Change button text: "Creating..." or "Saving..."

### Error Display

**Field Errors**:
- Show below respective field
- Red text, small font
- Appear on blur or submit

**General Errors**:
- Show at top of form
- Red background, alert styling
- Appear on API failure

## Styling (Tailwind CSS)

```tsx
// Modal backdrop
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

  // Modal container
  <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">

    // Header
    <div className="px-6 py-4 border-b">
      <h2 className="text-xl font-semibold">
        {mode === 'create' ? 'Create New Task' : 'Edit Task'}
      </h2>
    </div>

    // Form
    <form onSubmit={handleSubmit} className="p-6 space-y-4">

      // Title field
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          className="mt-1 block w-full border rounded-lg px-3 py-2
            focus:ring-indigo-500 focus:border-indigo-500
            {errors.title ? 'border-red-500' : 'border-gray-300'}"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      // Description field
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full border rounded-lg px-3 py-2
            focus:ring-indigo-500 focus:border-indigo-500
            {errors.description ? 'border-red-500' : 'border-gray-300'}"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      // General error
      {errors.general && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">
          {errors.general}
        </div>
      )}

      // Actions
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg
            hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Saving...')
            : (mode === 'create' ? 'Create Task' : 'Save Changes')}
        </button>
      </div>
    </form>
  </div>
</div>
```

## Accessibility

- `aria-labelledby` pointing to modal title
- `aria-describedby` for form instructions
- Focus trap inside modal when opened
- Focus restoration when modal closed
- `aria-invalid` on invalid fields
- `aria-describedby` linking to error messages
- Keyboard navigation: Tab/Shift+Tab, Escape to close
- Screen reader announcements for errors

## Testing Requirements

### Unit Tests

```typescript
describe('TaskForm', () => {
  it('renders in create mode with empty fields', () => {
    // Test initial state
  })

  it('renders in edit mode with pre-filled data', () => {
    // Test pre-population
  })

  it('validates required title', () => {
    // Test title validation
  })

  it('validates title max length', () => {
    // Test length validation
  })

  it('validates description max length', () => {
    // Test description validation
  })

  it('calls onClose when cancel clicked', () => {
    // Test cancel action
  })

  it('creates task on submit in create mode', () => {
    // Test create API call
  })

  it('updates task on submit in edit mode', () => {
    // Test update API call
  })

  it('shows loading state during submission', () => {
    // Test loading UI
  })

  it('displays error message on API failure', () => {
    // Test error handling
  })

  it('closes after successful submission', () => {
    // Test callback invocation
  })
})
```

## Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| react | 18+ | UI rendering, forms |
| apiClient | - | API calls (from lib/api.ts) |
| validation | - | Title/description validation |

## Related Components

- **TaskCard**: Opens form in edit mode when edit button clicked
- **ConfirmDialog**: Not directly related (different component)
- **TasksPage**: Parent component that controls form visibility

## State Management

```typescript
interface TaskFormState {
  title: string
  description: string
  errors: {
    title?: string
    description?: string
    general?: string
  }
  isSubmitting: boolean
}
```

# TaskForm Component API Contract

**Component File**: `frontend/components/TaskForm.tsx`
**Spec Reference**: `specs/ui/components.md#2-taskform`
**Task**: T-003

---

## Purpose

Reusable form for creating new tasks or editing existing tasks. Handles validation, loading states, and form submission.

---

## TypeScript Interface

```typescript
interface TaskFormProps {
  initialData?: {
    title: string
    description: string | null
  }
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string  // Default: "Submit"
}

interface TaskFormData {
  title: string
  description: string | null
}
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|----------|-------------|
| `initialData` | `{ title: string, description: string \| null }` | No | `undefined` | Pre-filled form data (edit mode). If omitted, form is in create mode. |
| `onSubmit` | `(data: TaskFormData) => Promise<void>` | Yes | - | Called when form is valid and submitted. |
| `onCancel` | `() => void` | Yes | - | Called when cancel button clicked. |
| `submitLabel` | `string` | No | `"Submit"` | Text for submit button. |

---

## Behavior

### Modes

**Create Mode** (`initialData` not provided):
- All fields empty
- Submit button label: "Submit" or custom
- Submit creates new task via parent callback

**Edit Mode** (`initialData` provided):
- Fields pre-filled with `initialData.title` and `initialData.description`
- Submit button label: "Save Changes" (or custom)
- Submit updates existing task via parent callback

### Validation

**Client-Side Validation** (run on `onBlur` and submit):
- **Title**:
  - Required: `title.trim().length > 0`
  - Max length: `title.length <= 200`
  - Error: "Title is required" or "Title must be less than 200 characters"
- **Description**:
  - Optional: `description === null || description.trim().length === 0` allowed
  - Max length: `description === null || description.length <= 1000`
  - Error: "Description must be less than 1000 characters"

**Validation State**:
- Show error below field when invalid
- Disable submit button if any field is invalid
- Clear errors when user types in field

### Form Submission

1. User clicks submit button
2. Component validates all fields
3. If invalid: Show errors, prevent submission
4. If valid:
   - Set `formLoading = true`
   - Call `onSubmit({ title: title.trim(), description: description.trim() || null })`
   - Wait for promise to resolve
   - If success: Parent clears form or redirects (not handled by TaskForm)
   - If error: Set `formError`, keep form data
5. Set `formLoading = false`

### Cancellation

- User clicks cancel button
- Component calls `onCancel()`
- Parent decides what to do (close form, redirect, etc.)
- No confirmation needed (user choice is explicit)

---

## Visual States

### Empty (Create Mode, No Input)

- Title input: Empty, placeholder "Enter task title..."
- Description textarea: Empty, placeholder "Enter task description..."
- Character counts: "0/200", "0/1000"
- Submit button: Disabled (title required)
- No validation errors

### Valid (All Fields Valid)

- Title input: Populated, length ≤ 200
- Description textarea: Populated or empty, length ≤ 1000
- Character counts: "{n}/200", "{n}/1000"
- Submit button: Enabled, hover effect
- No validation errors

### Invalid (Validation Error)

- Invalid field: Red border, red error message below
- Submit button: Disabled
- Error messages:
  - Title: "Title is required" or "Title must be less than 200 characters"
  - Description: "Description must be less than 1000 characters"

### Loading (Submitting)

- All inputs: Disabled, grayed out
- Submit button: Disabled, shows spinner
- Submit label: "Saving..." or "Creating..."
- Cannot cancel (cancel button disabled)

### Server Error

- Form fields: Enabled, user can modify
- Submit button: Enabled
- Error banner: Red background, shows error message from API
- User can retry submission

---

## Layout

```
┌──────────────────────────────────────────┐
│ Title *                                  │
│ [_________________________] 0/200         │
│                                          │
│ Description (optional)                     │
│ [                                  ]     │
│ [                                  ]     │
│ [_________________________] 0/1000        │
│                                          │
│ [error banner if server error]             │
│                                          │
│         [Submit] [Cancel]                 │
└──────────────────────────────────────────┘
```

**Tailwind Classes** (baseline):
- Container: `bg-white p-6 rounded-lg shadow`
- Label: `block text-sm font-medium text-gray-700 mb-2`
- Input: `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500`
- Error input: `border-red-500`
- Char count: `mt-1 text-xs text-gray-500`
- Error message: `text-red-600 text-sm`
- Submit button: `px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700`
- Submit button (disabled): `disabled:bg-gray-400 disabled:cursor-not-allowed`
- Cancel button: `px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300`

---

## Character Counters

Display character counts for both fields:

- **Title**: Shows `{title.length}/200`
- **Description**: Shows `{description.length}/1000`
- **Visual**:
  - Normal: Gray text, no color change
  - Near limit: Yellow or orange when length > 180/900
  - At limit: Red text when length === 200/1000
- **Behavior**: Updates in real-time as user types

---

## Accessibility

- **Labels**: `<label>` with `htmlFor` attribute linked to input `id`
- **Required Fields**: Visual asterisk (`*`) and `aria-required="true"`
- **Error Messages**: Associated with inputs via `aria-describedby`
- **Focus Management**: Auto-focus on first field when form appears
- **Keyboard**: Tab navigation through fields, Enter to submit
- **Screen Reader**: Labels, errors, and character counts announced

---

## Usage Example

### Create Mode

```typescript
'use client'

import { useState } from 'react'
import { TaskForm } from '@/components/TaskForm'
import { apiClient } from '@/lib/api'

export function TasksPage() {
  const [showForm, setShowForm] = useState(false)

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await apiClient.createTask(data)
      setShowForm(false)  // Close form after success
      refetchTasks()
    } catch (err) {
      // Error handling: TaskForm shows server error
      throw err  // Let TaskForm handle display
    }
  }

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Create Task</button>

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
          submitLabel="Create Task"
        />
      )}
    </div>
  )
}
```

### Edit Mode

```typescript
'use client'

import { useState } from 'react'
import { TaskForm } from '@/components/TaskForm'
import { apiClient } from '@/lib/api'

export function TasksPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const startEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return

    try {
      await apiClient.updateTask(editingTask.id, data)
      setEditingTask(null)  // Close form after success
      refetchTasks()
    } catch (err) {
      throw err
    }
  }

  return (
    <div>
      {editingTask && (
        <TaskForm
          initialData={{
            title: editingTask.title,
            description: editingTask.description
          }}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          submitLabel="Save Changes"
        />
      )}
    </div>
  )
}
```

---

## Implementation Notes

### Form State

```typescript
const [title, setTitle] = useState(initialData?.title || '')
const [description, setDescription] = useState(initialData?.description || '')
const [formError, setFormError] = useState<string | null>(null)
const [formLoading, setFormLoading] = useState(false)
```

### Validation Function

```typescript
const validateTitle = (value: string): string | null => {
  if (!value.trim()) return 'Title is required'
  if (value.length > 200) return 'Title must be less than 200 characters'
  return null
}

const validateDescription = (value: string): string | null => {
  if (value.length > 1000) return 'Description must be less than 1000 characters'
  return null
}
```

### Submit Handler

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Validate
  const titleError = validateTitle(title)
  const descError = validateDescription(description)

  if (titleError || descError) {
    return  // Show errors in UI
  }

  try {
    setFormLoading(true)
    setFormError(null)
    await onSubmit({
      title: title.trim(),
      description: description.trim() || null
    })
  } catch (err) {
    setFormError(err instanceof Error ? err.message : 'Submission failed')
  } finally {
    setFormLoading(false)
  }
}
```

---

## Testing

### Unit Tests
- Pre-fills fields when `initialData` provided
- Clears fields when `initialData` not provided
- Shows validation error when title is empty on blur
- Shows validation error when title exceeds 200 characters
- Shows validation error when description exceeds 1000 characters
- Disables submit button when invalid
- Enables submit button when valid
- Calls `onSubmit(data)` with trimmed values when submitted
- Calls `onCancel()` when cancel button clicked
- Shows loading state while submitting
- Shows server error when `onSubmit` throws error
- Updates character counts in real-time

### Integration Tests
- Create task flow: open form → enter data → submit → task created
- Edit task flow: open form with data → modify → submit → task updated
- Validation flow: empty title → show error → enter title → submit success
- Server error flow: submit with valid data → error → fix → retry success

---

## Future Enhancements

- **Auto-save**: Periodically save draft to localStorage
- **Rich text**: Support markdown or rich text editor for description
- **Attachments**: File upload field
- **Priority**: Priority dropdown (low, medium, high)
- **Due date**: Date picker with due time
- **Reminders**: Reminder time picker

---

**Contract Version**: 1.0.0
**Last Updated**: 2026-01-01

# TaskCard Component API Contract

**Component File**: `frontend/components/TaskCard.tsx`
**Spec Reference**: `specs/ui/components.md#1-taskcard`
**Task**: T-002

---

## Purpose

Display a single task with action buttons for completion, editing, and deletion.

---

## TypeScript Interface

```typescript
interface TaskCardProps {
  task: Task
  onComplete: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onEdit: (task: Task) => void
}

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

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `task` | `Task` | Yes | Task data object to display |
| `onComplete` | `(id: string) => Promise<void>` | Yes | Called when completion checkbox clicked |
| `onDelete` | `(id: string) => Promise<void>` | Yes | Called when delete button clicked |
| `onEdit` | `(task: Task) => void` | Yes | Called when edit button clicked |

---

## Behavior

### Display Elements

1. **Checkbox**: Toggle completion status
   - Clicking calls `onComplete(task.id)`
   - Checked state = `task.completed`
   - Disabled during async operation (optional, v1 only visual feedback)

2. **Title**: Task title text
   - Bold, larger font
   - Strikethrough when `task.completed === true`

3. **Description**: Optional task description
   - Gray, smaller text
   - Truncated if too long (CSS line-clamp)
   - Strikethrough when `task.completed === true`

4. **Edit Button**: Navigate to edit mode
   - Only visible when `task.completed === false`
   - Clicking calls `onEdit(task)`
   - Label: "Edit"

5. **Delete Button**: Initiate task deletion
   - Always visible
   - Clicking calls `onDelete(task.id)`
   - Label: "Delete"

6. **Timestamp**: Created date/time
   - Formatted: "Created {date} at {time}"
   - Small, muted text
   - Below description

---

## Visual States

### Normal (Not Completed)

- **Background**: White, rounded-lg shadow, hover:shadow-lg
- **Title**: Black, bold, text-lg
- **Description**: Gray-600, text-sm
- **Checkbox**: Unchecked, blue on hover
- **Edit Button**: Visible, gray-100 background
- **Delete Button**: Visible, red-100 background

### Completed

- **Background**: White with opacity-75 (slightly faded)
- **Title**: Gray-500, bold, strikethrough
- **Description**: Gray-500, strikethrough
- **Checkbox**: Checked, green
- **Edit Button**: Hidden (disabled in completed state)
- **Delete Button**: Visible (can delete completed tasks)
- **Badge**: "Completed" badge next to title (green-100, green-800)

### Loading (Optional, v1)

- **Buttons**: Disabled, show spinner icon
- **No full-card loading state** (per-task operations are fast)

---

## Layout

```
┌─────────────────────────────────────────────┐
│ [ ] Task Title                [Edit] [Delete] │
│     Task description text (optional)         │
│     Created Jan 1, 2026 at 10:30 AM         │
└─────────────────────────────────────────────┘
```

**Responsive**:
- Mobile: Full width, stacked elements
- Tablet: Same as mobile
- Desktop: Full width, max-w-md optional

**Tailwind Classes** (baseline):
- Container: `bg-white p-6 rounded-lg shadow hover:shadow-lg transition`
- Title: `text-lg font-semibold text-gray-900`
- Description: `text-gray-600 mt-2`
- Timestamp: `text-xs text-gray-400 mt-2`

---

## Interaction Flow

### Complete Task

1. User clicks checkbox
2. Component calls `onComplete(task.id)` (async)
3. Parent calls API: `PATCH /api/v1/tasks/{id}/complete`
4. Parent refetches tasks or updates local state
5. Task re-renders with updated `completed` status

### Edit Task

1. User clicks "Edit" button (only if not completed)
2. Component calls `onEdit(task)`
3. Parent shows edit form with task data
4. User modifies and saves
5. Form submits, parent refetches tasks
6. Task card re-renders with updated data

### Delete Task

1. User clicks "Delete" button
2. Component calls `onDelete(task.id)`
3. Parent shows `ConfirmDialog` (not handled by TaskCard)
4. User confirms
5. Parent calls API: `DELETE /api/v1/tasks/{id}`
6. Parent refetches tasks
7. Task card removed from list

---

## Accessibility

- **Checkbox**: `type="checkbox"`, `aria-label="Mark task as complete"`
- **Edit Button**: `aria-label="Edit task"`
- **Delete Button**: `aria-label="Delete task"`
- **Keyboard**: Tab navigation through buttons
- **Focus States**: Blue ring on focused elements
- **Screen Reader**: Title and description announced

---

## Usage Example

```typescript
'use client'

import { TaskCard } from '@/components/TaskCard'
import { apiClient } from '@/lib/api'

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleComplete = async (id: string) => {
    try {
      const updatedTask = await apiClient.completeTask(id)
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
    } catch (err) {
      console.error('Failed to complete task:', err)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteConfirm(id)  // Show confirmation dialog
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)  // Show edit form
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  )
}
```

---

## Implementation Notes

### Date Formatting

Use native `Intl.DateTimeFormat` or simple `toLocaleDateString`:
```typescript
const dateStr = new Date(task.created_at).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})

const timeStr = new Date(task.created_at).toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit'
})
```

### Description Truncation

Use CSS line-clamp for long descriptions:
```typescript
className={`text-gray-600 mt-2 ${task.description && task.description.length > 100 ? 'line-clamp-2' : ''}`}
```

---

## Testing

### Unit Tests
- Renders task title correctly
- Renders task description if provided
- Strikethrough text when `completed === true`
- Checkbox checked when `completed === true`
- Calls `onComplete(task.id)` when checkbox clicked
- Calls `onEdit(task)` when edit button clicked
- Calls `onDelete(task.id)` when delete button clicked
- Hides edit button when `completed === true`

### Integration Tests
- Complete task flow: click checkbox → API call → task shows completed
- Edit task flow: click edit → form appears → save → task updated
- Delete task flow: click delete → confirm dialog → delete → task removed

---

## Future Enhancements

- **Priority badge**: Show task priority if added to schema
- **Due date**: Show countdown or overdue indicator
- **Tags**: Display task tags/categories as chips
- **Subtasks**: Show subtask progress bar
- **Comments**: Show comment count icon
- **Attachments**: Show attachment count icon

---

**Contract Version**: 1.0.0
**Last Updated**: 2026-01-01

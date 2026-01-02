---
page: Task Management UI Enhancements
output: frontend/app/tasks/page.tsx
spec: task-ui/spec.md
priority: High
---

# Task Management UI Enhancements Specification

## Purpose

Enhance the tasks page with professional features including search, sorting, priority levels, toast notifications, keyboard shortcuts, animations, and improved loading states.

## User Stories

### US-1: Search Tasks
As a user, I want to search my tasks by title or description so that I can quickly find specific tasks.

**Acceptance Criteria:**
- Search input in the filter bar
- Real-time filtering as user types
- Searches both title and description
- Shows empty state when no matches found
- Clear search button when text exists

### US-2: Sort Tasks
As a user, I want to sort my tasks so that I can organize them by date, title, or completion status.

**Acceptance Criteria:**
- Sort dropdown with options: Newest First, Oldest First, Title (A-Z), Title (Z-A), Completion Status
- Default sort: Newest First
- Sort persists with filtered results

### US-3: Priority Levels
As a user, I want to set priority levels for tasks so that I can focus on what's most important.

**Acceptance Criteria:**
- Priority selector in task form (Low, Medium, High)
- Color-coded priority badges on task cards:
  - High: Red
  - Medium: Yellow/Orange
  - Low: Gray/Blue
- Default priority: Medium
- Sort by priority option

### US-4: Due Dates
As a user, I want to set due dates for tasks so that I can track deadlines.

**Acceptance Criteria:**
- Date picker in task form
- Due date display on task cards
- Visual indicators for overdue tasks
- Sort by due date option
- "No due date" option

### US-5: Toast Notifications
As a user, I want to see notifications when actions complete so that I know my changes were saved.

**Acceptance Criteria:**
- Toast notifications for: Task Created, Task Updated, Task Deleted, Task Completed
- Auto-dismiss after 3 seconds
- Dismiss button on each toast
- Multiple toasts stack vertically
- Success (green), Error (red), Info (blue) variants

### US-6: Keyboard Shortcuts
As a user, I want to use keyboard shortcuts so that I can navigate faster.

**Acceptance Criteria:**
- `n` - New task (opens form)
- `/` - Focus search
- `Esc` - Close form/cancel
- `Enter` - Submit form (when focused)
- `↑↓` - Navigate between tasks
- `c` - Complete task (when task selected)
- `e` - Edit task (when task selected)
- `Delete` - Delete task (when task selected)
- Visual shortcut hints on UI

### US-7: Animations
As a user, I want smooth animations so that the UI feels polished and responsive.

**Acceptance Criteria:**
- Task card entry animation (fade in + slide up)
- Task card exit animation (fade out)
- Filter/sort transition animation
- Button click feedback
- Form open/close animation
- Loading skeleton fade-in

### US-8: Skeleton Loading
As a user, I want to see skeleton loaders so that I know content is loading.

**Acceptance Criteria:**
- Skeleton cards instead of spinner on initial load
- Pulsing animation on skeleton elements
- Shimmer effect on task cards
- Proper ARIA labels for screen readers

### US-9: Bulk Actions
As a user, I want to select and delete multiple tasks so that I can clean up efficiently.

**Acceptance Criteria:**
- Checkbox on each task card for selection
- "Select all" option
- Bulk delete button appears when tasks selected
- Confirmation dialog for bulk delete
- Clear selection button

### US-10: Drag & Drop Reordering
As a user, I want to drag and drop tasks so that I can reorder them manually.

**Acceptance Criteria:**
- Drag handle on each task card
- Smooth drag preview
- Drop indicator between tasks
- New position saved to backend
- Visual feedback during drag

## Data Model Changes

### Task Model Updates
```typescript
interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  user_id: string
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  position: number  // For drag & drop ordering
  created_at: string
  updated_at: string
}
```

### API Endpoints Updates
- `POST /tasks` - Accepts priority and due_date
- `PUT /tasks/:id` - Accepts priority and due_date
- `PATCH /tasks/:id/complete` - No changes needed
- `GET /tasks` - Accepts sort, search, filter params
- `DELETE /tasks/:id` - No changes needed
- `PATCH /tasks/reorder` - New endpoint for drag & drop

## UI Components

### New Components
1. `ToastContainer.tsx` - Global toast notification container
2. `Toast.tsx` - Individual toast notification
3. `SearchBar.tsx` - Search input with clear button
4. `SortDropdown.tsx` - Sort options dropdown
5. `PriorityBadge.tsx` - Color-coded priority indicator
6. `DueDateBadge.tsx` - Due date display with overdue indicator
7. `TaskSkeleton.tsx` - Loading skeleton for task cards
8. `BulkActionsBar.tsx` - Bar for bulk selected tasks
9. `KeyboardShortcuts.tsx` - Tooltip showing available shortcuts

### Updated Components
1. `TaskForm.tsx` - Add priority and due date fields
2. `TaskCard.tsx` - Add priority, due date, checkbox, drag handle
3. `TasksPage.tsx` - Add search, sort, toast container, keyboard shortcuts

## Visual Design

### Color Scheme
- **High Priority:** Red (#EF4444)
- **Medium Priority:** Yellow (#F59E0B)
- **Low Priority:** Gray (#6B7280)
- **Overdue:** Red badge with icon
- **Due Today:** Orange badge
- **Due Soon:** Yellow badge

### Animations
```css
/* Task entry */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Task exit */
@keyframes slideOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateX(20px); }
}

/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

## Success Criteria

1. ✅ Users can search tasks by title or description
2. ✅ Users can sort tasks by multiple criteria
3. ✅ Users can set and see priority levels
4. ✅ Users can set due dates with visual indicators
5. ✅ Users see toast notifications for all actions
6. ✅ Users can navigate efficiently with keyboard shortcuts
7. ✅ UI has smooth, professional animations
8. ✅ Loading states show skeleton components
9. ✅ Users can select and delete multiple tasks
10. ✅ Users can drag and drop to reorder tasks

## Technical Notes

- **Animations:** Framer Motion - Professional animations with gesture support
- **Drag & Drop:** @dnd-kit/core - Modern, accessible drag and drop
- **Toast Notifications:** react-hot-toast - Lightweight, beautiful toasts
- Implement optimistic updates for better UX
- Debounce search input (300ms)
- Local storage for keyboard shortcuts preferences
- Position field in database for ordering

## Out of Scope

- Task categories/labels
- Task dependencies
- Recurring tasks
- Task reminders/notifications
- Task sharing/collaboration

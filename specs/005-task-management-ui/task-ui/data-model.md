# Data Model: Task Management UI Enhancements

## Task Entity (Extended)

### TypeScript Interface (Frontend)

```typescript
// frontend/types/task.ts

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  user_id: string
  priority: TaskPriority
  due_date: string | null  // ISO 8601 date string
  position: number         // For drag & drop ordering
  created_at: string
  updated_at: string
}

export interface TaskCreate {
  title: string
  description?: string | null
  priority?: TaskPriority
  due_date?: string | null
}

export interface TaskUpdate {
  title?: string
  description?: string | null
  priority?: TaskPriority
  due_date?: string | null
  completed?: boolean
}

export interface TaskReorder {
  task_ids: string[]  // New order of task IDs
}
```

### Python Model (Backend)

```python
# backend/app/models/task.py

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from enum import Enum

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Task(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(foreign_key="user.id", index=True)

    # New fields
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    due_date: Optional[datetime] = Field(default=None)
    position: int = Field(default=0)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    user: "User" = Relationship(back_populates="tasks")
```

## Filter State

```typescript
// frontend/lib/hooks/useTaskFilter.ts

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'title_asc'
  | 'title_desc'
  | 'priority'
  | 'due_date'
  | 'completion'

export interface FilterState {
  search: string
  filter: 'all' | 'active' | 'completed'
  sort: SortOption
}
```

## Toast Notifications

```typescript
// Toast types for react-hot-toast

export type ToastType = 'success' | 'error' | 'info'

export interface ToastConfig {
  type: ToastType
  title: string
  message?: string
  duration?: number  // milliseconds, default 3000
}

// Usage examples:
// toast.success("Task created")
// toast.error("Failed to delete task")
// toast.promise(promise, { loading: "Saving...", success: "Saved!", error: "Failed" })
```

## Selection State

```typescript
// For bulk actions

export interface SelectionState {
  selectedIds: Set<string>
  isAllSelected: boolean
}

// Actions
type SelectionAction =
  | { type: 'SELECT'; id: string }
  | { type: 'DESELECT'; id: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'SELECT_ALL'; ids: string[] }
  | { type: 'CLEAR_ALL' }
  | { type: 'REMOVE'; id: string }  // When task is deleted
```

## Keyboard Shortcuts

```typescript
// frontend/lib/hooks/useKeyboardShortcuts.ts

export interface Shortcut {
  key: string
  action: () => void
  description: string
  category: 'navigation' | 'task' | 'selection'
}

export const SHORTCUTS: Shortcut[] = [
  { key: 'n', action: () => {}, description: 'New task', category: 'task' },
  { key: '/', action: () => {}, description: 'Focus search', category: 'navigation' },
  { key: 'Escape', action: () => {}, description: 'Cancel/Close', category: 'navigation' },
  { key: 'c', action: () => {}, description: 'Complete task', category: 'task' },
  { key: 'e', action: () => {}, description: 'Edit task', category: 'task' },
  { key: 'Delete', action: () => {}, description: 'Delete task', category: 'task' },
  { key: 'j', action: () => {}, description: 'Next task', category: 'selection' },
  { key: 'k', action: () => {}, description: 'Previous task', category: 'selection' },
]
```

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| title | Required, 1-200 chars | "Title is required" |
| description | Optional, 0-1000 chars | N/A |
| priority | Optional, default 'medium' | N/A |
| due_date | Optional, future dates allowed | "Due date must be in the future" |

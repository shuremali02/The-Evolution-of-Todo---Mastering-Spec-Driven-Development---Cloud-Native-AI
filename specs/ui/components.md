# UI Components Specification

## Overview

Reusable React components for the Next.js frontend. All components use TypeScript, Tailwind CSS, and follow App Router conventions.

## Component List

### 1. TaskCard

**File**: `frontend/components/TaskCard.tsx`
**Purpose**: Display a single task with actions.

**Props**:
```typescript
interface TaskCardProps {
  task: Task
  onComplete: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
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

**Visual Elements**:
- Task title (bold, larger text)
- Task description (gray, smaller text, truncated if too long)
- Completion checkbox or button
- "Edit" button (navigates to `/tasks/{id}/edit`)
- "Delete" button (with confirmation)
- Visual indicator if completed (strikethrough, different background)

**Example Layout**:
```
┌──────────────────────────────────────────┐
│ [✓] Buy groceries                        │
│     Get milk, eggs, and bread            │
│     [Edit] [Delete]                      │
└──────────────────────────────────────────┘
```

**Behavior**:
- Click checkbox/complete button → calls `onComplete(task.id)`
- Click edit → navigate to edit page
- Click delete → show confirmation, then call `onDelete(task.id)`
- Completed tasks have strikethrough text and muted colors

**Tailwind Classes** (example):
- Container: `bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow`
- Title: `text-lg font-semibold text-gray-900`
- Description: `text-sm text-gray-600 mt-1`
- Completed: `line-through text-gray-400`

---

### 2. TaskForm

**File**: `frontend/components/TaskForm.tsx`
**Purpose**: Form for creating or editing tasks.

**Props**:
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

**Visual Elements**:
- Title input (text, required, max 200 chars)
- Description textarea (optional, max 1000 chars)
- Character counter for both fields
- Submit button (label from prop)
- Cancel button
- Error message display

**Example Layout**:
```
┌──────────────────────────────────────────┐
│ Title *                                  │
│ [_________________________________] 0/200│
│                                          │
│ Description                              │
│ [                                  ]     │
│ [                                  ]     │
│ [_________________________________] 0/1000│
│                                          │
│ [Submit] [Cancel]                        │
└──────────────────────────────────────────┘
```

**Validation**:
- Title: Required, 1-200 characters
- Description: Optional, max 1000 characters
- Show error messages below fields
- Disable submit if validation fails

**Behavior**:
- Pre-fill with `initialData` if provided (edit mode)
- Client-side validation on blur and submit
- Call `onSubmit` with form data
- Call `onCancel` on cancel button click
- Show loading state while submitting

---

### 3. Navbar

**File**: `frontend/components/Navbar.tsx`
**Purpose**: Navigation bar for authenticated pages.

**Props**:
```typescript
interface NavbarProps {
  userEmail?: string
}
```

**Visual Elements**:
- App logo/name: "Todo App"
- Current user email (optional)
- "Logout" button

**Example Layout**:
```
┌─────────────────────────────────────────────┐
│ Todo App        user@example.com  [Logout]  │
└─────────────────────────────────────────────┘
```

**Behavior**:
- Logout button clears JWT and redirects to `/login`
- Responsive: stacks vertically on mobile

---

### 4. AuthGuard

**File**: `frontend/components/AuthGuard.tsx`
**Purpose**: Protect routes requiring authentication.

**Props**:
```typescript
interface AuthGuardProps {
  children: React.ReactNode
}
```

**Behavior**:
- Check for valid JWT on mount
- If no JWT or expired: redirect to `/login`
- If valid JWT: render `children`
- Show loading state while checking

**Implementation Pattern**:
```typescript
'use client'

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getStoredJWT()
    if (!token || isTokenExpired(token)) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return null

  return <>{children}</>
}
```

---

### 5. Button (Optional Shared Component)

**File**: `frontend/components/Button.tsx`
**Purpose**: Reusable styled button.

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}
```

**Variants**:
- Primary: Blue background, white text
- Secondary: Gray background, dark text
- Danger: Red background, white text

**States**:
- Default
- Hover (darker shade)
- Disabled (gray, cursor not-allowed)
- Loading (spinner icon, disabled)

---

### 6. Input (Optional Shared Component)

**File**: `frontend/components/Input.tsx`
**Purpose**: Reusable styled text input.

**Props**:
```typescript
interface InputProps {
  label: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  maxLength?: number
  placeholder?: string
}
```

**Visual Elements**:
- Label (with required asterisk if needed)
- Input field
- Character counter (if maxLength provided)
- Error message (red text below input)

**States**:
- Default
- Focus (border highlight)
- Error (red border, error message)
- Disabled (grayed out)

---

### 7. ConfirmDialog (Optional)

**File**: `frontend/components/ConfirmDialog.tsx`
**Purpose**: Confirmation modal for destructive actions.

**Props**:
```typescript
interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string  // Default: "Confirm"
  cancelLabel?: string   // Default: "Cancel"
  onConfirm: () => void
  onCancel: () => void
  variant?: 'info' | 'warning' | 'danger'
}
```

**Example**:
```
┌────────────────────────────────┐
│ Delete Task?                   │
│                                │
│ Are you sure you want to       │
│ delete this task? This action  │
│ cannot be undone.              │
│                                │
│         [Cancel] [Delete]      │
└────────────────────────────────┘
```

**Behavior**:
- Overlay prevents interaction with background
- Escape key or outside click closes dialog (calls `onCancel`)
- Confirm button calls `onConfirm`
- Cancel button calls `onCancel`

---

## Component Guidelines

### File Header Attribution
```typescript
/**
 * Task: T-XXX
 * Spec: X.X Component Name
 */
```

### Client vs Server Components
- Use `'use client'` directive when:
  - Component uses React hooks (useState, useEffect, etc.)
  - Component handles user interactions
  - Component needs browser APIs
- Default to Server Components when possible

### Styling
- Use Tailwind utility classes
- NO inline styles: `style={{...}}`
- NO CSS-in-JS libraries
- Consistent spacing: p-4, m-2, etc.

### TypeScript
- Define proper interfaces for all props
- Use strict type checking
- Avoid `any` type

### Error Handling
- Display user-friendly error messages
- Handle loading states
- Handle empty states

## Out of Scope (Phase-2)

❌ Task filter dropdown component
❌ Task search input component
❌ Task sort controls
❌ Bulk selection checkboxes
❌ Tag/category chips
❌ Dark mode toggle
❌ Toast notification system
❌ Pagination controls

---

**Related Specs**:
- Pages: `@specs/ui/pages.md`
- API Endpoints: `@specs/api/rest-endpoints.md`
- Task CRUD: `@specs/features/task-crud.md`

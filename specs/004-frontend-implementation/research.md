# Research: Phase-2 Frontend Component Refactoring

**Date**: 2026-01-01
**Feature**: Frontend Component Refactoring
**Plan**: `plan.md`

## Summary

Research findings on React component design patterns for refactoring monolithic frontend into reusable, spec-compliant components.

---

## RQ-1: TaskForm - Single Component for Create/Edit?

### Decision: **Single component with conditional rendering**

**Rationale**:
1. **Spec Alignment**: UI spec explicitly shows `initialData?: {...}` prop for edit mode
2. **DRY Principle**: Create and edit forms share identical fields (title, description)
3. **React Best Practice**: Conditional rendering based on `initialData` is standard pattern
4. **Maintainability**: Single form logic to update when requirements change
5. **Validation Rules**: Same validation rules apply to both modes

**Implementation Pattern**:
```typescript
interface TaskFormProps {
  initialData?: { title: string; description: string | null }
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function TaskForm({ initialData, onSubmit, onCancel, submitLabel }: TaskFormProps) {
  const isEditMode = !!initialData
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')

  // ... same form for both modes
}
```

**Alternatives Considered**:
- **Separate CreateTaskForm and EditTaskForm**: More separation, but duplicates code
- **Higher-order component**: Overcomplicated for simple form reuse
- **Render props**: Unnecessary complexity for this use case

---

## RQ-2: ConfirmDialog - Portal vs. Inline?

### Decision: **React Portal with z-index overlay**

**Rationale**:
1. **Spec Requirement**: "Overlay prevents interaction with background"
2. **React Best Practice**: Portals render modals outside normal DOM hierarchy
3. **Accessibility**: Portals provide proper focus management for modals
4. **Z-Index Handling**: Portal ensures modal is always on top, regardless of parent stacking
5. **CSS Isolation**: Modal styles won't conflict with parent component

**Implementation Pattern**:
```typescript
'use client'

import { createPortal } from 'react-dom'
import { useEffect } from 'react'

export function ConfirmDialog({ isOpen, onConfirm, onCancel, ... }: ConfirmDialogProps) {
  if (!isOpen) return null

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl">
        {/* Modal content */}
      </div>
    </div>,
    document.body
  )
}
```

**Alternatives Considered**:
- **Inline rendering**: Doesn't prevent interaction with background
- **CSS-only modal**: No React focus management, less accessible
- **Third-party libraries**: Adds dependency, overkill for simple confirmation

---

## RQ-3: Button/Input - Shared Components or Inline?

### Decision: **Extract as shared components**

**Rationale**:
1. **Consistency**: Ensures uniform styling across all forms
2. **Maintainability**: Update button/input styles in one place
3. **Spec Alignment**: Both listed in `specs/ui/components.md` as components
4. **Tailwind Benefits**: Utility classes are easy to compose, but shared components provide variant management
5. **Type Safety**: Stronger prop validation with TypeScript interfaces

**Implementation Pattern**:
```typescript
// Button component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ variant = 'primary', size = 'md', ... }: ButtonProps) {
  const baseClasses = 'rounded-lg transition font-medium'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ...`}>
      {children}
    </button>
  )
}

// Input component
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

export function Input({ label, type = 'text', value, onChange, error, ... }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full px-3 py-2 border rounded-md ${
          error ? 'border-red-500' : 'border-gray-300'
        } ...`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
```

**Alternatives Considered**:
- **Inline elements**: Less consistent, harder to maintain
- **Headless UI components**: Adds dependency, overkill for simple buttons/inputs
- **CSS framework components**: Tailwind doesn't provide component library

---

## RQ-4: Navbar - Props vs. React Context?

### Decision: **Props for Phase-2, Context for future**

**Rationale**:
1. **Spec Alignment**: UI spec explicitly shows `userEmail?: string` prop
2. **Simplicity**: For this phase, only Navbar needs user email
3. **Current State**: AuthGuard handles token, but user data not extracted
4. **Performance**: Context adds overhead for single-component use
5. **Refactoring**: Props are easier to refactor to Context later

**Implementation Pattern (Phase-2)**:
```typescript
interface NavbarProps {
  userEmail?: string
  onLogout: () => void
}

export function Navbar({ userEmail, onLogout }: NavbarProps) {
  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center">
        <h1>Todo App</h1>
        <div className="flex items-center gap-4">
          {userEmail && <span>{userEmail}</span>}
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    </header>
  )
}

// Usage in tasks page
<Navbar
  userEmail={userEmail}  // Will need to fetch user data from JWT or API
  onLogout={() => apiClient.logout()}
/>
```

**Future Enhancement (Phase-3+)**:
If more components need user data, create AuthContext:
```typescript
const AuthContext = createContext<User | null>(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)

  // Fetch user data from /auth/me or decode JWT
  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken()
      if (token) {
        const user = await decodeJWT(token)  // or API call
        setUser(user)
      }
    }
    fetchUser()
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
```

**Alternatives Considered**:
- **Context now**: Overengineered for single-component use
- **Global state (Redux/Zustand)**: Unnecessary complexity for simple auth
- **LocalStorage**: Bad practice, security risk for auth data

---

## RQ-5: TaskCard - Callback Props vs. Event Emitters?

### Decision: **Callback props (functions)**

**Rationale**:
1. **Spec Alignment**: UI spec shows `onComplete: (id: string) => Promise<void>` prop pattern
2. **React Best Practice**: Props are the standard React communication pattern
3. **Simplicity**: No need for event emitter libraries or custom bus
4. **Type Safety**: Callback props are type-checked by TypeScript
5. **Performance**: Direct function calls are faster than event system

**Implementation Pattern**:
```typescript
interface TaskCardProps {
  task: Task
  onComplete: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onEdit: (task: Task) => void  // Navigate to edit page
}

export function TaskCard({ task, onComplete, onDelete, onEdit }: TaskCardProps) {
  const handleComplete = async () => {
    await onComplete(task.id)
  }

  const handleDelete = async () => {
    await onDelete(task.id)
  }

  const handleEdit = () => {
    onEdit(task)  // Parent component navigates to edit page
  }

  return (
    <div className="...">
      <h3>{task.title}</h3>
      <button onClick={handleComplete}>Complete</button>
      <button onClick={onEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

// Usage in parent
<TaskCard
  task={task}
  onComplete={async (id) => {
    await apiClient.completeTask(id)
    refetchTasks()
  }}
  onDelete={async (id) => {
    await apiClient.deleteTask(id)
    refetchTasks()
  }}
  onEdit={(task) => {
    setEditingTask(task)  // Show edit form
  }}
/>
```

**Alternatives Considered**:
- **Event emitters**: Adds dependency (mitt, eventemitter3), overkill
- **Custom event bus**: Unnecessary complexity for parent-child communication
- **Redux dispatch**: Overengineered for simple task operations

---

## Additional Research: State Management Patterns

### Decision: **Component-level state with parent coordination**

**Rationale**:
1. **Current Complexity**: App is small, no need for global state
2. **API-Driven**: All state mutations go through `api.ts`
3. **React Server Components**: Parent can fetch data, children just display
4. **Simplicity**: Easier to test and debug

**State Ownership**:
- **tasks/page.tsx** (parent):
  - `tasks: Task[]` - List of tasks
  - `loading: boolean` - Loading state
  - `error: string | null` - Error state
  - `editingTask: Task | null` - Currently editing task
  - `deleteConfirm: string | null` - Task ID pending deletion
  - Fetch functions (getTasks, createTask, updateTask, completeTask, deleteTask)

- **TaskCard** (child):
  - No state needed (display only)
  - Callbacks to parent for actions

- **TaskForm** (child):
  - `title: string` - Form field
  - `description: string` - Form field
  - `formError: string | null` - Validation error
  - `formLoading: boolean` - Submission state
  - Callback to parent for submit

- **ConfirmDialog** (child):
  - No state needed (controlled by parent via `isOpen` prop)
  - Callbacks to parent for confirm/cancel

**Future Enhancement (Phase-4+)**:
If state complexity grows, consider:
- **TanStack Query (React Query)**: For API caching, loading states
- **Zustand**: For global state if needed
- **React Context**: For theme, user data, auth state

---

## Recommendations Summary

1. **Single TaskForm** with `initialData` prop for create/edit modes ✅
2. **Portal-based ConfirmDialog** with z-index overlay ✅
3. **Shared Button and Input components** for consistency ✅
4. **Props-based Navbar** for Phase-2, Context for future ✅
5. **Callback props** for TaskCard communication ✅
6. **Component-level state** managed by parent component ✅

---

## References

- React Official Docs: Component Composition, Portals
- Tailwind CSS: Best Practices for Component Design
- React TypeScript: Generic Components and Type Safety
- UI Specifications: `specs/ui/components.md`, `specs/ui/pages.md`

**Research Complete** ✅

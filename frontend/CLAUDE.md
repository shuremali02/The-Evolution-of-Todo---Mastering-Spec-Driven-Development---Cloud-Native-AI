# Frontend Rules - Next.js App Router

## Stack Requirements

### Framework & Language
- **Framework**: Next.js 14+ with **App Router** (NOT Pages Router)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS (NO inline styles, NO CSS-in-JS libraries)
- **React Version**: React 18+ with Server Components

### Project Structure
```
frontend/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── tasks/             # Task pages
├── components/            # Reusable React components
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   ├── Navbar.tsx
│   └── AuthGuard.tsx
├── lib/                   # Utility functions
│   └── api.ts            # API client (MANDATORY for all API calls)
└── types/                 # TypeScript type definitions
```

## Core Mandates

### 1. Spec-Driven Development

**Before writing ANY component**, you MUST:

1. Read `@specs/ui/pages.md` for page specifications
2. Read `@specs/ui/components.md` for component specifications
3. Read `@specs/api/rest-endpoints.md` for API contracts
4. Verify the work traces to a valid Task ID

**NEVER** create UI components from memory or assumptions.

### 2. API Communication

All API calls MUST go through `/lib/api.ts`:

```typescript
// ✅ CORRECT
import { apiClient } from '@/lib/api'
const tasks = await apiClient.get('/tasks')

// ❌ WRONG - Direct fetch calls not allowed
const tasks = await fetch('http://localhost:8000/api/v1/tasks')
```

The API client MUST:
- Automatically attach JWT tokens to requests
- Handle token refresh logic
- Provide consistent error handling
- Use proper TypeScript types

### 3. JWT Authentication

**Every API request** to protected endpoints MUST include JWT:

```typescript
Authorization: Bearer <jwt-token>
```

- Token retrieved from secure storage (httpOnly cookies preferred)
- Token attached automatically by `api.ts` client
- Handle 401 responses (token expired/invalid) by redirecting to login
- Never store JWT in localStorage if httpOnly cookies are available

### 4. App Router Requirements

Use App Router conventions:

**Pages**: `app/[route]/page.tsx`
```typescript
// app/tasks/page.tsx
export default function TasksPage() {
  // Server Component by default
}
```

**Layouts**: `app/layout.tsx` or `app/[route]/layout.tsx`
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

**Client Components**: Only when needed
```typescript
'use client'  // Add this directive ONLY when necessary

export function InteractiveComponent() {
  const [state, setState] = useState()
  // ...
}
```

### 5. No Inline Styles

All styling MUST use Tailwind CSS classes:

```typescript
// ✅ CORRECT
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// ❌ WRONG - No inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

### 6. TypeScript Strict Mode

All code MUST:
- Use TypeScript strict mode
- Define proper types for props, state, and API responses
- Avoid `any` type (use `unknown` if truly needed)
- Use proper type imports from `@specs/api/`

Example:
```typescript
interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}

interface TaskCardProps {
  task: Task
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  // ...
}
```

## File Attribution

Every component file MUST include header comments:

```typescript
/**
 * Task: T-XXX
 * Spec: X.X Component/Page Name
 */

'use client'  // if needed

import { ... }

export function ComponentName() {
  // ...
}
```

## Component Guidelines

### Server Components (Default)

Use Server Components when:
- No interactivity needed
- Fetching data from API
- Rendering static content

```typescript
// app/tasks/page.tsx
export default async function TasksPage() {
  const tasks = await fetch('...') // Server-side fetch
  return <TaskList tasks={tasks} />
}
```

### Client Components

Use Client Components (`'use client'`) when:
- Using React hooks (useState, useEffect, etc.)
- Handling user interactions
- Using browser APIs
- Subscribing to events

```typescript
'use client'

import { useState } from 'react'

export function TaskForm() {
  const [title, setTitle] = useState('')
  // ...
}
```

### Component Composition

Keep components small and focused:

```typescript
// Good: Focused components
<TaskList>
  <TaskCard />
  <TaskCard />
</TaskList>

// Bad: Monolithic component
<TasksPageWithEverything />
```

## Authentication Flow

### Protected Routes

Use `AuthGuard` component to protect routes:

```typescript
// app/tasks/layout.tsx
import { AuthGuard } from '@/components/AuthGuard'

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  )
}
```

### Login/Signup Pages

Must follow `@specs/features/authentication.md`:

- Call `/api/v1/auth/login` or `/api/v1/auth/signup`
- Store JWT securely (httpOnly cookie preferred)
- Redirect to tasks page on success
- Display validation errors clearly

## API Client Implementation

The `lib/api.ts` file MUST implement:

```typescript
/**
 * Task: T-XXX
 * Spec: X.X API Client
 */

class ApiClient {
  private baseURL: string
  private getToken: () => string | null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken()

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Token expired - redirect to login
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Request failed')
    }

    return response.json()
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' })
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1')
```

## Error Handling

Handle errors consistently:

```typescript
'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'

export function TaskForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: TaskData) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.post('/tasks', data)
      // Success handling
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}
      {/* Form fields */}
    </form>
  )
}
```

## Environment Variables

Required environment variables in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

All components should be testable:

- Use React Testing Library
- Test user interactions
- Mock API calls via `api.ts`
- Test authentication flows

## Forbidden Practices

❌ **DO NOT**:
- Use Pages Router (use App Router only)
- Write inline styles
- Make direct `fetch` calls (use `api.ts`)
- Store JWT in localStorage if httpOnly cookies available
- Use `any` type in TypeScript
- Create components without reading specs
- Implement features not in `@specs/ui/`
- Skip Task ID attribution in file headers

## Development Workflow

1. **Read Specs**: Check `@specs/ui/pages.md` and `@specs/ui/components.md`
2. **Define Types**: Create TypeScript interfaces based on API schema
3. **Build Component**: Follow App Router conventions
4. **Style with Tailwind**: Use utility classes, no inline styles
5. **Connect to API**: Use `api.ts` client with JWT
6. **Test**: Verify functionality and error handling
7. **Attribute**: Add Task ID comments to files

## Example Component Structure

```typescript
/**
 * Task: T-042
 * Spec: 3.2 Task Card Component
 */

'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
}

interface TaskCardProps {
  task: Task
  onUpdate: () => void
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    try {
      setLoading(true)
      await apiClient.patch(`/tasks/${task.id}/complete`, {})
      onUpdate()
    } catch (error) {
      console.error('Failed to complete task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
      <p className="mt-2 text-gray-600">{task.description}</p>
      <button
        onClick={handleComplete}
        disabled={loading || task.completed}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : task.completed ? 'Completed' : 'Mark Complete'}
      </button>
    </div>
  )
}
```

## Questions?

- **Spec unclear?** Ask user to run `/sp.clarify` on UI specs
- **API contract unclear?** Check `@specs/api/rest-endpoints.md`
- **Auth flow unclear?** Check `@specs/features/authentication.md`

---

**Remember**: Always read specs before coding. Never guess or assume requirements.

# Quickstart: Task Management Frontend UI

**Feature**: Task Management Frontend UI
**Branch**: `005-task-management-ui`
**Date**: 2026-01-02

## Prerequisites

### Development Environment

Ensure you have the following installed:

- **Node.js**: 18.x or higher (required for Next.js 14+)
- **npm** or **yarn** or **pnpm**: Latest version
- **Git**: Latest version

### Backend Services

Before working on frontend, ensure backend is running:

```bash
# Terminal 1 - Start backend
cd backend
uvicorn app.main:app --reload --port 8000

# Backend should be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Environment Variables

Create or verify `.env.local` in frontend directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify installation
npm run build  # Should complete without errors

# Start development server
npm run dev
```

### Verify Setup

1. Open http://localhost:3000 in browser
2. Navigate to /tasks - should redirect to /login
3. Register a new user at /signup
4. After login, should see empty tasks page

## Project Structure

```
frontend/
├── app/
│   ├── tasks/
│   │   ├── page.tsx      # Tasks list page
│   │   └── layout.tsx    # Tasks layout with AuthGuard
│   ├── login/            # Existing login page
│   └── signup/           # Existing signup page
├── components/
│   ├── TaskCard.tsx      # NEW - Task display card
│   ├── TaskForm.tsx      # NEW - Create/edit form
│   ├── ConfirmDialog.tsx # NEW - Delete confirmation
│   └── AuthGuard.tsx     # EXISTING - Route protection
├── lib/
│   └── api.ts            # EXISTING - API client
├── types/
│   └── task.ts           # NEW - Task type definitions
└── hooks/
    └── useTasks.ts       # NEW - Task data management hook
```

## Running Tests

### Unit Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- TaskCard.test.tsx

# Generate coverage report
npm test -- --coverage
```

### Test Files Structure

```
frontend/tests/
├── components/
│   ├── TaskCard.test.tsx
│   ├── TaskForm.test.tsx
│   └── ConfirmDialog.test.tsx
└── pages/
    └── TasksPage.test.tsx
```

### Writing Tests

```typescript
// Example: TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskCard } from '@/components/TaskCard'

describe('TaskCard', () => {
  const mockTask = {
    id: '123',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    user_id: 'user-123',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }

  it('renders task title', () => {
    render(<TaskCard task={mockTask} onUpdate={() => {}} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('shows complete button for incomplete task', () => {
    render(<TaskCard task={mockTask} onUpdate={() => {}} />)
    expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument()
  })
})
```

## Development Workflow

### 1. Create Component

```bash
# Generate component file structure
# Edit frontend/components/TaskCard.tsx
```

### 2. Add Types

```bash
# Update frontend/types/task.ts
# Export new interfaces
```

### 3. Implement Logic

```bash
# Edit frontend/hooks/useTasks.ts
# Add state management and API calls
```

### 4. Compose Page

```bash
# Edit frontend/app/tasks/page.tsx
# Import and use components
```

### 5. Test Component

```bash
npm test -- --watch
# Add tests for new functionality
```

### 6. Verify Integration

```bash
# Start frontend
npm run dev

# Test in browser:
# 1. Create task
# 2. Edit task
# 3. Complete task
# 4. Delete task
# 5. Verify error states
# 6. Test mobile responsive
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run all tests |
| `npm test -- --watch` | Run tests in watch mode |
| `npm test -- --coverage` | Generate coverage report |
| `npm run type-check` | Run TypeScript compiler check |

## Debugging

### React DevTools

Install React DevTools browser extension to:
- Inspect component hierarchy
- View props and state
- Debug re-renders

### Next.js Debug

Add debug logging:

```typescript
// In components
console.log('[TaskCard] Rendering with task:', task.id)
```

### API Debugging

Check network tab in browser DevTools to:
- View API requests
- Check JWT token attachment
- Monitor response times

## Common Issues

### "Cannot find module '@/components/TaskCard'"

Ensure:
1. File is in `frontend/components/TaskCard.tsx`
2. File exports default component
3. `tsconfig.json` has `@/*` path alias configured

### "JWT token not attached"

Ensure:
1. User is logged in (sessionStorage has access_token)
2. api.ts is configured correctly
3. CORS is configured on backend

### "Task list not loading"

Check:
1. Backend is running at localhost:8000
2. NEXT_PUBLIC_API_URL is correct in .env.local
3. User is authenticated (AuthGuard passes)

### TypeScript errors

Run type check:

```bash
cd frontend
npx tsc --noEmit
```

Fix any type errors before committing.

## Building for Production

```bash
cd frontend
npm run build
npm run start
```

Production build:
- Optimizes React components
- Minifies CSS and JavaScript
- Generates static assets
- Enables caching

## Deployment Checklist

- [ ] All tests pass
- [ ] TypeScript compilation succeeds (no errors)
- [ ] ESLint passes
- [ ] Build completes successfully
- [ ] Responsive design verified
- [ ] Accessibility tested
- [ ] Performance acceptable (load < 2s)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

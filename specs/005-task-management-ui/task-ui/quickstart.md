# Quickstart: Task Management UI Enhancements

## Installation

```bash
# Install new dependencies
npm install framer-motion @dnd-kit/core react-hot-toast date-fns
```

## Development Workflow

### 1. Update Backend (Database Schema)

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Add priority, due_date, position to tasks"

# Apply migration
alembic upgrade head
```

### 2. Update Frontend Types

```bash
cd frontend

# Update types/task.ts with new Task interface
```

### 3. Run Development Server

```bash
# Frontend (in one terminal)
npm run dev

# Backend (in another terminal)
cd backend
uvicorn app.main:app --reload
```

### 4. Access Application

Open http://localhost:3000/tasks

## Component Development Order

Recommended implementation order for new features:

1. **PriorityBadge** - Simple visual component
2. **DueDateBadge** - Date formatting with date-fns
3. **SearchBar** - Input with debounce
4. **SortDropdown** - Dropdown menu
5. **TaskForm updates** - Add priority & due_date fields
6. **TaskCard updates** - Add priority, due_date, checkbox, drag handle
7. **TaskSkeleton** - Loading placeholder
8. **ToastContainer** - react-hot-toast integration
9. **KeyboardShortcuts** - Help modal
10. **BulkActionsBar** - Multi-select UI
11. **TasksPage integration** - All features together

## Testing

```bash
# Frontend tests
npm test -- --watch=false

# Specific component test
npm test -- TaskCard.test.tsx

# E2E tests
npm run test:e2e
```

## API Testing

```bash
# Test new endpoints
curl -X GET "http://localhost:8000/api/v1/tasks?sort=newest&search=task"

# Create task with priority
curl -X POST "http://localhost:8000/api/v1/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "priority": "high", "due_date": "2026-01-15"}'
```

## Debug Tips

- Use React DevTools to inspect component state
- Enable Framer Motion debugging: `import { motion } from 'framer-motion'; motion.log = true;`
- Check Network tab for API responses
- Use `date-fns` for consistent date formatting: `format(new Date(), 'MMM d, yyyy')`

## Common Issues

| Issue | Solution |
|-------|----------|
| DnD not working on mobile | Ensure `@dnd-kit/core` touch sensors are configured |
| Toast not showing | Check `Toaster` component is rendered in root layout |
| Animations jerky | Use `layout` prop in Framer Motion for smooth reordering |
| Search not filtering | Verify debounce is working (300ms delay) |

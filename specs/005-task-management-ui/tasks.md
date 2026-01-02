# Tasks: Task Management UI Enhancements

**Feature**: Task Management UI Enhancements (10 New Features)
**Branch**: `005-task-management-ui`
**Spec**: [task-ui/spec.md](./task-ui/spec.md)
**Plan**: [plan.md](./plan.md)
**Date**: 2026-01-02
**Tests**: Not explicitly requested - tests are OUT OF SCOPE for this feature

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create directory structure for new features

### Dependencies

- [ ] T001 Install frontend dependencies
  ```bash
  cd frontend && npm install framer-motion @dnd-kit/core react-hot-toast date-fns
  ```

### Directory Structure

- [ ] T002 [P] Create toast component directory
  ```bash
  mkdir -p frontend/src/components/toast
  ```

- [ ] T003 [P] Create task sub-components directory
  ```bash
  mkdir -p frontend/src/components/task
  ```

- [ ] T004 [P] Create hooks directory
  ```bash
  mkdir -p frontend/src/lib/hooks
  ```

---

## Phase 2: Foundational Backend Updates

**Purpose**: Update database schema, API models, and create migration for new Task fields

### Backend Model Updates

- [ ] T010 [P] Update Task model in backend/app/models/task.py
  ```python
  # Add priority, due_date, position fields to Task class
  ```

- [ ] T011 [P] Update Task schema in backend/app/schemas/task.py
  ```python
  # Add priority, due_date to TaskCreate, TaskUpdate schemas
  ```

- [ ] T012 [P] Create Alembic migration for Task table
  ```bash
  cd backend && alembic revision --autogenerate -m "Add priority, due_date, position to tasks"
  ```

### Backend API Updates

- [ ] T013 [P] Update GET /tasks endpoint in backend/app/api/tasks.py
  ```python
  # Add search, sort, filter query parameters
  ```

- [ ] T014 [P] Update POST /tasks to accept priority and due_date in backend/app/api/tasks.py
  ```python
  # Accept priority and due_date in request body
  ```

- [ ] T015 [P] Update PUT /tasks/:id to accept priority and due_date in backend/app/api/tasks.py
  ```python
  # Accept priority and due_date in request body
  ```

- [ ] T016 [P] Create new endpoint PATCH /tasks/reorder in backend/app/api/tasks.py
  ```python
  # Accept task_ids array and update position field
  ```

### Frontend Types Update

- [ ] T017 Update Task interface in frontend/types/task.ts
  ```typescript
  // Add priority, due_date, position fields
  ```

---

## Phase 3: US-3 - Priority Levels [P1]

**Goal**: Users can set and see priority levels (Low/Medium/High)

**Independent Test**: Create task with priority, verify badge color on card

### Components

- [ ] T020 [US3] Create PriorityBadge component in frontend/src/components/task/PriorityBadge.tsx
  ```tsx
  // Color-coded badge: High=Red, Medium=Orange, Low=Gray
  ```

- [ ] T021 [US3] Update TaskForm to add priority selector in frontend/src/components/TaskForm.tsx
  ```tsx
  // Add Select component for priority with 3 options
  ```

- [ ] T022 [US3] Update TaskCard to display PriorityBadge in frontend/src/components/TaskCard.tsx
  ```tsx
  // Render PriorityBadge next to task title
  ```

- [ ] T023 [US3] Add priority sort option to SortDropdown (future component)

---

## Phase 4: US-4 - Due Dates [P1]

**Goal**: Users can set and see due dates for tasks

**Independent Test**: Create task with due date, verify date displays on card

### Components

- [ ] T030 [US4] Create DueDateBadge component in frontend/src/components/task/DueDateBadge.tsx
  ```tsx
  // Date display with overdue/today/soon indicators using date-fns
  ```

- [ ] T031 [US4] Update TaskForm to add date picker in frontend/src/components/TaskForm.tsx
  ```tsx
  // Add date input for due_date
  ```

- [ ] T032 [US4] Update TaskCard to display DueDateBadge in frontend/src/components/TaskCard.tsx
  ```tsx
  // Render DueDateBadge below task description
  ```

- [ ] T033 [US4] Add due_date sort option to SortDropdown (future component)

---

## Phase 5: US-1 - Search Tasks [P1]

**Goal**: Users can search tasks by title or description

**Independent Test**: Type in search box, verify tasks filter in real-time

### Components

- [ ] T040 [US1] Create SearchBar component in frontend/src/components/task/SearchBar.tsx
  ```tsx
  // Input with debounce (300ms) and clear button
  ```

- [ ] T041 [US1] Update TasksPage to implement search state in frontend/app/tasks/page.tsx
  ```tsx
  // Add search state and filtering logic
  ```

- [ ] T042 [US1] Create EmptySearchState component for no results

---

## Phase 6: US-2 - Sort Tasks [P1]

**Goal**: Users can sort tasks by various criteria

**Independent Test**: Select sort option, verify tasks reorder

### Components

- [ ] T050 [US2] Create SortDropdown component in frontend/src/components/task/SortDropdown.tsx
  ```tsx
  // Dropdown with 6 options: Newest, Oldest, Title A-Z, Title Z-A, Priority, Due Date
  ```

- [ ] T051 [US2] Update TasksPage to implement sort state in frontend/app/tasks/page.tsx
  ```tsx
  // Add sort state and sorting logic
  ```

---

## Phase 7: US-5 - Toast Notifications [P2]

**Goal**: Users see notifications when actions complete

**Independent Test**: Create/update/delete task, verify toast appears

### Components

- [ ] T060 [US5] Create ToastContainer with Toaster in frontend/src/components/toast/ToastContainer.tsx
  ```tsx
  // Global toast provider using react-hot-toast
  ```

- [ ] T061 [US5] Create toast helper functions in frontend/src/lib/toast.ts
  ```typescript
  // successToast, errorToast, infoToast helpers
  ```

- [ ] T062 [US5] Integrate toast in TasksPage for CRUD operations in frontend/app/tasks/page.tsx

---

## Phase 8: US-6 - Keyboard Shortcuts [P2]

**Goal**: Users can navigate faster with keyboard shortcuts

**Independent Test**: Press `n`, `/`, `Esc`, verify actions happen

### Components

- [ ] T070 [US6] Create useKeyboardShortcuts hook in frontend/src/lib/hooks/useKeyboardShortcuts.ts
  ```typescript
  // Hook for registering keyboard shortcuts
  ```

- [ ] T071 [US6] Create KeyboardShortcuts help modal in frontend/src/components/layout/KeyboardShortcuts.tsx
  ```tsx
  // Modal showing available shortcuts
  ```

- [ ] T072 [US6] Integrate keyboard shortcuts in TasksPage in frontend/app/tasks/page.tsx

---

## Phase 9: US-7 - Animations [P3]

**Goal**: UI feels polished with smooth animations

**Independent Test**: Add/delete task, verify smooth animations

### Components

- [ ] T080 [US7] Wrap TaskCard with Framer Motion in frontend/src/components/TaskCard.tsx
  ```tsx
  // Add initial/animate/exit props for entry/exit animations
  ```

- [ ] T081 [US7] Add TaskForm open/close animation in frontend/src/components/TaskForm.tsx
  ```tsx
  // AnimatePresence for form transitions
  ```

- [ ] T082 [US7] Add task list layout animation in frontend/app/tasks/page.tsx
  ```tsx
  // Use AnimatePresence for list transitions
  ```

---

## Phase 10: US-8 - Skeleton Loading [P3]

**Goal**: Users see skeleton loaders instead of spinners

**Independent Test**: Reload page, verify skeleton cards shown

### Components

- [ ] T090 [US8] Create TaskSkeleton component in frontend/src/components/task/TaskSkeleton.tsx
  ```tsx
  // Skeleton matching TaskCard layout with shimmer effect
  ```

- [ ] T091 [US8] Update TasksPage to show skeleton while loading in frontend/app/tasks/page.tsx
  ```tsx
  // Replace spinner with TaskSkeleton list
  ```

---

## Phase 11: US-9 - Bulk Actions [P3]

**Goal**: Users can select and delete multiple tasks

**Independent Test**: Select multiple tasks, delete, verify removed

### Components

- [ ] T100 [US9] Update TaskCard to add checkbox in frontend/src/components/TaskCard.tsx
  ```tsx
  // Add selection checkbox to card
  ```

- [ ] T101 [US9] Create BulkActionsBar component in frontend/src/components/task/BulkActionsBar.tsx
  ```tsx
  // Bar showing selected count and bulk delete button
  ```

- [ ] T102 [US9] Implement selection state management in frontend/app/tasks/page.tsx
  ```tsx
  // Track selected IDs, handle bulk operations
  ```

- [ ] T103 [US9] Add bulk delete API call in frontend/lib/api.ts
  ```typescript
  // Call DELETE /tasks/bulk or loop individual deletes
  ```

---

## Phase 12: US-10 - Drag & Drop Reordering [P3]

**Goal**: Users can drag and drop to reorder tasks

**Independent Test**: Drag task to new position, verify order saves

### Components

- [ ] T110 [US10] Add drag handle to TaskCard in frontend/src/components/TaskCard.tsx
  ```tsx
  // Drag handle icon on right side
  ```

- [ ] T111 [US10] Create DnD context in TasksPage in frontend/app/tasks/page.tsx
  ```tsx
  // Wrap task list with DndContext, SortableContext from @dnd-kit
  ```

- [ ] T112 [US10] Make TaskCard draggable using @dnd-kit/sortable in frontend/src/components/TaskCard.tsx
  ```tsx
  // Implement useSortable hook
  ```

- [ ] T113 [US10] Implement reorder API call to save new order in frontend/lib/api.ts
  ```typescript
  // Call PATCH /tasks/reorder on drag end
  ```

---

## Phase 13: Polish & Cross-Cutting [P4]

**Goal**: Final integration, accessibility, and polish

### Integration

- [ ] T120 Update TasksPage to integrate all new components in frontend/app/tasks/page.tsx
  ```tsx
  // Combine SearchBar, SortDropdown, ToastContainer, KeyboardShortcuts
  ```

### Utilities

- [ ] T121 Update frontend/lib/api.ts with new API methods for reorder, bulk delete

### Accessibility & Responsive

- [ ] T122 Add keyboard shortcut hints to UI (tooltip on button hover)

- [ ] T123 Ensure mobile responsiveness for all new components

- [ ] T124 Add ARIA labels and accessibility improvements throughout

### Performance

- [ ] T125 Test keyboard navigation flow

- [ ] T126 Final visual polish - spacing, colors, transitions

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Backend) → US-3, US-4 → US-1, US-2 → US-5, US-6 → US-7, US-8 → US-9, US-10 → Phase 13 (Polish)
```

### User Story Dependencies

| User Story | Depends On | Description |
|------------|------------|-------------|
| US-3 Priority | Backend (T010-T017) | Adds fields to TaskForm/TaskCard |
| US-4 Due Dates | Backend (T010-T017) | Adds date picker to TaskForm |
| US-1 Search | US-3, US-4 | Uses filtered task list |
| US-2 Sort | US-3, US-4 | Uses priority/due_date fields |
| US-5 Toast | US-1, US-2 | Works with all CRUD ops |
| US-6 Shortcuts | US-1, US-2 | Needs search/sort state |
| US-7 Animations | All above | Enhances existing UI |
| US-8 Skeleton | All above | Replaces loading spinner |
| US-9 Bulk | TaskCard checkbox | Adds selection state |
| US-10 Drag&Drop | TaskCard updates | Uses @dnd-kit |

### Parallel Execution Opportunities

- Phase 1: T001-T004 can run in parallel
- Phase 2: T010-T016 can run in parallel
- Phase 3 (US-3) and Phase 4 (US-4) can run in parallel - both update TaskForm/TaskCard
- Phase 5 (US-1) and Phase 6 (US-2) can run in parallel - both use filter state
- Phase 7 (US-5) and Phase 8 (US-6) can run in parallel
- Phase 9 (US-7) and Phase 10 (US-8) can run in parallel
- Phase 11 (US-9) and Phase 12 (US-10) can run in parallel - both update TaskCard

---

## Implementation Strategy

### Recommended MVP Order (Priority)

1. **Phase 1 + Phase 2**: Setup + Backend updates (foundation)
2. **US-3 (Priority) + US-4 (Due Dates)**: Core data fields
3. **US-1 (Search) + US-2 (Sort)**: Filter functionality
4. **US-5 (Toast) + US-6 (Shortcuts)**: UX improvements
5. **US-7 (Anim) + US-8 (Skeleton)**: Polish
6. **US-9 (Bulk) + US-10 (DnD)**: Advanced features

### Parallel Example (US-3 + US-4)

```bash
Task: "Create PriorityBadge component"
Task: "Create DueDateBadge component"
Task: "Update TaskForm with priority selector"
Task: "Update TaskForm with date picker"
```

---

## Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | T001-T004 | Setup: Dependencies & directories |
| Phase 2 | T010-T017 | Backend: Model, API, Types |
| Phase 3 | T020-T023 | US-3: Priority Levels |
| Phase 4 | T030-T033 | US-4: Due Dates |
| Phase 5 | T040-T042 | US-1: Search Tasks |
| Phase 6 | T050-T051 | US-2: Sort Tasks |
| Phase 7 | T060-T062 | US-5: Toast Notifications |
| Phase 8 | T070-T072 | US-6: Keyboard Shortcuts |
| Phase 9 | T080-T082 | US-7: Animations |
| Phase 10 | T090-T091 | US-8: Skeleton Loading |
| Phase 11 | T100-T103 | US-9: Bulk Actions |
| Phase 12 | T110-T113 | US-10: Drag & Drop |
| Phase 13 | T120-T126 | Polish: Integration & accessibility |
| **Total** | **50 tasks** | |

---

## File Reference Summary

| Task | File |
|------|------|
| T001 | frontend/package.json (dependencies) |
| T002 | frontend/src/components/toast/ |
| T003 | frontend/src/components/task/ |
| T004 | frontend/src/lib/hooks/ |
| T010 | backend/app/models/task.py |
| T011 | backend/app/schemas/task.py |
| T012 | backend/migrations/versions/ |
| T013-T016 | backend/app/api/tasks.py |
| T017 | frontend/types/task.ts |
| T020 | frontend/src/components/task/PriorityBadge.tsx |
| T021 | frontend/src/components/TaskForm.tsx |
| T022 | frontend/src/components/TaskCard.tsx |
| T030 | frontend/src/components/task/DueDateBadge.tsx |
| T040 | frontend/src/components/task/SearchBar.tsx |
| T050 | frontend/src/components/task/SortDropdown.tsx |
| T060 | frontend/src/components/toast/ToastContainer.tsx |
| T070 | frontend/src/lib/hooks/useKeyboardShortcuts.ts |
| T080 | frontend/src/components/TaskCard.tsx (animations) |
| T090 | frontend/src/components/task/TaskSkeleton.tsx |
| T100 | frontend/src/components/TaskCard.tsx (checkbox) |
| T110 | frontend/src/components/TaskCard.tsx (drag handle) |
| T120 | frontend/app/tasks/page.tsx |

---

## Verification Checklist

Before marking tasks complete:

- [ ] All file paths exist at specified locations
- [ ] All TypeScript files compile without errors
- [ ] No inline styles (Tailwind CSS only)
- [ ] Framer Motion animations work smoothly
- [ ] @dnd-kit drag and drop works on mobile
- [ ] react-hot-toast notifications appear correctly
- [ ] Keyboard shortcuts are documented and work
- [ ] Skeleton loaders replace spinners
- [ ] Bulk selection and delete works
- [ ] Task reordering persists on backend
- [ ] Priority and due date fields save correctly
- [ ] Search and sort work together
- [ ] ARIA labels on all interactive elements
- [ ] Responsive design on mobile/tablet/desktop

---

**Tasks Generated**: 2026-01-02
**Feature**: Task Management UI Enhancements (10 new features)

---

**End of tasks.md**

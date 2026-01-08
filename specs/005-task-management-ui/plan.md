# Implementation Plan: Task Management UI Enhancements

**Branch**: `005-task-management-ui` | **Date**: 2026-01-02 | **Spec**: [task-ui/spec.md](./task-ui/spec.md)
**Input**: Feature specification from `/specs/005-task-management-ui/task-ui/spec.md`

## Summary

Enhance the tasks page with 10 professional features: search, sorting, priority levels, due dates, toast notifications, keyboard shortcuts, animations (Framer Motion), skeleton loading, bulk actions, and drag-and-drop reordering (@dnd-kit/core). This is a frontend-only enhancement that extends existing Task model with priority, due_date, and position fields.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 14+ (App Router), React 18+
**Primary Dependencies**:
- `framer-motion` - Animations (Clarified: Framer Motion)
- `@dnd-kit/core` - Drag & Drop (Clarified: @dnd-kit/core)
- `react-hot-toast` - Toast Notifications (Clarified: react-hot-toast)
**Storage**: Frontend state + existing REST API endpoints (Neon PostgreSQL backend)
**Testing**: Jest + React Testing Library
**Target Platform**: Web browser (responsive)
**Project Type**: Web application (Next.js + FastAPI)
**Performance Goals**: <100ms search filtering, smooth 60fps animations
**Constraints**: Mobile-responsive, accessible (WCAG 2.1), dark mode ready
**Scale/Scope**: Single-user task management (<1000 tasks typical)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Spec exists | ✅ PASS | spec.md in task-ui/ |
| No implementation before spec | ✅ PASS | Spec created first |
| Task IDs required | ✅ PASS | Will be generated in tasks.md |
| Code attribution required | ✅ PASS | Will follow CLAUDE.md rules |
| Frontend-only changes | ✅ PASS | No backend schema changes needed yet |

## Project Structure

### Documentation (this feature)

```text
specs/005-task-management-ui/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output
├── task-ui/
│   ├── spec.md          # Feature specification
│   ├── data-model.md    # Phase 1 output
│   ├── quickstart.md    # Phase 1 output
│   ├── contracts/       # Phase 1 output
│   └── checklists/
│       └── requirements.md
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── toast/
│   │   │   ├── ToastContainer.tsx
│   │   │   └── Toast.tsx
│   │   ├── task/
│   │   │   ├── TaskCard.tsx       # Updated with priority, due_date, drag handle
│   │   │   ├── TaskForm.tsx       # Updated with priority, due_date fields
│   │   │   ├── TaskSkeleton.tsx   # New skeleton loader
│   │   │   ├── SearchBar.tsx      # New search input
│   │   │   ├── SortDropdown.tsx   # New sort options
│   │   │   ├── PriorityBadge.tsx  # New priority indicator
│   │   │   ├── DueDateBadge.tsx   # New due date display
│   │   │   └── BulkActionsBar.tsx # New bulk actions
│   │   ├── layout/
│   │   │   └── KeyboardShortcuts.tsx  # New shortcuts tooltip
│   │   └── ui/                   # Shared UI components
│   ├── app/
│   │   └── tasks/
│   │       ├── page.tsx          # Updated with all features
│   │       └── layout.tsx
│   ├── lib/
│   │   ├── api.ts                # Updated API methods
│   │   └── hooks/
│   │       └── useKeyboardShortcuts.ts
│   └── types/
│       └── task.ts               # Updated Task interface
└── tests/
    ├── components/
    │   ├── TaskCard.test.tsx
    │   └── TaskForm.test.tsx
    └── e2e/
        └── tasks.spec.ts

backend/
├── app/
│   ├── models/
│   │   └── task.py               # Database model update
│   ├── schemas/
│   │   └── task.py               # Pydantic schema update
│   └── api/
│       └── tasks.py              # Updated endpoints
└── migrations/
    └── versions/                 # Alembic migration
```

**Structure Decision**: This is a Phase-2 web application with Next.js frontend and FastAPI backend. The feature is primarily frontend-focused, adding new UI capabilities to the existing tasks page while extending the Task model for priority and due_date support.

## Phase 0: Research Required

### Technologies to Research

1. **Framer Motion in Next.js App Router**
   - SSR compatibility patterns
   - AnimatePresence for exit animations
   - Gesture support integration

2. **@dnd-kit Core Patterns**
   - Sortable items with keyboard support
   - Integration with React state
   - Touch/pointer events handling

3. **react-hot-toast Best Practices**
   - Custom toast components
   - Promise-based notifications
   - Positioning and stacking

### Unknowns Resolved

| Topic | Resolution |
|-------|------------|
| Animations library | Framer Motion - professional animations with gesture support |
| Drag & Drop library | @dnd-kit/core - modern, accessible drag and drop |
| Toast library | react-hot-toast - lightweight, beautiful toasts |

## Phase 1: Design & Contracts

### Entities (from spec)

1. **Task** - Extended with priority, due_date, position
2. **Toast** - Notification states (success, error, info)
3. **FilterState** - Search query, sort option, filter type
4. **SelectionState** - Set of selected task IDs

### API Contracts (Backend Updates Needed)

```
GET /tasks
  Query params: search?, sort?, filter?, page?, limit?
  Response: Task[] with new fields

POST /tasks
  Body: { title, description?, priority?, due_date? }
  Response: Task

PUT /tasks/:id
  Body: { title?, description?, priority?, due_date? }
  Response: Task

PATCH /tasks/reorder
  Body: { task_ids: string[] }
  Response: { success: true }
```

### Quickstart Notes

1. Install: `npm install framer-motion @dnd-kit/core react-hot-toast date-fns`
2. Update Task interface in `types/task.ts`
3. Add database migration for priority, due_date, position fields
4. Update API endpoints to accept new fields
5. Build components in this order:
   - PriorityBadge, DueDateBadge
   - SearchBar, SortDropdown
   - TaskForm (with new fields)
   - TaskCard (with new fields + checkbox + drag handle)
   - ToastContainer with react-hot-toast
   - KeyboardShortcuts help modal
   - BulkActionsBar
   - TaskSkeleton
   - Update TasksPage to integrate all

## Complexity Tracking

> **No violations - all requirements within scope**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | This is a straightforward UI enhancement | N/A |

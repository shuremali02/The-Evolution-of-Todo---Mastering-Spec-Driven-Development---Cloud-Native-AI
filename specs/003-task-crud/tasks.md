# Tasks: Task CRUD Operations

**Feature**: 003-task-crud
**Branch**: `003-task-crud`
**Input**: Design documents from `/specs/003-task-crud/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Status**: ✅ Already complete (from 002-authentication)

- [x] T001 Project structure created with backend/ and frontend/
- [x] T002 FastAPI backend initialized with dependencies
- [x] T003 Next.js frontend initialized with TypeScript
- [x] T004 Neon PostgreSQL database connection configured
- [x] T005 Environment configuration in .env files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Status**: ✅ Already complete (from 002-authentication)

- [x] T006 Database connection and session management in backend/app/database.py
- [x] T007 JWT token creation and validation in backend/app/auth/jwt.py
- [x] T008 JWT authentication dependency in backend/app/auth/dependencies.py::get_current_user_id()
- [x] T009 User model with UUID, email, hashed_password in backend/app/models/user.py
- [x] T010 Alembic migrations framework configured
- [x] T011 CORS middleware configured in backend/app/main.py
- [x] T012 Frontend AuthGuard component for protected routes

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: Backend Data Model (Blocking for All Stories)

**Purpose**: Create Task model and database migration - BLOCKS all 6 user stories

**⚠️ CRITICAL**: All user stories depend on this phase being complete

- [ ] T013 [P] Create Task SQLModel in backend/app/models/task.py with fields (id, title, description, completed, user_id, created_at, updated_at) and foreign key to users.id
- [ ] T014 Update User model in backend/app/models/user.py to add tasks relationship field (List["Task"] = Relationship(back_populates="user"))
- [ ] T015 Create Pydantic schemas in backend/app/schemas/task.py (TaskCreate, TaskUpdate, TaskResponse)
- [ ] T016 Create Alembic migration in backend/migrations/versions/002_create_tasks.py using `alembic revision --autogenerate -m "Create tasks table"`
- [ ] T017 Apply migration with `alembic upgrade head` to create tasks table in Neon database

**Checkpoint**: ✅ Tasks table exists - all user stories can now proceed in parallel

---

## Phase 4: User Story 1 - View All Tasks (Priority: P1) 🎯 MVP

**Goal**: Authenticated user can view all their tasks sorted by creation date (newest first)

**Independent Test**: Login, navigate to /tasks, see empty state or task list (only my tasks, never other users' tasks)

### Backend for User Story 1

- [ ] T018 [US1] Implement GET /api/v1/tasks endpoint in backend/app/api/tasks.py with JWT validation (get_current_user_id), filter by user_id, order by created_at desc
- [ ] T019 [US1] Register tasks router in backend/app/main.py with prefix="/api/v1/tasks"
- [ ] T020 [US1] Test endpoint via FastAPI /docs - verify JWT required, returns empty array for new user, filters by user_id

### Frontend for User Story 1

- [ ] T021 [P] [US1] Create Task TypeScript interface in frontend/types/task.ts (id, title, description, completed, user_id, created_at, updated_at)
- [ ] T022 [US1] Add getTasks() method to frontend/lib/api-client.ts with JWT header
- [ ] T023 [US1] Create TaskList component in frontend/components/TaskList.tsx (displays tasks, empty state, loading spinner)
- [ ] T024 [US1] Update frontend/app/tasks/page.tsx to fetch and render TaskList with AuthGuard protection
- [ ] T025 [US1] Style TaskList with Tailwind CSS (responsive, loading states, empty state message)

**Checkpoint**: ✅ At this point, User Story 1 should be fully functional - user can view their task list

---

## Phase 5: User Story 2 - Create Task (Priority: P1) 🎯 MVP

**Goal**: Authenticated user can create a new task with title (required) and optional description

**Independent Test**: Login, navigate to /tasks, fill form with title "Buy groceries", click Create, see task appear in list

### Backend for User Story 2

- [ ] T026 [US2] Implement POST /api/v1/tasks endpoint in backend/app/api/tasks.py with JWT validation, TaskCreate schema, auto-assign user_id from JWT, return 201 Created

### Frontend for User Story 2

- [ ] T027 [P] [US2] Add createTask() method to frontend/lib/api-client.ts with JWT header
- [ ] T028 [US2] Create TaskForm component in frontend/components/TaskForm.tsx (title input required 1-200 chars, description textarea optional max 1000 chars, submit handler)
- [ ] T029 [US2] Update frontend/app/tasks/page.tsx to include TaskForm and refresh task list after successful creation
- [ ] T030 [US2] Style TaskForm with Tailwind CSS (validation errors, disabled state during submit)

**Checkpoint**: ✅ At this point, User Stories 1 AND 2 work - user can view and create tasks

---

## Phase 6: User Story 3 - View Single Task (Priority: P2)

**Goal**: Authenticated user can view details of a specific task by ID

**Independent Test**: Login, create task, click on task in list, see full task details (title, description, timestamps)

### Backend for User Story 3

- [ ] T031 [US3] Implement GET /api/v1/tasks/{task_id} endpoint in backend/app/api/tasks.py with JWT validation, filter by task_id AND user_id, return 404 if not found or not owned

### Frontend for User Story 3

- [ ] T032 [P] [US3] Add getTask(taskId) method to frontend/lib/api-client.ts with JWT header
- [ ] T033 [US3] Create TaskDetail component in frontend/components/TaskDetail.tsx (displays all fields, loading state, error state)
- [ ] T034 [US3] Create frontend/app/tasks/[id]/page.tsx dynamic route to display TaskDetail with AuthGuard
- [ ] T035 [US3] Update TaskList to make tasks clickable (links to /tasks/[id])

**Checkpoint**: ✅ User Stories 1, 2, AND 3 work - user can view list, create, and view details

---

## Phase 7: User Story 4 - Update Task (Priority: P2)

**Goal**: Authenticated user can edit task title, description, or completion status

**Independent Test**: Login, create task, click Edit, change title from "Buy groceries" to "Buy organic groceries", save, see updated title

### Backend for User Story 4

- [ ] T036 [US4] Implement PUT /api/v1/tasks/{task_id} endpoint in backend/app/api/tasks.py with JWT validation, TaskUpdate schema (all fields optional), filter by task_id AND user_id, update updated_at timestamp, return 404 if not found

### Frontend for User Story 4

- [ ] T037 [P] [US4] Add updateTask(taskId, data) method to frontend/lib/api-client.ts with JWT header
- [ ] T038 [US4] Update TaskForm component in frontend/components/TaskForm.tsx to support edit mode (pre-filled fields)
- [ ] T039 [US4] Add Edit button to TaskDetail component that switches to edit mode
- [ ] T040 [US4] Update TaskList to include inline edit button option
- [ ] T041 [US4] Handle optimistic UI updates - update local state immediately, rollback on error

**Checkpoint**: ✅ User Stories 1-4 work - user can view, create, view details, and edit tasks

---

## Phase 8: User Story 5 - Toggle Task Completion (Priority: P2)

**Goal**: Authenticated user can quickly mark a task as complete with dedicated button/checkbox

**Independent Test**: Login, create task "Test task", click Complete button, see task marked as completed with visual indicator

### Backend for User Story 5

- [ ] T042 [US5] Implement PATCH /api/v1/tasks/{task_id}/complete endpoint in backend/app/api/tasks.py with JWT validation, set completed=True, update updated_at, return 404 if not found

### Frontend for User Story 5

- [ ] T043 [P] [US5] Add completeTask(taskId) method to frontend/lib/api-client.ts with JWT header
- [ ] T044 [US5] Add Complete button/checkbox to TaskList component inline with each task
- [ ] T045 [US5] Add visual styling for completed tasks (strikethrough, different color, checkmark icon)
- [ ] T046 [US5] Update local state immediately on click (optimistic UI)

**Checkpoint**: ✅ User Stories 1-5 work - user can view, create, edit, and complete tasks

---

## Phase 9: User Story 6 - Delete Task (Priority: P2)

**Goal**: Authenticated user can delete a task permanently

**Independent Test**: Login, create task "Delete me", click Delete button, confirm deletion, see task removed from list

### Backend for User Story 6

- [ ] T047 [US6] Implement DELETE /api/v1/tasks/{task_id} endpoint in backend/app/api/tasks.py with JWT validation, filter by task_id AND user_id, return 204 No Content, return 404 if not found

### Frontend for User Story 6

- [ ] T048 [P] [US6] Add deleteTask(taskId) method to frontend/lib/api-client.ts with JWT header
- [ ] T049 [US6] Add Delete button to TaskList component inline with each task
- [ ] T050 [US6] Create confirmation dialog component in frontend/components/ConfirmDialog.tsx (reusable)
- [ ] T051 [US6] Show confirmation dialog before delete ("Are you sure?", Cancel/Delete buttons)
- [ ] T052 [US6] Remove task from local state immediately after successful deletion (optimistic UI)

**Checkpoint**: ✅ All 6 user stories complete - full CRUD functionality working

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T053 [P] Add error handling for network failures across all API calls (retry logic, user-friendly error messages)
- [ ] T054 [P] Add loading states to all async operations (spinners, skeleton screens)
- [ ] T055 [P] Implement toast notifications for success/error messages (task created, deleted, etc.)
- [ ] T056 [P] Add task count indicator to UI ("You have 5 tasks, 2 completed")
- [ ] T057 [P] Update backend/app/api/tasks.py to add logging for all operations
- [ ] T058 [P] Update specs/api/rest-endpoints.md to mark task endpoints as implemented
- [ ] T059 [P] Update specs/database/schema.md to document tasks table schema
- [ ] T060 [P] Update README.md to add Task CRUD to features list
- [ ] T061 Test end-to-end flow: signup → login → create 3 tasks → edit 1 → complete 1 → delete 1 → logout → login again → verify tasks persist
- [ ] T062 Test multi-user isolation: create 2 users, each creates tasks, verify neither can see other's tasks
- [ ] T063 Test JWT expiration handling: wait for token to expire, verify frontend redirects to login

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ Complete
- **Foundational (Phase 2)**: ✅ Complete
- **Backend Data Model (Phase 3)**: BLOCKS all user stories - MUST complete first
- **User Stories (Phases 4-9)**: All depend on Phase 3 completion
  - User stories CAN proceed in parallel (if staffed) after Phase 3
  - OR sequentially in priority order: US1 → US2 → US3 → US4 → US5 → US6
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (View All)**: Depends on Phase 3 (Task model + migration)
- **User Story 2 (Create)**: Depends on Phase 3 (Task model + migration)
- **User Story 3 (View Single)**: Depends on Phase 3 + can run parallel with US1/US2
- **User Story 4 (Update)**: Depends on Phase 3 + can run parallel with US1/US2/US3
- **User Story 5 (Complete)**: Depends on Phase 3 + can run parallel with other stories
- **User Story 6 (Delete)**: Depends on Phase 3 + can run parallel with other stories

### Within Each User Story

1. Backend endpoint BEFORE frontend API client
2. API client method BEFORE components that use it
3. Reusable components BEFORE pages that use them
4. Core implementation BEFORE styling/polish

### Parallel Opportunities

**Phase 3 (Backend Data Model)**:
- T013 (Task model) and T014 (User model update) can run in parallel

**Phase 4 (User Story 1 - Frontend)**:
- T021 (Task interface) and T022 (API client method) can start in parallel after T018 is done

**Phase 5 (User Story 2 - Frontend)**:
- T027 (API client) can start immediately after T026 (backend endpoint) is done

**Cross-Story Parallelization**:
- Once Phase 3 is complete, all 6 user story backend endpoints (T018, T026, T031, T036, T042, T047) can be implemented in parallel
- Once backend endpoints are done, all 6 user story frontends can be implemented in parallel

---

## Implementation Strategy

### MVP First (Priority 1 Stories Only)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational
3. Complete Phase 3: Backend Data Model (CRITICAL)
4. Complete Phase 4: User Story 1 (View All Tasks)
5. Complete Phase 5: User Story 2 (Create Task)
6. **STOP and VALIDATE**: Test US1 + US2 end-to-end
7. Deploy/demo MVP (view + create is minimum viable)

### Incremental Delivery (All Stories)

1. ✅ Setup + Foundational → Foundation ready
2. Phase 3 → Backend data model ready
3. Add US1 (View All) → Test independently → Checkpoint 1
4. Add US2 (Create) → Test independently → **MVP READY** → Deploy/Demo
5. Add US3 (View Single) → Test independently → Checkpoint 2
6. Add US4 (Update) → Test independently → Checkpoint 3
7. Add US5 (Complete) → Test independently → Checkpoint 4
8. Add US6 (Delete) → Test independently → **FULL CRUD READY** → Deploy/Demo
9. Phase 10 (Polish) → Production ready

### Parallel Team Strategy

With 2-3 developers after Phase 3 completes:

**Backend Team**:
1. Dev A: US1 + US2 endpoints (T018, T026)
2. Dev B: US3 + US4 endpoints (T031, T036)
3. Dev C: US5 + US6 endpoints (T042, T047)

**Frontend Team** (starts after backend endpoints ready):
1. Dev A: US1 + US2 UI (T021-T030)
2. Dev B: US3 + US4 UI (T032-T041)
3. Dev C: US5 + US6 UI (T043-T052)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Test JWT validation on every protected endpoint
- Test user data isolation with 2 different users
- Verify 404 responses for unauthorized access (not 403)

---

## Quickstart Validation

After all tasks complete, validate with these commands:

```bash
# Backend
cd backend
source .venv/bin/activate
alembic upgrade head  # Ensure migrations applied
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev

# Test
# 1. Open http://localhost:3000
# 2. Signup with test@example.com / password123
# 3. Login
# 4. Navigate to /tasks
# 5. Create task "Buy groceries"
# 6. Create task "Walk the dog"
# 7. Complete "Walk the dog"
# 8. Edit "Buy groceries" to "Buy organic groceries"
# 9. Delete "Buy organic groceries"
# 10. Logout
# 11. Signup with test2@example.com / password456
# 12. Login as test2
# 13. Navigate to /tasks
# 14. Verify you see ZERO tasks (user isolation working)
```

---

**Tasks Status**: Ready for implementation
**Total Tasks**: 63 tasks (8 already complete, 55 to implement)
**Estimated Effort**: 8-12 hours development time
**Dependencies**: ✅ All satisfied (authentication complete)
**Blockers**: None

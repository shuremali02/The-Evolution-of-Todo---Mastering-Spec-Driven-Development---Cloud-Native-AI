# Feature Specification: Task Management Frontend UI

**Feature Branch**: `005-task-management-ui`
**Created**: 2026-01-02
**Status**: Draft (Updated: 2026-01-02 - Design Clarification)
**Input**: User description: "Create frontend task management UI specification with complete components and pages. Include Task List page (/tasks), TaskForm component (create/edit), TaskCard component (display with actions), and all CRUD operations. Must integrate with existing backend API (api.ts) and JWT authentication. Use Tailwind CSS, Next.js App Router, TypeScript strict mode."

## Design System (Updated from /sp.clarify)

### Design Style: Modern Gradient
- Modern gradient backgrounds on pages
- Rounded corners (rounded-2xl, rounded-3xl)
- Vibrant accent colors with subtle shadows
- Smooth hover transitions and animations

### Auth Pages: Split Layout
- Split screen: form on left, branded content/visual on right
- Gradient or branded background on one side
- Clean centered form on the other side
- Consistent with landing page design

### Landing Page: Enhanced
- Hero section with animations
- Feature cards with gradient borders
- How it works with step indicators
- Testimonials section
- CTA section with gradient button
- Footer with links

### Task Cards: Status Colors
- White cards with colored accents based on status
- Pending tasks: Yellow/amber accent
- Completed tasks: Green accent
- Hover effects with slight lift (translate-y)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Task List (Priority: P1)

A logged-in user visits the tasks page (/tasks) and sees all their tasks displayed in a clean, organized list. They can scan through tasks, see which are complete or pending, and quickly identify what needs attention.

**Why this priority**: This is the primary interface for the application. Without a task list, users cannot access or manage their tasks, making the entire application non-functional.

**Independent Test**: Can be fully tested by visiting /tasks while logged in and verifying that tasks load, display correctly, and match data from the backend API.

**Acceptance Scenarios**:

1. **Given** user is logged in, **When** they navigate to /tasks, **Then** they see a list of all their tasks
2. **Given** user has no tasks, **When** they visit /tasks, **Then** they see an empty state message with a call to create their first task
3. **Given** user has tasks, **When** task list loads, **Then** tasks are sorted by creation date (newest first)
4. **Given** user has a mix of completed and pending tasks, **When** viewing list, **Then** completion status is visually distinct (e.g., strikethrough or color)
5. **Given** task list is loading, **When** page initially renders, **Then** a loading indicator is displayed until data arrives
6. **Given** API request fails, **When** error occurs, **Then** an error message is displayed with option to retry

---

### User Story 2 - Create New Task (Priority: P1)

A logged-in user wants to add a new task to their list. They click a "Create Task" button, fill in task details, and submit the form. The new task immediately appears in their list without page reload.

**Why this priority**: Creating tasks is the core purpose of the application. Without this capability, users cannot use the product as intended.

**Independent Test**: Can be fully tested by clicking "Create Task", filling valid form data, submitting, and verifying the new task appears in the list.

**Acceptance Scenarios**:

1. **Given** user is on tasks page, **When** they click "Create Task" button, **Then** a form appears with title and description fields
2. **Given** user is in create mode, **When** they enter a title (1-200 characters), **Then** form allows submission
3. **Given** user is in create mode, **When** they enter an optional description (max 1000 characters), **Then** form accepts input
4. **Given** user submits form with valid data, **When** API responds successfully, **Then** new task appears at top of list and form closes
5. **Given** user submits form with empty title, **When** validation fails, **Then** error message "Title is required" displays inline
6. **Given** user submits form with title longer than 200 characters, **When** validation fails, **Then** error message displays character limit
7. **Given** user creates a task, **When** form submits, **Then** task defaults to "completed = false"
8. **Given** user cancels creation, **When** they click cancel button, **Then** form closes without submitting data

---

### User Story 3 - Edit Existing Task (Priority: P1)

A logged-in user wants to modify an existing task. They click an edit button on a task card, the form populates with current data, they make changes, and save. The task updates in place without page reload.

**Why this priority**: Users frequently make mistakes or want to update task details. Without editing, tasks remain incorrect or outdated, reducing utility.

**Independent Test**: Can be fully tested by clicking edit on a task, modifying data, saving, and verifying changes appear in the list.

**Acceptance Scenarios**:

1. **Given** user views task card, **When** they click edit button, **Then** form opens pre-filled with current task data
2. **Given** user is editing a task, **When** they modify title or description, **Then** form accepts valid changes
3. **Given** user saves edited task, **When** API responds successfully, **Then** task card updates in place with new data
4. **Given** user saves edited task, **When** update succeeds, **Then** "updated_at" timestamp is refreshed
5. **Given** user cancels edit, **When** they click cancel button, **Then** form closes and original task data remains unchanged
6. **Given** user tries to edit with invalid data, **When** validation fails, **Then** appropriate error message displays

---

### User Story 4 - Mark Task Complete (Priority: P1)

A logged-in user wants to mark a task as done. They click a complete/toggle button on a task card, and the task visually changes to show completed status.

**Why this priority**: Task completion is the primary action users perform. Without this, tasks cannot be marked as done, defeating the purpose of tracking work.

**Independent Test**: Can be fully tested by clicking complete button and verifying the task visually changes and the updated state persists on refresh.

**Acceptance Scenarios**:

1. **Given** user views a pending task, **When** they click complete button, **Then** task visually changes to show completed status
2. **Given** user completes a task, **When** API responds successfully, **Then** task displays with strikethrough or distinct color
3. **Given** user completes a task, **When** action finishes, **Then** "updated_at" timestamp is refreshed
4. **Given** user views a completed task, **When** they click complete/toggle button, **Then** task returns to pending status (if toggle behavior)
5. **Given** user has no tasks, **When** they complete a task, **Then** empty state message displays if no pending tasks remain
6. **Given** user is offline or API fails, **When** they click complete button, **Then** appropriate error message displays

---

### User Story 5 - Delete Task (Priority: P2)

A logged-in user wants to permanently remove a task they no longer need. They click a delete button on a task card, confirm the action, and the task disappears from their list.

**Why this priority**: Users need to clean up their task list. Without deletion, the list accumulates irrelevant tasks, reducing usability. Lower priority than core CRUD actions as users can work around by archiving (not supported) or ignoring.

**Independent Test**: Can be fully tested by clicking delete, confirming in dialog, and verifying the task is removed from the list.

**Acceptance Scenarios**:

1. **Given** user views task card, **When** they click delete button, **Then** confirmation dialog appears
2. **Given** confirmation dialog is open, **When** user confirms deletion, **Then** task is immediately removed from list
3. **Given** confirmation dialog is open, **When** user cancels deletion, **Then** task remains in list and dialog closes
4. **Given** user deletes a task, **When** API responds successfully, **Then** task is permanently removed (no soft delete)
5. **Given** user deletes last task, **When** removal completes, **Then** empty state message displays
6. **Given** user is deleting a task, **When** API request fails, **Then** task remains in list and error message displays

---

### Edge Cases

- What happens when user tries to access /tasks while not authenticated?
  - System should redirect to login page and preserve intended destination
- What happens when JWT token expires during user interaction?
  - System should display error and redirect to login
- What happens when API is slow or times out?
  - System should show loading indicator and timeout message after reasonable delay
- What happens when user tries to edit/delete a task that doesn't exist?
  - System should display "Task not found" error and refresh list
- What happens when user has a very large number of tasks (e.g., 100+)?
  - System should display all tasks (pagination is out of scope for Phase-2)
- What happens when browser is refreshed during form submission?
  - System should handle gracefully, either resubmitting or preserving form state

---

## Requirements *(mandatory)*

### Functional Requirements

### Task List Page Requirements

- **FR-TL-001**: System MUST display all tasks belonging to authenticated user on /tasks page
- **FR-TL-002**: Tasks MUST be sorted by creation date (newest first)
- **FR-TL-003**: System MUST display task title, description, completion status, and timestamps for each task
- **FR-TL-004**: System MUST show empty state message when user has no tasks
- **FR-TL-005**: System MUST display loading indicator while fetching tasks
- **FR-TL-006**: System MUST display error message when task list fails to load
- **FR-TL-007**: System MUST automatically refresh task list when tasks are created, updated, or deleted
- **FR-TL-008**: System MUST visually distinguish between completed and pending tasks

### TaskForm Component Requirements

- **FR-TF-001**: Form MUST accept task title (required, 1-200 characters)
- **FR-TF-002**: Form MUST accept task description (optional, max 1000 characters)
- **FR-TF-003**: Form MUST validate title presence before submission
- **FR-TF-004**: Form MUST validate title length (min 1, max 200 characters)
- **FR-TF-005**: Form MUST validate description length (max 1000 characters)
- **FR-TF-006**: Form MUST display validation errors inline below relevant fields
- **FR-TF-007**: Form MUST support create mode (empty fields)
- **FR-TF-008**: Form MUST support edit mode (pre-filled with existing data)
- **FR-TF-009**: Form MUST distinguish between create and edit modes visually (e.g., button text)
- **FR-TF-010**: Form MUST submit on button click and show loading state during submission
- **FR-TF-011**: Form MUST allow cancellation without submitting data

### TaskCard Component Requirements

- **FR-TC-001**: Card MUST display task title prominently
- **FR-TC-002**: Card MUST display task description if present
- **FR-TC-003**: Card MUST visually indicate completion status
- **FR-TC-004**: Card MUST provide "Complete" button or toggle
- **FR-TC-005**: Card MUST provide "Edit" button
- **FR-TC-006**: Card MUST provide "Delete" button
- **FR-TC-007**: Card MUST show creation timestamp
- **FR-TC-008**: Card MUST use consistent styling across all tasks
- **FR-TC-009**: Card MUST provide "Complete" button that toggles to "Undo" when task is completed (toggle behavior, not disable)
- **FR-TC-010**: Card MUST disable all action buttons while operations are in progress

### Delete Confirmation Requirements

- **FR-DC-001**: System MUST show confirmation dialog before deleting task
- **FR-DC-002**: Dialog MUST display task title being deleted
- **FR-DC-003**: Dialog MUST provide "Confirm" and "Cancel" buttons
- **FR-DC-004**: Dialog MUST close on clicking "Cancel" without action
- **FR-DC-005**: Dialog MUST execute deletion on clicking "Confirm"

### API Integration Requirements

- **FR-API-001**: System MUST use apiClient from lib/api.ts for all API calls
- **FR-API-002**: System MUST attach JWT token to all requests automatically
- **FR-API-003**: System MUST handle 401 errors by redirecting to login
- **FR-API-004**: System MUST display user-friendly error messages from API responses
- **FR-API-005**: System MUST refresh task data after successful create, update, delete, or complete operations

### Authentication Requirements

- **FR-AUTH-001**: /tasks page MUST redirect to /login if user is not authenticated
- **FR-AUTH-002**: System MUST verify authentication state on page load
- **FR-AUTH-003**: System MUST show loading state while checking authentication
- **FR-AUTH-004**: System MUST preserve intended destination when redirecting to login

### Error Handling Requirements

- **FR-ERR-001**: System MUST display error messages when API requests fail
- **FR-ERR-002**: System MUST provide retry option for failed requests
- **FR-ERR-003**: System MUST not block UI during errors (users can still navigate or view other tasks)
- **FR-ERR-004**: System MUST log errors for debugging (console log)

### Responsive Design Requirements

- **FR-RS-001**: Task list MUST display in single column on mobile devices
- **FR-RS-002**: Task cards MUST stack vertically on mobile
- **FR-RS-003**: Task form MUST be accessible on mobile (full screen or modal)
- **FR-RS-004**: Buttons MUST be large enough for touch targets (minimum 44x44 pixels)
- **FR-RS-005**: No horizontal scroll should be required on mobile

### Key Entities

- **Task**: Represents a single task item with title, description, completion status, and timestamps. Belongs to a specific user and is displayed in the task list.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can load their complete task list in under 2 seconds on 4G mobile connection
- **SC-002**: Users can create a new task in under 30 seconds from button click to task appearing in list
- **SC-003**: Users can edit an existing task in under 30 seconds from button click to save confirmation
- **SC-004**: Users can mark a task complete in under 2 seconds from button click
- **SC-005**: Users can delete a task in under 5 seconds from button click to confirmation
- **SC-006**: 95% of task operations (create, update, delete, complete) succeed on first attempt
- **SC-007**: Empty state displays within 1 second when user has no tasks
- **SC-008**: Error messages appear within 500ms of API failure
- **SC-009**: 90% of users can complete their primary task workflow (create task → mark complete) without assistance

---

## Assumptions

### Design Assumptions

1. Task list uses card-based layout (one task per card)
2. Complete status is visually indicated (strikethrough, color change, or checkmark)
3. Task cards display in a single column grid
4. Form is a modal or inline form that appears above task list
5. Delete confirmation is a simple modal dialog

### Technical Assumptions

1. Next.js 14+ with App Router is the frontend framework
2. Tailwind CSS is the styling solution
3. TypeScript with strict mode for type safety
4. API client (lib/api.ts) handles JWT token attachment and 401 redirects
5. Backend API endpoints match specs/api/rest-endpoints.md specification
6. AuthGuard component provides authentication check at route level
7. No pagination required for Phase-2 (all tasks displayed)
8. Real-time updates (websockets) are out of scope

### Data Assumptions

1. Task data structure matches backend TaskResponse schema:
   - id: string (UUID)
   - title: string
   - description: string | null
   - completed: boolean
   - user_id: string
   - created_at: string (ISO timestamp)
   - updated_at: string (ISO timestamp)
2. Validation rules match backend (title 1-200 chars, description max 1000 chars)
3. Tasks are always filtered by authenticated user_id from JWT

### User Flow Assumptions

1. Users must be authenticated to access /tasks (redirect to login if not)
2. Task form supports both create and edit modes (same component)
3. Complete button toggles completion (can mark incomplete as well)
4. Delete requires explicit confirmation to prevent accidental deletion
5. Operations update UI immediately (optimistic updates) or show loading state

### Performance Assumptions

1. Target API response time is under 1 second for task operations
2. Page load time target is under 2 seconds on 4G mobile
3. Loading indicators shown within 200ms of operation start

---

## Out of Scope *(remove if not applicable)*

- Task filtering or search (by status, text, etc.)
- Task sorting options (by date, title, etc.)
- Bulk operations (select multiple, delete all, etc.)
- Task categories, tags, or priorities
- Task subtasks or dependencies
- Real-time updates or live collaboration
- Task history or audit log
- Task archiving (soft delete)
- Drag-and-drop reordering
- Undo/redo functionality
- Export or import tasks
- Analytics or task completion statistics
- Dark mode theme support

---

## Dependencies

### Required

- Existing backend API endpoints (specs/api/rest-endpoints.md)
- API client implementation (frontend/lib/api.ts)
- AuthGuard component for route protection
- Backend authentication system (JWT tokens)
- Task backend models and schemas

### Existing Components

- frontend/lib/api.ts (API client with JWT handling)
- frontend/components/AuthGuard.tsx (Authentication check)
- backend/app/api/tasks.py (Task CRUD endpoints)
- backend/app/schemas/task.py (Request/response schemas)

---

## Notes

### Design Philosophy

The task management UI should be clean, functional, and distraction-free. Key design characteristics:
- **Simplicity**: Focus on tasks without unnecessary features
- **Speed**: Fast interactions with immediate feedback
- **Clarity**: Clear visual hierarchy and action affordance
- **Forgiveness**: Easy to undo or correct mistakes (within Phase-2 scope)

### Component Architecture

All components should be reusable and located in:
- `/components/TaskCard.tsx` - Individual task display
- `/components/TaskForm.tsx` - Create/edit form
- `/components/ConfirmDialog.tsx` - Delete confirmation
- `/app/tasks/page.tsx` - Main task list page

### Implementation Approach

1. Create reusable components first (TaskCard, TaskForm, ConfirmDialog)
2. Implement task list page that composes components
3. Integrate with apiClient for all data operations
4. Implement error handling and loading states
5. Add responsive design for mobile/tablet/desktop
6. Test all CRUD operations end-to-end
7. Verify authentication and authorization flows

### Content Guidelines

- Error messages should be user-friendly and actionable
- Empty state should encourage first task creation
- Loading states should be visually distinct
- Success messages should be brief and clear
- Button labels should use action verbs ("Create", "Save", "Delete")

### Future Enhancements

- Task filtering (by completed status, search text)
- Task sorting options (by title, date, priority)
- Task categories and tags
- Task due dates and reminders
- Task history and versioning
- Drag-and-drop reordering
- Keyboard shortcuts for power users
- Batch operations (select multiple, complete all)
- Task statistics and completion rate visualization

---

**Specification Complete** - Ready for `/sp.plan`

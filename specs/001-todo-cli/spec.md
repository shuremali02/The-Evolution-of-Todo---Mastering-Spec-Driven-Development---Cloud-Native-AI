# Feature Specification: Todo In-Memory Python Console App

**Feature Branch**: `001-todo-cli`
**Created**: 2025-12-29
**Status**: Draft
**Input**: User description: "Phase I: Todo In-Memory Python Console App - Build a command-line todo application that stores tasks in memory using Claude Code and Spec-Kit Plus with 5 basic features: Add, Delete, Update, View, Mark Complete"

## Clarifications

### Session 2025-12-29

- Q: What happens when a user attempts to add a task with empty title? → A: Reject immediately with error message "Title cannot be empty. Please enter at least 1 character."
- Q: How should the system handle invalid task ID inputs (non-numeric, negative, or non-existent)? → A: Display specific error for each case ("Invalid input. Please enter a numeric task ID.", "Task ID must be positive.", "Task not found.") and return to menu
- Q: How should the system handle update operations when no new values are provided? → A: Reject with error "No changes provided. Please enter a new title or description." and return to menu
- Q: How should the system handle descriptions exceeding 1000 characters? → A: Truncate to 1000 characters with warning "Description truncated to 1000 characters."
- Q: What visual indicators should be used to distinguish complete from incomplete tasks? → A: Use checkbox symbols: [✓] for complete, [ ] for incomplete
- Q: What folder naming convention should be used for phase directories in the project reorganization? → A: phase-1/ (lowercase with hyphen)
- Q: How should files be moved to preserve git history? → A: git mv (preserves file history and blame information)
- Q: How should the application be executed after moving to phase-1 folder? → A: cd phase-1 && python3 -m src.todo_app.main (change directory first, simpler imports)
- Q: Should .specify/ and history/ folders be moved into phase-1 or kept in root? → A: Keep in root (shared infrastructure across all phases)
- Q: How should root CLAUDE.md and .gitignore be handled? → A: Create phase-1 specific copies, keep root versions (allows per-phase customization)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add and View Tasks (Priority: P1)

As a user, I want to add new todo tasks with a title and description, and view all my tasks so that I can track what needs to be done.

**Why this priority**: This is the foundational capability - without the ability to add and view tasks, no other features are meaningful. This delivers immediate value as a basic task capture tool.

**Independent Test**: Can be fully tested by launching the app, adding 2-3 tasks with different titles and descriptions, listing all tasks, and verifying they appear with correct details and status indicators.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** I choose to add a new task with title "Buy groceries" and description "Milk, eggs, bread", **Then** the system confirms the task was added and assigns it a unique ID
2. **Given** I have added 3 tasks, **When** I choose to view all tasks, **Then** the system displays all 3 tasks with their IDs, titles, descriptions, and completion status (incomplete by default)
3. **Given** I have no tasks, **When** I choose to view all tasks, **Then** the system displays a message indicating no tasks exist

---

### User Story 2 - Mark Tasks Complete (Priority: P2)

As a user, I want to mark tasks as complete or incomplete so that I can track my progress and see what work remains.

**Why this priority**: Tracking completion status is the core value of a todo application. Without this, the app is just a list without state management.

**Independent Test**: Can be fully tested by adding 2-3 tasks, marking one as complete, listing tasks to verify status changed, then marking it incomplete again to verify toggle behavior.

**Acceptance Scenarios**:

1. **Given** I have a task with ID 1 that is incomplete, **When** I mark task 1 as complete, **Then** the system updates the task status to complete and confirms the change
2. **Given** I have a task with ID 2 that is complete, **When** I mark task 2 as incomplete, **Then** the system updates the task status to incomplete and confirms the change
3. **Given** I provide an invalid task ID, **When** I attempt to mark it complete, **Then** the system displays an error message indicating the task was not found

---

### User Story 3 - Update Task Details (Priority: P3)

As a user, I want to update the title and description of existing tasks so that I can correct mistakes or refine task details as my understanding evolves.

**Why this priority**: This enables task refinement and correction. While valuable, users can work around missing updates by deleting and re-adding tasks.

**Independent Test**: Can be fully tested by adding a task, updating its title and/or description, viewing the task list to verify changes persisted, and attempting to update a non-existent task to verify error handling.

**Acceptance Scenarios**:

1. **Given** I have a task with ID 1 with title "Old Title", **When** I update task 1 with new title "New Title", **Then** the system updates the task and confirms the change
2. **Given** I have a task with ID 2, **When** I update task 2 with new title "Updated" and new description "Updated description", **Then** both fields are updated and confirmed
3. **Given** I provide an invalid task ID, **When** I attempt to update it, **Then** the system displays an error message indicating the task was not found

---

### User Story 4 - Delete Tasks (Priority: P4)

As a user, I want to delete tasks that are no longer relevant so that my task list stays focused and uncluttered.

**Why this priority**: This provides cleanup capability. While useful, it's less critical than adding, viewing, and marking complete since users can simply ignore irrelevant tasks.

**Independent Test**: Can be fully tested by adding 3 tasks, deleting one by ID, listing tasks to verify it's gone, and attempting to delete a non-existent task to verify error handling.

**Acceptance Scenarios**:

1. **Given** I have a task with ID 1, **When** I delete task 1, **Then** the system removes the task and confirms the deletion
2. **Given** I have 3 tasks, **When** I delete task 2, **Then** viewing all tasks shows only tasks 1 and 3
3. **Given** I provide an invalid task ID, **When** I attempt to delete it, **Then** the system displays an error message indicating the task was not found

---

### User Story 5 - Interactive Command Menu (Priority: P5)

As a user, I want a clear interactive menu with numbered options so that I can easily discover and execute all available operations without memorizing commands.

**Why this priority**: This improves usability and discoverability. While important for user experience, the core task management functions take precedence.

**Independent Test**: Can be fully tested by launching the app, verifying the menu displays all 6 options (Add, View, Update, Delete, Mark Complete, Exit), selecting each option to verify navigation works, and selecting Exit to verify clean shutdown.

**Acceptance Scenarios**:

1. **Given** the application starts, **When** the main menu displays, **Then** I see 6 numbered options: 1) Add Task, 2) View All Tasks, 3) Update Task, 4) Delete Task, 5) Mark Task Complete/Incomplete, 6) Exit
2. **Given** the main menu is displayed, **When** I enter a valid option number, **Then** the system executes the corresponding action
3. **Given** the main menu is displayed, **When** I enter an invalid option, **Then** the system displays an error message and redisplays the menu
4. **Given** I select Exit, **When** the system terminates, **Then** it displays a goodbye message and exits cleanly with status code 0

---

### Edge Cases

- **Empty title**: System rejects with error "Title cannot be empty. Please enter at least 1 character." and returns to menu
- **Empty description**: System accepts (description is optional per FR-015)
- **Non-numeric task ID**: System displays error "Invalid input. Please enter a numeric task ID." and returns to menu
- **Negative task ID**: System displays error "Task ID must be positive." and returns to menu
- **Non-existent task ID**: System displays error "Task not found." and returns to menu
- **Update without new values**: System rejects with error "No changes provided. Please enter a new title or description." and returns to menu
- **Very long titles (>200 characters)**: System truncates to 200 characters with warning "Title truncated to 200 characters."
- **Very long descriptions (>1000 characters)**: System truncates to 1000 characters with warning "Description truncated to 1000 characters."
- **User interrupts with Ctrl+C**: Application exits immediately with status code 130 (standard SIGINT exit code), all in-memory data lost

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an interactive command-line menu with numbered options for all operations
- **FR-002**: System MUST allow users to add new tasks by providing a title and description
- **FR-003**: System MUST assign a unique numeric ID to each task automatically upon creation
- **FR-004**: System MUST allow users to view all tasks with their ID, title, description, and completion status using visual indicators: [✓] for complete, [ ] for incomplete
- **FR-005**: System MUST allow users to mark tasks as complete or incomplete by task ID
- **FR-006**: System MUST allow users to update task title and/or description by task ID
- **FR-007**: System MUST allow users to delete tasks by task ID
- **FR-008**: System MUST store all tasks in memory during application runtime
- **FR-009**: System MUST validate user input and display clear error messages for invalid operations
- **FR-010**: System MUST display confirmation messages after successful operations (add, update, delete, mark complete)
- **FR-011**: System MUST display appropriate error messages when operations fail (task not found, invalid input)
- **FR-012**: System MUST allow users to exit the application cleanly via menu option
- **FR-013**: System MUST handle empty task lists gracefully when viewing or searching
- **FR-014**: System MUST accept task titles with minimum 1 character and maximum 200 characters
- **FR-015**: System MUST accept task descriptions with minimum 0 characters (optional) and maximum 1000 characters
- **FR-016**: System MUST run as a single-process command-line application without background services
- **FR-017**: System MUST NOT persist data to files or databases (in-memory only)
- **FR-018**: System MUST follow Python PEP 8 style guidelines for code formatting
- **FR-019**: System MUST use UV for Python dependency management
- **FR-020**: System MUST be developed entirely through Claude Code agents following Spec-Driven Development workflow

### Key Entities

- **Task**: Represents a single todo item with the following attributes:
  - Unique numeric ID (auto-generated, sequential)
  - Title (required, 1-200 characters)
  - Description (optional, 0-1000 characters)
  - Completion status (boolean: complete or incomplete, defaults to incomplete)
  - Created timestamp (for internal ordering)

### Expected Output Format

When viewing tasks, the system MUST display them in this format:

```
ID: 1 [ ] Buy groceries
Description: Milk, eggs, bread

ID: 2 [✓] Complete project report
Description: Finish the quarterly analysis

ID: 3 [ ] Call dentist
Description: Schedule annual checkup
```

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new task and see it in the task list within 5 seconds of launching the application
- **SC-002**: Users can view all tasks with clear visual indicators distinguishing complete from incomplete tasks
- **SC-003**: Users can complete all 5 core operations (Add, View, Update, Delete, Mark Complete) without encountering errors in the happy path
- **SC-004**: System displays clear error messages for all invalid operations (invalid IDs, empty titles, non-numeric input) within 1 second
- **SC-005**: Application starts and displays the main menu within 2 seconds on standard hardware
- **SC-006**: Users can manage up to 100 tasks without noticeable performance degradation
- **SC-007**: Application exits cleanly without errors or hanging when user selects Exit option
- **SC-008**: All task data is lost when application terminates (confirming in-memory-only behavior)
- **SC-009**: The codebase follows Python best practices with clear separation of concerns (data, logic, interface)
- **SC-010**: The development process is fully documented through Spec-Kit Plus artifacts (spec, plan, tasks, history)

## Scope *(mandatory)*

### In Scope

- Interactive command-line menu interface
- Five core task operations: Add, View, Update, Delete, Mark Complete/Incomplete
- In-memory task storage (data persists only during runtime)
- Input validation and error handling
- Clear user feedback (confirmations, error messages)
- Task ID auto-generation and uniqueness
- Clean application startup and shutdown
- Python 3.13+ implementation using UV
- Development via Claude Code following SDD workflow
- Constitution compliance (single-process, no databases, no async services)
- Clean code structure with proper separation of concerns
- PEP 8 compliant code formatting

### Out of Scope

- Data persistence (files, databases, cloud storage)
- Task filtering or search functionality
- Task sorting or prioritization
- Task categories or tags
- Due dates or reminders
- Multi-user support or authentication
- Web interface or API
- Mobile applications
- Task history or audit logging
- Undo/redo functionality
- Task attachments or notes
- Recurring tasks
- Task dependencies
- Background processes or scheduled operations
- Network connectivity or synchronization
- Containerization (Docker, Kubernetes)
- Message queues (Kafka, Dapr)
- External integrations or APIs

## Assumptions *(optional)*

- Users have Python 3.13+ installed on their system
- Users have UV installed for dependency management
- Users are comfortable with command-line interfaces
- Users understand that data is lost when the application exits
- Users run the application on standard desktop/laptop hardware
- Users input text in English (no internationalization required)
- Development will follow the Phase-1 Constitution strictly
- Claude Code agents are available and configured properly
- Spec-Kit Plus tooling is installed and functional

## Dependencies *(optional)*

### External Dependencies

- Python 3.13+ runtime
- UV package manager
- Claude Code CLI tool
- Spec-Kit Plus framework
- Git for version control
- GitHub for repository hosting

### Development Dependencies

- Phase-1 Constitution (`.specify/memory/constitution.md`)
- Spec-Kit Plus templates (spec, plan, tasks)
- Claude Code agent configuration (`CLAUDE.md`)

## Non-Functional Requirements *(optional)*

### Performance

- Application startup time: < 2 seconds
- Menu display time: < 100ms
- Task operation response time: < 500ms
- Support for up to 100 tasks without degradation

### Usability

- Clear, numbered menu options
- Consistent error message formatting
- Confirmation messages for all successful operations
- Intuitive operation flow requiring minimal learning

### Maintainability

- Code follows PEP 8 style guidelines
- Clear separation of concerns (data, logic, UI)
- Functions and classes have single responsibilities
- All code traceable to Task IDs and Spec sections (per Constitution Article V)

### Reliability

- Deterministic behavior (same inputs produce same outputs)
- Graceful error handling for all invalid inputs
- Clean shutdown without data corruption
- No crashes or unhandled exceptions in normal operation

### Compliance

- Strict adherence to Phase-1 Constitution (all 9 Articles)
- No forbidden technologies (databases, Docker, Kafka, web servers, etc.)
- All code must reference Task IDs and Spec sections
- Development follows mandatory SDD pipeline: Specify → Plan → Tasks → Implement → Validate

## Project Organization *(restructuring)*

### Phase-1 Folder Structure

After implementation completion, Phase-1 files must be reorganized into a dedicated folder to prepare for multi-phase development:

**Target Structure:**
```
/
├── phase-1/                    # Phase-1 implementation (isolated)
│   ├── src/                   # Application source code
│   ├── tests/                 # Test files
│   ├── pyproject.toml         # UV configuration
│   ├── README.md              # Phase-1 specific instructions
│   ├── CLAUDE.md              # Phase-1 specific agent config
│   └── .gitignore             # Phase-1 specific ignore patterns
│
├── specs/                      # Remains in root (shared)
│   └── 001-todo-cli/          # Feature specifications
│
├── .specify/                   # Remains in root (shared infrastructure)
├── history/                    # Remains in root (shared, feature-specific subdirs)
├── CLAUDE.md                   # Root-level template/default
├── .gitignore                  # Root-level project patterns
└── README.md                   # Root-level project overview
```

**Reorganization Requirements:**

- **FR-021**: Use `phase-1/` naming convention (lowercase with hyphen) for consistency
- **FR-022**: Use `git mv` command to preserve file history and blame information during reorganization
- **FR-023**: Application must be executed as `cd phase-1 && python3 -m src.todo_app.main` after reorganization
- **FR-024**: Keep `.specify/` and `history/` folders in root as shared infrastructure across all phases
- **FR-025**: Create phase-1 specific copies of `CLAUDE.md` and `.gitignore` while keeping root versions for project-wide defaults
- **FR-026**: Update `phase-1/README.md` to reflect new execution path and folder context
- **FR-027**: Preserve all Task ID references and Spec traceability in moved files
- **FR-028**: Verify Phase-1 application remains fully functional after reorganization

**Files to Move (with git mv):**
- `src/` → `phase-1/src/`
- `tests/` → `phase-1/tests/`
- `pyproject.toml` → `phase-1/pyproject.toml`
- `README.md` → `phase-1/README.md` (update execution instructions)

**Files to Copy (then customize):**
- `CLAUDE.md` → `phase-1/CLAUDE.md` (phase-specific agent instructions)
- `.gitignore` → `phase-1/.gitignore` (phase-specific patterns)

**Files to Keep in Root (unchanged):**
- `specs/` - Feature specifications remain accessible to all phases
- `.specify/` - Shared SDD tooling and templates
- `history/` - Already organized by feature subdirectories
- Root `CLAUDE.md` - Project-wide default
- Root `.gitignore` - Project-wide patterns
- Root `README.md` - Multi-phase project overview

## Open Questions *(optional)*

None at this time. All requirements are clearly defined with reasonable defaults. The feature description provided complete information for Phase-1 objectives. Project reorganization requirements added based on 2025-12-29 clarification session.

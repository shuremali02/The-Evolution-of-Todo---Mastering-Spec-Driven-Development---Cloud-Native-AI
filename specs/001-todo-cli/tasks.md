# Tasks: Todo In-Memory Python Console App

**Input**: Design documents from `/specs/001-todo-cli/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md

**Tests**: Not requested in specification - no test tasks included

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize Python project with UV in repository root (create pyproject.toml)
- [X] T002 [P] Create directory structure: src/todo_app/{models,services,ui,validators}/ with __init__.py files
- [X] T003 [P] Create tests directory structure: tests/{unit,integration}/ with __init__.py files
- [X] T004 [P] Configure pytest in pyproject.toml with testpaths and python_files settings
- [X] T005 [P] Create .gitignore for Python (__pycache__, *.pyc, .pytest_cache, .venv)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Implement Task dataclass in src/todo_app/models/task.py with id, title, description, completed, created_at fields
- [X] T007 [P] Implement TaskManager class in src/todo_app/services/task_manager.py with empty __init__ method and tasks dict
- [X] T008 [P] Implement InputValidator class in src/todo_app/validators/input_validator.py with validate_title static method
- [X] T009 [P] Add validate_description static method to InputValidator in src/todo_app/validators/input_validator.py
- [X] T010 [P] Add validate_task_id static method to InputValidator in src/todo_app/validators/input_validator.py
- [X] T011 Create ERROR_MESSAGES constant dict in src/todo_app/validators/input_validator.py with all error messages from spec clarifications

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to add tasks with title/description and view all tasks with status indicators

**Independent Test**: Launch app, add 2-3 tasks, list them, verify IDs/titles/descriptions/status ([  ]) appear correctly

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement add_task method in TaskManager (src/todo_app/services/task_manager.py) - create Task, store in dict, increment next_id
- [X] T013 [P] [US1] Implement get_all_tasks method in TaskManager (src/todo_app/services/task_manager.py) - return sorted list of tasks by ID
- [X] T014 [P] [US1] Implement count method in TaskManager (src/todo_app/services/task_manager.py) - return len(self.tasks)
- [X] T015 [P] [US1] Implement Task.__str__ method in src/todo_app/models/task.py - format as "ID: X [status] title\nDescription: desc"
- [X] T016 [P] [US1] Create Formatter class in src/todo_app/ui/formatter.py with format_task_list static method using [✓]/[ ] symbols
- [X] T017 [US1] Implement display_menu function in src/todo_app/ui/menu.py - print 6 menu options (Add, View, Update, Delete, Mark Complete, Exit)
- [X] T018 [US1] Implement handle_add_task function in src/todo_app/ui/menu.py - prompt for title/desc, validate, call TaskManager.add_task, print confirmation
- [X] T019 [US1] Implement handle_view_tasks function in src/todo_app/ui/menu.py - call TaskManager.get_all_tasks, use Formatter.format_task_list, handle empty list
- [X] T020 [US1] Create main.py in src/todo_app/ with main() function - initialize TaskManager, display menu loop, handle choice '1' (add) and '2' (view) and '6' (exit)
- [X] T021 [US1] Add input validation to handle_add_task in src/todo_app/ui/menu.py - validate title (empty check, 200 char truncation with warning)
- [X] T022 [US1] Add description validation to handle_add_task in src/todo_app/ui/menu.py - validate description (1000 char truncation with warning)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP complete!)

---

## Phase 4: User Story 2 - Mark Tasks Complete (Priority: P2)

**Goal**: Enable users to toggle task completion status by task ID

**Independent Test**: Add 2-3 tasks, mark one complete, list tasks to verify [✓] appears, mark incomplete to verify [ ] returns

### Implementation for User Story 2

- [X] T023 [P] [US2] Implement toggle_completion method in Task class (src/todo_app/models/task.py) - flip completed boolean
- [X] T024 [P] [US2] Implement get_task method in TaskManager (src/todo_app/services/task_manager.py) - return tasks.get(task_id)
- [X] T025 [US2] Implement toggle_completion method in TaskManager (src/todo_app/services/task_manager.py) - get task, call task.toggle_completion(), return bool
- [X] T026 [US2] Implement handle_toggle_completion function in src/todo_app/ui/menu.py - prompt for ID, validate, call TaskManager.toggle_completion, print confirmation or error
- [X] T027 [US2] Update main() in src/todo_app/main.py to handle choice '5' (Mark Complete/Incomplete) - call handle_toggle_completion
- [X] T028 [US2] Add task ID validation to handle_toggle_completion - validate numeric, positive, exists (use InputValidator.validate_task_id and TaskManager.get_task)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Task Details (Priority: P3)

**Goal**: Enable users to update task title and/or description by task ID

**Independent Test**: Add task, update title, verify change persisted; update description, verify change persisted; attempt to update non-existent task, verify error

### Implementation for User Story 3

- [X] T029 [P] [US3] Implement update method in Task class (src/todo_app/models/task.py) - update title and/or description if provided (not None)
- [X] T030 [US3] Implement update_task method in TaskManager (src/todo_app/services/task_manager.py) - get task, call task.update(), return bool
- [X] T031 [US3] Implement handle_update_task function in src/todo_app/ui/menu.py - prompt for ID, new title (optional), new description (optional), validate, call TaskManager.update_task
- [X] T032 [US3] Update main() in src/todo_app/main.py to handle choice '3' (Update Task) - call handle_update_task
- [X] T033 [US3] Add validation to handle_update_task - check at least one field provided (reject if both empty), validate task ID, validate title/description lengths

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Enable users to permanently delete tasks by task ID

**Independent Test**: Add 3 tasks, delete one, list tasks to verify it's gone, attempt to delete non-existent task, verify error

### Implementation for User Story 4

- [X] T034 [US4] Implement delete_task method in TaskManager (src/todo_app/services/task_manager.py) - delete from dict if exists, return bool
- [X] T035 [US4] Implement handle_delete_task function in src/todo_app/ui/menu.py - prompt for ID, validate, call TaskManager.delete_task, print confirmation or error
- [X] T036 [US4] Update main() in src/todo_app/main.py to handle choice '4' (Delete Task) - call handle_delete_task
- [X] T037 [US4] Add task ID validation to handle_delete_task - validate numeric, positive, exists (reuse validation pattern from US2)

**Checkpoint**: All core task operations (Add, View, Update, Delete, Mark Complete) now functional

---

## Phase 7: User Story 5 - Interactive Command Menu (Priority: P5)

**Goal**: Polish the menu interface for usability and error handling

**Independent Test**: Launch app, verify menu displays all 6 options clearly, enter invalid choice, verify error message and menu redisplay, select Exit, verify goodbye message and status 0

### Implementation for User Story 5

- [X] T038 [US5] Add menu header formatting to display_menu in src/todo_app/ui/menu.py - add separators, title "TODO CLI APPLICATION"
- [X] T039 [US5] Implement handle_invalid_choice function in src/todo_app/ui/menu.py - print error "Invalid choice. Please enter a number between 1 and 6."
- [X] T040 [US5] Update main() in src/todo_app/main.py - add try-except for ValueError on invalid input, call handle_invalid_choice
- [X] T041 [US5] Add goodbye message to exit in main() - print "Goodbye! All tasks will be lost." before sys.exit(0)
- [X] T042 [US5] Add KeyboardInterrupt handler to main() in src/todo_app/main.py - catch Ctrl+C, exit gracefully (Python default exit code 130)

**Checkpoint**: All user stories should now be independently functional with polished UX

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [X] T043 [P] Add Task ID and Spec references to file headers in all src/todo_app/ files per Constitution Article V
- [X] T044 [P] Add Task ID and Spec references to function docstrings in all src/todo_app/ files per Constitution Article V
- [X] T045 [P] Create README.md in repository root with prerequisites, installation (`uv sync`), running (`python src/todo_app/main.py`), and usage instructions
- [X] T046 [P] Update CLAUDE.md in repository root with task traceability examples and Constitution compliance notes
- [X] T047 Run manual integration test: Add 5 tasks, mark 2 complete, update 1, delete 1, view all, verify all operations work end-to-end
- [X] T048 Run performance test: Add 100 tasks, verify startup <2s, operations <500ms, no degradation
- [X] T049 [P] Verify PEP 8 compliance with linter (flake8 or pylint) across all src/todo_app/ files
- [X] T050 Final validation: Verify all edge cases from spec clarifications work correctly (empty title rejection, ID validation, truncation warnings, etc.)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) after Phase 2
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **THIS IS THE MVP!**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (operates independently)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (operates independently)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on other stories (operates independently)
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Enhances all stories but doesn't block them

### Within Each User Story

- Tasks marked [P] within a story can run in parallel (different files)
- Non-[P] tasks within a story must run sequentially (dependencies on prior tasks in same story)
- Story complete before moving to next priority (for sequential delivery)

### Parallel Opportunities

- **Phase 1 (Setup)**: Tasks T001-T005 can all run in parallel [P]
- **Phase 2 (Foundational)**: Tasks T006-T011 can all run in parallel [P] (different files)
- **Once Phase 2 completes**: All user story phases (3-7) can start in parallel if team capacity allows
- **Within User Story 1**: Tasks T012-T016 can run in parallel [P] (different files)
- **Within User Story 2**: Tasks T023-T024 can run in parallel [P]
- **Within User Story 3**: Tasks T029 can start immediately (independent file)
- **Phase 8 (Polish)**: Tasks T043, T044, T045, T046, T049 can run in parallel [P]

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tasks together (Phase 2):
Task T006: "Implement Task dataclass in src/todo_app/models/task.py"
Task T007: "Implement TaskManager class in src/todo_app/services/task_manager.py"
Task T008: "Implement InputValidator class in src/todo_app/validators/input_validator.py"
Task T009: "Add validate_description to InputValidator"
Task T010: "Add validate_task_id to InputValidator"
Task T011: "Create ERROR_MESSAGES constant dict"
```

All these tasks touch different files and have no dependencies on each other within Phase 2.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T011) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T012-T022)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Demo the MVP: Add tasks, view tasks, exit

At this point you have a **working MVP** - a todo app that can add and view tasks!

### Incremental Delivery

1. Complete Setup + Foundational (Phases 1-2) → Foundation ready
2. Add User Story 1 (Phase 3) → Test independently → **MVP Deployed!**
3. Add User Story 2 (Phase 4) → Test independently → Deploy (now can mark complete)
4. Add User Story 3 (Phase 5) → Test independently → Deploy (now can update)
5. Add User Story 4 (Phase 6) → Test independently → Deploy (now can delete)
6. Add User Story 5 (Phase 7) → Test independently → Deploy (polished UX)
7. Polish (Phase 8) → Final release

Each story adds value without breaking previous stories!

### Parallel Team Strategy

With multiple developers (or Claude Code agents):

1. **Everyone**: Complete Setup + Foundational together (Phases 1-2)
2. **Once Foundational is done**:
   - Developer/Agent A: User Story 1 (Phase 3) - MVP
   - Developer/Agent B: User Story 2 (Phase 4) - Mark complete
   - Developer/Agent C: User Story 3 (Phase 5) - Update
   - Developer/Agent D: User Story 4 (Phase 6) - Delete
   - Developer/Agent E: User Story 5 (Phase 7) - Menu polish
3. **Integration**: Merge all stories (they're independent!)
4. **Everyone**: Polish phase together (Phase 8)

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe for parallel execution
- **[Story] labels**: Maps each task to its user story for traceability
- **Each user story is independently completable and testable**
- **No test tasks**: Tests were not requested in the specification
- **Commit strategy**: Commit after completing each user story phase (natural checkpoints)
- **Stop at any checkpoint to validate story independently**
- **Avoid**: Cross-story dependencies that break independence

---

## Task Summary

- **Total Tasks**: 50
- **Setup (Phase 1)**: 5 tasks
- **Foundational (Phase 2)**: 6 tasks (BLOCKS all stories)
- **User Story 1 (Phase 3)**: 11 tasks (MVP!)
- **User Story 2 (Phase 4)**: 6 tasks
- **User Story 3 (Phase 5)**: 5 tasks
- **User Story 4 (Phase 6)**: 4 tasks
- **User Story 5 (Phase 7)**: 5 tasks
- **Polish (Phase 8)**: 8 tasks
- **Parallel Opportunities**: 18 tasks marked [P] can run in parallel within their phases
- **MVP Scope**: Phases 1-3 only (22 tasks for working add/view functionality)

---

## Traceability to Spec

| User Story | Priority | Tasks | Key Files |
|------------|----------|-------|-----------|
| US1: Add and View Tasks | P1 (MVP) | T012-T022 | task.py, task_manager.py, formatter.py, menu.py, main.py |
| US2: Mark Complete | P2 | T023-T028 | task.py, task_manager.py, menu.py, main.py |
| US3: Update Tasks | P3 | T029-T033 | task.py, task_manager.py, menu.py, main.py |
| US4: Delete Tasks | P4 | T034-T037 | task_manager.py, menu.py, main.py |
| US5: Interactive Menu | P5 | T038-T042 | menu.py, main.py |

All tasks traceable to functional requirements (FR-001 to FR-020) via plan.md traceability matrix.

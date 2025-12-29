# Tasks: Phase-1 Project Reorganization

**Input**: Reorganization plan from `/specs/001-todo-cli/reorganization-plan.md`
**Prerequisites**: reorganization-plan.md (required), spec.md (FR-021 to FR-028 required)

**Tests**: Not requested - Manual validation only (see Phase 7)

**Organization**: Tasks organized by phase to enable sequential execution with validation checkpoints

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths and git commands in descriptions

## Path Conventions

- **Repository root**: `/mnt/e/The Evolution of Todo – Mastering Spec-Driven Development & Cloud Native AI/`
- Paths shown below assume execution from repository root

---

## Phase 1: Pre-Move Validation & Backup

**Purpose**: Verify current state before any file moves, create safety checkpoint

**⚠️ CRITICAL**: Do NOT proceed to Phase 2 until all Phase 1 validations PASS

- [ ] T-REORG-001 Verify Phase-1 application is fully functional by running `python3 -m src.todo_app.main` and testing all 5 operations (Add, View, Update, Delete, Mark Complete)
- [ ] T-REORG-002 Create git checkpoint with `git add -A && git commit -m "Pre-reorganization checkpoint"` (or verify working tree is clean)
- [ ] T-REORG-003 Document current file structure by running `tree -L 3 -I '__pycache__|*.pyc|.pytest_cache' > /tmp/pre-reorg-structure.txt`
- [ ] T-REORG-004 Verify git history is accessible by checking `git log --oneline | head -10` shows recent commits
- [ ] T-REORG-005 Confirm no uncommitted changes with `git status` (working tree should be clean for safe rollback)

**Checkpoint**: All 5 operations tested successfully, git history verified, structure documented

---

## Phase 2: Create Target Structure

**Purpose**: Set up phase-1/ directory and prepare root-level files

**⚠️ CRITICAL**: No file moves yet - only directory creation and new file writing

- [ ] T-REORG-006 Create phase-1 directory at repository root with `mkdir phase-1`
- [ ] T-REORG-007 Create root-level README.md with multi-phase project overview, phase structure description, links to phase-1/README.md, and SDD methodology summary
- [ ] T-REORG-008 Verify phase-1/ directory exists and is empty with `ls -la phase-1/` (should show only . and ..)

**Checkpoint**: phase-1/ directory created, root README.md written

---

## Phase 3: Move Implementation Files (Git MV)

**Purpose**: Relocate Phase-1 source files with history preservation

**⚠️ CRITICAL**: Use ONLY `git mv` commands - never use regular `mv`

**Sequential execution required** - these tasks must run in order:

- [ ] T-REORG-009 Move src/ directory to phase-1/ with `git mv src phase-1/src`
- [ ] T-REORG-010 Move tests/ directory to phase-1/ with `git mv tests phase-1/tests`
- [ ] T-REORG-011 Move pyproject.toml to phase-1/ with `git mv pyproject.toml phase-1/pyproject.toml`
- [ ] T-REORG-012 Move README.md to phase-1/ with `git mv README.md phase-1/README.md`
- [ ] T-REORG-013 Verify all 4 items moved successfully with `ls -la phase-1/` (should show src/, tests/, pyproject.toml, README.md)
- [ ] T-REORG-014 Verify git staged the moves correctly with `git status` (should show renamed entries, not deleted + new)

**Checkpoint**: All 4 items moved with git mv, git status shows renames (not deletes + adds)

---

## Phase 4: Copy and Customize Configuration Files

**Purpose**: Create phase-specific configurations from root templates

**Sequential execution required** - customization depends on copy completion:

- [ ] T-REORG-015 Copy root CLAUDE.md to phase-1/ with `cp CLAUDE.md phase-1/CLAUDE.md`
- [ ] T-REORG-016 Update phase-1/CLAUDE.md: Add header "# Phase-1 Specific Configuration", add execution instruction "Run: cd phase-1 && python3 -m src.todo_app.main", add context note "This is Phase-1 of a multi-phase project"
- [ ] T-REORG-017 Copy root .gitignore to phase-1/ with `cp .gitignore phase-1/.gitignore`
- [ ] T-REORG-018 Verify phase-1/.gitignore contains Python patterns (__pycache__/, *.pyc, .venv/, etc.) - no changes needed, just verification
- [ ] T-REORG-019 Add both configuration files to git with `git add phase-1/CLAUDE.md phase-1/.gitignore`

**Checkpoint**: Both config files copied and customized, added to git staging

---

## Phase 5: Update Documentation

**Purpose**: Adjust README and verify traceability preservation

**These tasks can run in parallel** (different files):

- [ ] T-REORG-020 [P] Update phase-1/README.md: Change "Running the Application" section to show `cd phase-1 && python3 -m src.todo_app.main`, update all relative paths to assume phase-1/ as working directory, add note "This is Phase-1 of 'The Evolution of Todo' multi-phase project"
- [ ] T-REORG-021 [P] Verify all Task ID references preserved in phase-1/src/ with `grep -r "Task:" phase-1/src/ | wc -l` (should show non-zero count matching original)
- [ ] T-REORG-022 [P] Verify all Spec references preserved in phase-1/src/ with `grep -r "Spec:" phase-1/src/ | wc -l` (should show non-zero count matching original)
- [ ] T-REORG-023 [P] Verify file content unchanged (zero code edits) by comparing file hashes before/after move (git automatically tracks this with renamed files)

**Checkpoint**: README updated, traceability verified (Task IDs and Spec references intact)

---

## Phase 6: Post-Move Validation & Testing

**Purpose**: Verify reorganization success and application functionality

**⚠️ CRITICAL**: All validation must PASS before committing

**Sequential execution required** - each validation depends on previous success:

- [ ] T-REORG-024 Verify phase-1/ folder structure with `ls -la phase-1/` (should show: src/, tests/, pyproject.toml, README.md, CLAUDE.md, .gitignore)
- [ ] T-REORG-025 Verify git history preserved for main.py with `git log --follow phase-1/src/todo_app/main.py | head -20` (should show original commit history)
- [ ] T-REORG-026 Test application execution from phase-1/ with `cd phase-1 && python3 -m src.todo_app.main` (menu should display successfully)
- [ ] T-REORG-027 Test Add operation: Launch app, add task with title "Test Reorganization" and description "Verify Add works", confirm success message
- [ ] T-REORG-028 Test View operation: In same session, view all tasks, verify "Test Reorganization" appears with ID 1 and [ ] status
- [ ] T-REORG-029 Test Mark Complete operation: In same session, mark task 1 complete, verify [✓] symbol appears when viewing again
- [ ] T-REORG-030 Test Update operation: In same session, update task 1 title to "Updated Title", verify change persisted
- [ ] T-REORG-031 Test Delete operation: In same session, delete task 1, verify task list is empty
- [ ] T-REORG-032 Test Exit operation: Select Exit option (6), verify "Goodbye!" message and clean exit with status 0
- [ ] T-REORG-033 Verify infrastructure folders remain in root with `ls -la | grep -E '(specs|\.specify|history)'` (all 3 should be present)
- [ ] T-REORG-034 Verify root configuration files remain with `ls -la | grep -E '(CLAUDE\.md|\.gitignore|README\.md)'` (all 3 should be present)

**Checkpoint**: All 8 success criteria verified (folder structure, git history, all 5 operations functional, traceability preserved, infrastructure in root, root configs exist)

---

## Phase 7: Commit and Documentation

**Purpose**: Finalize reorganization with descriptive commit and PHR

**Sequential execution required** - commit before PHR:

- [ ] T-REORG-035 Stage all changes with `git add -A` (should include renamed files, new root README, phase-1 configs)
- [ ] T-REORG-036 Review staged changes with `git status` and `git diff --staged --stat` to confirm no unexpected modifications
- [ ] T-REORG-037 Commit reorganization with message: `git commit -m "Reorganize Phase-1 into dedicated folder\n\n- Move src/, tests/, pyproject.toml, README.md to phase-1/\n- Copy and customize CLAUDE.md and .gitignore for phase-1\n- Create root README.md for multi-phase project overview\n- Preserve all git history with git mv\n- Verify all 5 operations remain functional\n\nSpec: FR-021 to FR-028"`
- [ ] T-REORG-038 Create PHR documenting reorganization with `.specify/scripts/bash/create-phr.sh --title "Phase-1 reorganization complete" --stage "green" --feature "001-todo-cli"` and fill all placeholders
- [ ] T-REORG-039 Verify commit succeeded with `git log -1 --stat` (should show renamed files and new files)
- [ ] T-REORG-040 Document new structure in root README.md if not already complete (ensure phase-1 location is clearly described)

**Checkpoint**: All changes committed, PHR created, repository in clean state

---

## Phase 8: Post-Reorganization Cleanup & Verification

**Purpose**: Final validation and optional cleanup tasks

**These tasks can run in parallel** (independent validations):

- [ ] T-REORG-041 [P] Run final application test from phase-1/: `cd phase-1 && python3 -m src.todo_app.main`, add 3 tasks, mark 1 complete, update 1, delete 1, view all, exit (full workflow)
- [ ] T-REORG-042 [P] Verify no orphaned files in root with `ls -la | grep -v -E '(phase-1|specs|\.specify|history|CLAUDE\.md|\.gitignore|README\.md|\.git)'` (should show minimal results)
- [ ] T-REORG-043 [P] Document folder structure in specs/001-todo-cli/reorganization-plan.md with "AFTER" state confirmation section
- [ ] T-REORG-044 [P] Update project documentation tree with new structure by running `tree -L 2 -I '__pycache__|*.pyc|.pytest_cache|.git' > docs/project-structure.txt` (if docs/ exists)
- [ ] T-REORG-045 Verify reorganization matches spec requirements FR-021 to FR-028 by cross-referencing each requirement with actual state

**Checkpoint**: Final validation complete, reorganization verified against all 8 functional requirements

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Pre-Move Validation)**: No dependencies - start here
- **Phase 2 (Create Structure)**: Depends on Phase 1 validation passing
- **Phase 3 (Move Files)**: Depends on Phase 2 directory creation
- **Phase 4 (Copy Configs)**: Depends on Phase 3 file moves (need phase-1/ to exist with files)
- **Phase 5 (Update Docs)**: Depends on Phase 3 and 4 (files must be in place)
- **Phase 6 (Post-Move Validation)**: Depends on Phases 3, 4, 5 complete
- **Phase 7 (Commit)**: Depends on Phase 6 all validations passing
- **Phase 8 (Cleanup)**: Depends on Phase 7 commit success

### Task Dependencies Within Phases

**Phase 3 (Critical - Sequential Only)**:
- T-REORG-009 must complete before T-REORG-010
- T-REORG-010 must complete before T-REORG-011
- T-REORG-011 must complete before T-REORG-012
- T-REORG-012 must complete before T-REORG-013
- Reason: Git mv operations should be staged incrementally for safety

**Phase 4 (Sequential)**:
- T-REORG-015 must complete before T-REORG-016
- T-REORG-017 must complete before T-REORG-018
- Reason: Cannot customize files before they exist

**Phase 5 (Parallel Allowed)**:
- T-REORG-020, T-REORG-021, T-REORG-022, T-REORG-023 can run in parallel
- Reason: Different files, read-only operations (except T-REORG-020 which writes to README)

**Phase 6 (Sequential)**:
- All tasks T-REORG-024 through T-REORG-034 must run sequentially
- Reason: Each validation depends on previous state being correct

**Phase 7 (Sequential)**:
- All tasks T-REORG-035 through T-REORG-040 must run sequentially
- Reason: Git operations must happen in order (stage → review → commit → document)

**Phase 8 (Parallel Allowed)**:
- T-REORG-041, T-REORG-042, T-REORG-043, T-REORG-044 can run in parallel
- T-REORG-045 should run after others complete (final validation)
- Reason: Independent verification tasks

---

## Rollback Strategy

If any phase fails, rollback using these commands:

**Before Commit (Phases 1-6)**:
```bash
git reset --hard HEAD  # Revert all changes
git clean -fd          # Remove untracked files
```

**After Commit (Phase 7+)**:
```bash
git reset --hard HEAD~1  # Undo last commit
git clean -fd            # Remove untracked files
```

**Verify rollback**:
```bash
python3 -m src.todo_app.main  # Should work from root again
```

---

## Success Criteria Validation

| Criterion | Task ID | Validation Command | Expected Result |
|-----------|---------|-------------------|-----------------|
| SC-REORG-001: Folder structure | T-REORG-024 | `ls -la phase-1/` | Shows src/, tests/, pyproject.toml, README.md, CLAUDE.md, .gitignore |
| SC-REORG-002: Git history | T-REORG-025 | `git log --follow phase-1/src/todo_app/main.py` | Shows complete original history |
| SC-REORG-003: App runs | T-REORG-026 | `cd phase-1 && python3 -m src.todo_app.main` | Menu displays successfully |
| SC-REORG-004: All ops work | T-REORG-027 to T-REORG-031 | Manual test each operation | Add, View, Update, Delete, Mark Complete all functional |
| SC-REORG-005: Task IDs | T-REORG-021 | `grep -r "Task:" phase-1/src/` | All Task: references present |
| SC-REORG-006: Spec refs | T-REORG-022 | `grep -r "Spec:" phase-1/src/` | All Spec: references present |
| SC-REORG-007: Infrastructure in root | T-REORG-033 | `ls -la \| grep -E '(specs\|\.specify\|history)'` | All 3 directories present |
| SC-REORG-008: Root configs | T-REORG-034 | `ls -la \| grep -E '(CLAUDE\|\.gitignore\|README)'` | All 3 files present |

---

## Implementation Strategy

### Recommended Execution Approach

**Option 1: Automated Sequential Execution** (Safest)
```bash
# Execute all phases sequentially with validation
for phase in {1..8}; do
  echo "=== Phase $phase ==="
  # Execute tasks for that phase
  # Validate success before proceeding
done
```

**Option 2: Manual Phase-by-Phase** (Most Control)
1. Complete Phase 1 → Verify checkpoint
2. Complete Phase 2 → Verify checkpoint
3. Complete Phase 3 → Verify checkpoint (CRITICAL - verify git renames)
4. Complete Phase 4 → Verify checkpoint
5. Complete Phase 5 → Verify checkpoint
6. Complete Phase 6 → Verify ALL validations PASS
7. Complete Phase 7 → Commit only if Phase 6 passed
8. Complete Phase 8 → Final verification

**Option 3: Script-Based Execution** (Fastest, but risky)
Create a bash script that executes all tasks with error handling and automatic rollback on failure.

---

## Notes

- **Zero Code Changes**: No .py files are edited - only moved and validated
- **Git History Preserved**: All git mv operations maintain complete file history
- **Rollback Safe**: Use `git reset --hard HEAD` before commit, `git reset --hard HEAD~1` after commit
- **Constitution Compliant**: No architectural changes, pure file reorganization
- **Traceability Maintained**: Task IDs and Spec references verified in Phase 5 and 6
- **Multi-Phase Ready**: Structure supports clean addition of phase-2/ through phase-5/ folders

---

## Task Summary

- **Total Tasks**: 45
- **Phase 1 (Pre-Move Validation)**: 5 tasks
- **Phase 2 (Create Structure)**: 3 tasks
- **Phase 3 (Move Files)**: 6 tasks (CRITICAL - sequential only)
- **Phase 4 (Copy Configs)**: 5 tasks
- **Phase 5 (Update Docs)**: 4 tasks (3 parallelizable)
- **Phase 6 (Post-Move Validation)**: 11 tasks (sequential)
- **Phase 7 (Commit)**: 6 tasks (sequential)
- **Phase 8 (Cleanup)**: 5 tasks (4 parallelizable)

- **Parallel Opportunities**: 7 tasks marked [P] can run in parallel (Phases 5 and 8)
- **Critical Sequential Sections**: Phase 3 (file moves), Phase 6 (validations), Phase 7 (commit)

---

## Traceability to Spec

| Functional Requirement | Task IDs | Validation Task |
|------------------------|----------|-----------------|
| FR-021: Folder naming `phase-1/` | T-REORG-006 | T-REORG-024 |
| FR-022: Git mv for history | T-REORG-009 to T-REORG-012 | T-REORG-025 |
| FR-023: Execution path | T-REORG-020, T-REORG-026 | T-REORG-026 to T-REORG-031 |
| FR-024: Infrastructure in root | N/A (no action) | T-REORG-033 |
| FR-025: Copy and customize configs | T-REORG-015 to T-REORG-019 | T-REORG-024 |
| FR-026: Update README | T-REORG-020 | T-REORG-041 |
| FR-027: Preserve traceability | T-REORG-023 | T-REORG-021, T-REORG-022 |
| FR-028: Verify functionality | T-REORG-001, T-REORG-026 to T-REORG-031 | T-REORG-041 |

All 8 functional requirements traceable to specific implementation and validation tasks.

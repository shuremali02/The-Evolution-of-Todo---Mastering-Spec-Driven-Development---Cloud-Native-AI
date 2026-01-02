# Reorganization Plan: Phase-1 Project Structure

**Branch**: `001-todo-cli` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Project Organization requirements from `/specs/001-todo-cli/spec.md` (FR-021 through FR-028)

## Summary

Reorganize Phase-1 todo CLI implementation into a dedicated `phase-1/` folder to prepare for multi-phase project development (Phase-2 through Phase-5). This is a pure structural reorganization with zero code changes - all files move with `git mv` to preserve history, configuration files are copied and customized, and the application remains fully functional post-move.

**Goal**: Isolate Phase-1 implementation in its own folder while keeping shared infrastructure (specs, .specify, history) at repository root.

## Technical Context

**Language/Version**: Python 3.13+ (unchanged from implementation)
**Primary Dependencies**: UV package manager, Python stdlib only (unchanged)
**Storage**: In-memory (unchanged - no file moves affect this)
**Testing**: pytest (unchanged location relative to phase-1/)
**Target Platform**: Linux/macOS/Windows desktop (unchanged)
**Project Type**: CLI application reorganization (file structure only)
**Performance Goals**: No performance impact (pure file moves)
**Constraints**: Must preserve git history, Task ID traceability, and full functionality
**Scale/Scope**: Move 17 files, update 2 files, create 2 root files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Article II Compliance: Hard Technical Constraints

**✅ PASS - Forbidden Technologies**: None introduced
- This is a file reorganization only - no new technologies
- Phase-1 implementation already validated as Constitution-compliant

**✅ PASS - Permitted Technologies**: No changes
- Python 3.13+ CLI remains the only runtime
- Local filesystem operations only (git mv)
- No network, containers, databases, or forbidden tech

### Article III Compliance: Architecture Rules

**✅ PASS - Single-Process Constraint**:
- No architectural changes - pure file moves
- Application execution method changes to `cd phase-1 && python3 -m src.todo_app.main`
- Still single-process CLI application

**✅ PASS - State Management**:
- No changes to in-memory storage implementation
- File moves do not affect runtime state

**✅ PASS - Determinism**:
- No code changes - determinism unchanged
- File locations do not affect application behavior

### Article IV Compliance: Spec-Driven Law

**✅ PASS - Development Pipeline**:
- Reorganization specified in spec.md (FR-021 through FR-028)
- This plan documents the reorganization approach
- Tasks will be generated via /sp.tasks

**✅ PASS - Traceability** (to be enforced during reorganization):
- FR-027 explicitly requires preserving all Task ID references
- Git mv preserves file history and blame information
- No modification to source code content

### Article V Compliance: Traceability Requirements

**✅ PASS - Preserved**:
- All files moved with `git mv` maintain git history
- Task ID headers in files unchanged (no content edits)
- Spec references in docstrings unchanged (no content edits)

### Constitution Check Result

**STATUS**: ✅ **PASS** - No violations detected

This is a pure structural reorganization with zero Constitution impact. All constraints remain satisfied post-move.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-cli/
├── spec.md              # Feature specification (UPDATED with FR-021 to FR-028)
├── plan.md              # Original implementation plan (UNCHANGED)
├── reorganization-plan.md # This file (NEW - reorganization plan)
├── research.md          # Research findings (UNCHANGED)
├── data-model.md        # Data model (UNCHANGED)
├── quickstart.md        # Usage guide (UNCHANGED - will update phase-1/README.md instead)
├── checklists/          # Quality checklists (UNCHANGED)
└── tasks.md             # Implementation tasks (UNCHANGED)
```

### Source Code Structure

**BEFORE (Current State)**:
```text
/
├── src/todo_app/           # Application source
│   ├── main.py
│   ├── models/
│   ├── services/
│   ├── ui/
│   └── validators/
├── tests/                  # Test files
│   ├── unit/
│   └── integration/
├── pyproject.toml          # UV config
├── README.md               # Root README
├── CLAUDE.md               # Root agent config
├── .gitignore              # Root gitignore
├── specs/                  # Specifications
├── .specify/               # SDD infrastructure
└── history/                # PHRs and ADRs
```

**AFTER (Target State)**:
```text
/
├── phase-1/                # Phase-1 isolated implementation
│   ├── src/todo_app/      # [MOVED] Application source
│   │   ├── main.py
│   │   ├── models/
│   │   ├── services/
│   │   ├── ui/
│   │   └── validators/
│   ├── tests/             # [MOVED] Test files
│   │   ├── unit/
│   │   └── integration/
│   ├── pyproject.toml     # [MOVED] UV config
│   ├── README.md          # [MOVED + UPDATED] Phase-1 specific
│   ├── CLAUDE.md          # [COPIED + CUSTOMIZED] Phase-1 agent rules
│   └── .gitignore         # [COPIED + CUSTOMIZED] Phase-1 patterns
│
├── README.md              # [NEW] Multi-phase project overview
├── CLAUDE.md              # [KEPT] Project-wide default
├── .gitignore             # [KEPT] Project-wide patterns
├── specs/                 # [KEPT] Shared specifications
├── .specify/              # [KEPT] Shared SDD tooling
└── history/               # [KEPT] Shared history with feature subdirs
```

**Structure Decision**: Single-phase isolation within multi-phase project. Each phase (1-5) will have its own folder, while specs/, .specify/, and history/ remain shared infrastructure at root. This enables clean separation of implementations while maintaining unified specification and tooling.

## Complexity Tracking

**No violations** - Constitution Check passed. This section is not needed.

## Phase 0: Research

### Research Questions

This is a file reorganization task with all decisions already made via /sp.clarify. No research needed as:

1. **Folder naming**: Resolved → `phase-1/` (FR-021)
2. **Git operations**: Resolved → `git mv` (FR-022)
3. **Execution method**: Resolved → `cd phase-1 && python3 -m src.todo_app.main` (FR-023)
4. **Infrastructure handling**: Resolved → Keep in root (FR-024)
5. **Configuration files**: Resolved → Copy and customize (FR-025)

### Research Output

**File**: `research.md` - **NOT NEEDED** for this reorganization

All technical decisions were clarified during the spec phase. This plan directly implements those clarified requirements.

## Phase 1: Design & Contracts

### File Movement Strategy

**Not Applicable** - This is a reorganization, not a new feature design.

The "design" for this task is the folder structure itself, fully specified in FR-021 through FR-028.

### Data Model

**Not Applicable** - No data model changes. The existing Task entity and TaskManager remain unchanged.

### API Contracts

**Not Applicable** - This is a CLI application with no API. Reorganization does not affect the CLI interface.

### Quickstart Guide

**Action Required**: Update `phase-1/README.md` (moved from root) to reflect:
- New execution path: `cd phase-1 && python3 -m src.todo_app.main`
- Context: This is Phase-1 of a multi-phase project
- Relative paths adjusted for phase-1/ context

This update is captured as FR-026 and will be a specific task.

## Implementation Phases (Summary for tasks.md)

### Phase 1: Pre-Move Validation
- **Purpose**: Verify current state before any moves
- Validate Phase-1 application is fully functional
- Create backup/checkpoint in git
- Document current file structure

### Phase 2: Create Target Structure
- **Purpose**: Set up phase-1/ folder and root files
- Create `phase-1/` directory
- Create root-level `README.md` (multi-phase project overview)
- Prepare for file moves

### Phase 3: Move Implementation Files (Git MV)
- **Purpose**: Relocate Phase-1 files with history preservation
- `git mv src/ phase-1/src/`
- `git mv tests/ phase-1/tests/`
- `git mv pyproject.toml phase-1/pyproject.toml`
- `git mv README.md phase-1/README.md`

### Phase 4: Copy and Customize Configuration Files
- **Purpose**: Create phase-specific configs from root templates
- Copy `CLAUDE.md` → `phase-1/CLAUDE.md` (update with phase-1 context)
- Copy `.gitignore` → `phase-1/.gitignore` (adjust for phase-1 paths)

### Phase 5: Update Documentation
- **Purpose**: Adjust references to new paths
- Update `phase-1/README.md` with execution instructions
- Update `phase-1/CLAUDE.md` with phase-specific notes
- Verify all Task ID references preserved (no content changes)

### Phase 6: Post-Move Validation
- **Purpose**: Verify reorganization success
- Test application: `cd phase-1 && python3 -m src.todo_app.main`
- Run all 5 operations (Add, View, Update, Delete, Mark Complete)
- Verify git history preserved: `git log --follow phase-1/src/todo_app/main.py`
- Check Task ID traceability: `grep -r "Task:" phase-1/src/`

### Phase 7: Commit and Documentation
- **Purpose**: Finalize reorganization
- Commit all changes with descriptive message
- Update root README.md with phase-1 location
- Create PHR documenting reorganization

## Traceability Matrix

| Functional Requirement | Implementation Action | Task ID (TBD) |
|-------------------------|----------------------|---------------|
| FR-021: Folder naming `phase-1/` | Create directory | T-REORG-001 |
| FR-022: Git mv for history | Use git mv commands | T-REORG-002 |
| FR-023: Execution method | Update README.md | T-REORG-003 |
| FR-024: Keep infrastructure in root | No action (verification only) | T-REORG-004 |
| FR-025: Copy configs | cp + customize CLAUDE.md, .gitignore | T-REORG-005 |
| FR-026: Update README | Modify phase-1/README.md | T-REORG-006 |
| FR-027: Preserve traceability | Validation (no content edits) | T-REORG-007 |
| FR-028: Verify functionality | Manual testing | T-REORG-008 |

## File Operations Checklist

### Files to Move (Git MV)
- [ ] `src/` → `phase-1/src/` (preserves history of 11 .py files)
- [ ] `tests/` → `phase-1/tests/` (preserves history of test directories)
- [ ] `pyproject.toml` → `phase-1/pyproject.toml`
- [ ] `README.md` → `phase-1/README.md`

### Files to Copy (Then Customize)
- [ ] `CLAUDE.md` → `phase-1/CLAUDE.md`
  - Add: "This is Phase-1 specific configuration"
  - Add: "Execution: cd phase-1 && python3 -m src.todo_app.main"
- [ ] `.gitignore` → `phase-1/.gitignore`
  - Keep Python patterns
  - Adjust paths if needed (likely no changes)

### Files to Create
- [ ] Root `README.md` (new multi-phase project overview)
  - Project name and purpose
  - Phase structure (phase-1/, phase-2/, etc.)
  - Links to phase-specific READMEs
  - SDD methodology overview

### Files to Keep (No Changes)
- [ ] `specs/` directory (verify remains at root)
- [ ] `.specify/` directory (verify remains at root)
- [ ] `history/` directory (verify remains at root)
- [ ] Root `CLAUDE.md` (original remains)
- [ ] Root `.gitignore` (original remains)

## Success Criteria Verification

| Success Criterion | Verification Method | Expected Result |
|-------------------|---------------------|-----------------|
| SC-REORG-001: Folder structure matches FR-021 | `ls -la phase-1/` | Shows src/, tests/, pyproject.toml, README.md, CLAUDE.md, .gitignore |
| SC-REORG-002: Git history preserved | `git log --follow phase-1/src/todo_app/main.py` | Shows complete file history from root |
| SC-REORG-003: Application runs | `cd phase-1 && python3 -m src.todo_app.main` | Menu displays successfully |
| SC-REORG-004: All 5 operations work | Manual test all features | Add, View, Update, Delete, Mark Complete all functional |
| SC-REORG-005: Task IDs preserved | `grep -r "Task:" phase-1/src/` | All Task: T### references present |
| SC-REORG-006: Spec references preserved | `grep -r "Spec:" phase-1/src/` | All Spec: FR-### references present |
| SC-REORG-007: Infrastructure in root | `ls -la .specify/ history/ specs/` | All three directories present at root |
| SC-REORG-008: Root configs exist | `ls -la README.md CLAUDE.md .gitignore` | All three files present at root |

## Edge Cases & Risk Mitigation

### Risk 1: Git history loss
- **Mitigation**: Use `git mv` exclusively (never `mv` then `git add`)
- **Validation**: Test with `git log --follow` on moved files
- **Rollback**: If history lost, `git reset --hard` to pre-move commit

### Risk 2: Broken imports after move
- **Mitigation**: No code changes - imports are relative within src/
- **Validation**: Execute application and run all operations
- **Rollback**: `git mv` back to original locations

### Risk 3: Lost Task ID references
- **Mitigation**: No file content edits - only moves and copies
- **Validation**: Grep for Task: and Spec: patterns in phase-1/src/
- **Rollback**: N/A - content never modified

### Risk 4: Broken README instructions
- **Mitigation**: Explicit task to update README with new execution path
- **Validation**: Follow README instructions step-by-step
- **Rollback**: Revert README changes if incorrect

### Risk 5: Merge conflicts (if parallel work)
- **Mitigation**: Complete reorganization on dedicated branch
- **Validation**: Review all file moves before committing
- **Rollback**: Branch-level rollback if needed

## Next Steps

1. **Generate Tasks**: Run `/sp.tasks` to create detailed task breakdown from this plan
2. **Execute Reorganization**: Follow task sequence phase-by-phase
3. **Validate**: Run all success criteria checks
4. **Commit**: Single commit with message "Reorganize Phase-1 into dedicated folder"
5. **Document**: Update project-level README with new structure

## Notes

- **Zero Code Changes**: This is a pure file reorganization - no .py files are edited
- **Constitution Compliant**: All moves preserve existing Constitution compliance
- **Traceability Preserved**: Git mv + no edits = complete history and Task ID preservation
- **Rollback Safe**: All operations reversible via git reset
- **Multi-Phase Ready**: Structure supports clean addition of phase-2/ through phase-5/

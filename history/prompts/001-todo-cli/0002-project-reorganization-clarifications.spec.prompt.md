---
id: 0002
title: Project reorganization clarifications
stage: spec
date: 2025-12-29
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-cli
branch: 001-todo-cli
user: shuremali
command: /sp.clarify
labels: ["clarification", "spec", "reorganization", "multi-phase", "project-structure"]
links:
  spec: specs/001-todo-cli/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-todo-cli/spec.md
tests:
  - N/A (specification clarification only)
---

## Prompt

User requested `/sp.clarify` with task context: "Organize Phase-1 project into dedicated folder with proper subfolders, keeping specs files in root. Move all existing Phase-1 implementation files into this folder. Update relative paths if necessary."

**Objectives:**
1. Create a Phase-1 folder at project root
2. Move all Phase-1 implementation files (src/, test/, project.toml, README.md, CLAUDE.md)
3. Preserve file contents and SDD traceability (Task IDs, Spec sections)
4. Keep root clean for Phase-2, 3, 4, 5 development
5. Specs files remain in root (do NOT move them)

**Target Structure:**
```
/phase-1/
    src/
    test/
    project.toml
    README.md
    CLAUDE.md

specs/001-todo-cli/  (remain in root, unchanged)
```

**Rules:**
- Do NOT delete any files
- Do NOT modify code logic
- Only restructure implementation files
- Ensure all Task IDs and specs references remain intact
- Verify Phase-1 remains functional after move

## Response snapshot

Conducted structured ambiguity analysis and identified 5 critical decision points requiring clarification:

1. **Folder Naming Convention** (High Impact)
   - Question: Should it be `phase-1/`, `Phase-1/`, `phase-01/`, or `01-phase-1/`?
   - Answer: **phase-1/** (lowercase with hyphen)
   - Rationale: Consistency with existing `specs/001-todo-cli/` pattern

2. **Git History Preservation** (High Impact)
   - Question: Should we use `git mv` or regular `mv`?
   - Answer: **git mv** (preserves file history and blame information)
   - Rationale: Critical for traceability and SDD methodology compliance

3. **Python Module Import Paths** (Critical - Functionality)
   - Question: How should application be executed after moving to phase-1/?
   - Answer: **cd phase-1 && python3 -m src.todo_app.main** (change directory first, simpler imports)
   - Rationale: Keeps imports simple, phase self-contained

4. **Infrastructure Folders Handling** (Medium Impact)
   - Question: Should `.specify/` and `history/` be moved or kept in root?
   - Answer: **Keep in root** (shared infrastructure across all phases)
   - Rationale: Already organized with feature-specific subdirectories

5. **Root Configuration Files** (Medium Impact)
   - Question: How to handle root `CLAUDE.md` and `.gitignore`?
   - Answer: **Create phase-1 specific copies, keep root versions** (allows per-phase customization)
   - Rationale: Maximum flexibility for future phases

**Spec Updates:**
- Added 5 Q&A entries to `## Clarifications / Session 2025-12-29`
- Created new `## Project Organization` section with 8 functional requirements (FR-021 through FR-028)
- Defined complete folder structure with explicit move/copy/keep decisions
- Updated `## Open Questions` to reflect completion

## Outcome

- ✅ Impact: All critical ambiguities resolved. Added 8 new functional requirements (FR-021 to FR-028) covering folder structure, git operations, execution paths, and file handling. Project reorganization now fully specified and ready for implementation.
- 🧪 Tests: No tests required (specification clarification only). Verification requirement added as FR-028.
- 📁 Files: Updated `specs/001-todo-cli/spec.md` with reorganization requirements (new section + 5 clarifications).
- 🔁 Next prompts: Ready for `/sp.plan` to create reorganization implementation plan, or directly implement the reorganization following the clarified requirements.
- 🧠 Reflection: Clarification workflow successfully identified 5 high-impact decision points that would have caused rework if assumed. Each answer prevents specific failure modes: naming convention ensures consistency across all 5 phases, git mv preserves traceability, execution method maintains simplicity, infrastructure sharing avoids duplication, config copying enables per-phase customization.

## Evaluation notes (flywheel)

- Failure modes observed: None. All questions were answerable with single-letter responses as designed. User provided clear, consistent answers aligned with best practices.
- Graders run and results (PASS/FAIL):
  - Clarification coverage: PASS (5 critical categories addressed)
  - Question quality: PASS (all high-impact, implementation-affecting)
  - Spec integration: PASS (new section + FRs added without breaking existing structure)
  - Terminology consistency: PASS (lowercase hyphenated naming throughout)
- Prompt variant (if applicable): Standard /sp.clarify workflow with project reorganization context
- Next experiment (smallest change to try): Consider adding a validation checklist to FR-028 specifying exact tests to run post-reorganization (e.g., "application starts within 2 seconds", "all 5 operations work", "git log shows preserved history").

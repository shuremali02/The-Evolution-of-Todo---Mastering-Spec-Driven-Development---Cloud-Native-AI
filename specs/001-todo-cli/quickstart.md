# Quickstart Guide: Todo CLI Application

**Feature**: 001-todo-cli
**Phase**: Phase-1 (Training & Validation of SDD Methodology)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.13+**: [Download Python](https://www.python.org/downloads/)
- **UV Package Manager**: Install via `pip install uv` or [UV docs](https://github.com/astral-sh/uv)
- **Git**: For version control (optional but recommended)

**Verify installations**:
```bash
python --version  # Should show 3.13.x or higher
uv --version      # Should show UV version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-cli-app
```

### 2. Install Dependencies

```bash
uv sync
```

This installs pytest (dev dependency) for testing. No runtime dependencies are required.

---

## Running the Application

### Start the CLI

```bash
python src/todo_app/main.py
```

You should see the main menu:

```
========================================
         TODO CLI APPLICATION
========================================

1) Add Task
2) View All Tasks
3) Update Task
4) Delete Task
5) Mark Task Complete/Incomplete
6) Exit

Enter choice (1-6):
```

---

## Basic Usage

### Add a Task

1. Select option `1` (Add Task)
2. Enter task title when prompted (1-200 characters)
3. Enter task description when prompted (0-1000 characters, optional)
4. Task is added with auto-generated ID

**Example**:
```
Enter choice (1-6): 1
Enter task title: Buy groceries
Enter task description: Milk, eggs, bread
✓ Task added successfully! (ID: 1)
```

### View All Tasks

1. Select option `2` (View All Tasks)
2. All tasks display with ID, status ([✓] or [ ]), title, and description

**Example**:
```
Enter choice (1-6): 2

========================================
            ALL TASKS
========================================

ID: 1 [ ] Buy groceries
Description: Milk, eggs, bread

ID: 2 [✓] Complete project report
Description: Finish Q4 analysis

Total tasks: 2
```

### Mark Task Complete

1. Select option `5` (Mark Task Complete/Incomplete)
2. Enter task ID
3. Task status toggles (incomplete ↔ complete)

**Example**:
```
Enter choice (1-6): 5
Enter task ID: 1
✓ Task 1 marked as complete.
```

### Update a Task

1. Select option `3` (Update Task)
2. Enter task ID
3. Enter new title (or press Enter to keep current)
4. Enter new description (or press Enter to keep current)

**Example**:
```
Enter choice (1-6): 3
Enter task ID: 1
Enter new title (or press Enter to skip): Buy organic groceries
Enter new description (or press Enter to skip): Whole Foods, get organic milk
✓ Task 1 updated successfully.
```

### Delete a Task

1. Select option `4` (Delete Task)
2. Enter task ID
3. Task is permanently deleted

**Example**:
```
Enter choice (1-6): 4
Enter task ID: 2
✓ Task 2 deleted successfully.
```

### Exit

1. Select option `6` (Exit)
2. Application terminates with goodbye message

**Example**:
```
Enter choice (1-6): 6
Goodbye! All tasks will be lost.
```

**Note**: All tasks are stored in memory only. Data is lost when the application exits.

---

## Running Tests

### Run All Tests

```bash
pytest tests/
```

### Run Specific Test Suite

```bash
# Unit tests only
pytest tests/unit/

# Integration tests only
pytest tests/integration/

# Specific test file
pytest tests/unit/test_task_manager.py

# Verbose output
pytest tests/ -v
```

### Expected Test Output

```
============================= test session starts ==============================
collected 15 items

tests/unit/test_task.py ........                                         [ 53%]
tests/unit/test_task_manager.py ....                                     [ 80%]
tests/unit/test_validator.py ....                                        [ 93%]
tests/integration/test_cli_flow.py .                                     [100%]

============================== 15 passed in 0.25s ===============================
```

---

## Error Handling

The application validates all user input and provides clear error messages:

| Error Scenario | Error Message |
|----------------|---------------|
| Empty title | "Title cannot be empty. Please enter at least 1 character." |
| Title too long (>200 chars) | "Title truncated to 200 characters." (warning) |
| Description too long (>1000 chars) | "Description truncated to 1000 characters." (warning) |
| Non-numeric task ID | "Invalid input. Please enter a numeric task ID." |
| Negative task ID | "Task ID must be positive." |
| Task not found | "Task not found." |
| Update with no changes | "No changes provided. Please enter a new title or description." |
| Invalid menu choice | "Invalid choice. Please enter a number between 1 and 6." |

---

## Keyboard Shortcuts

- **Ctrl+C**: Exit immediately (data lost, exit code 130)
- **Ctrl+D** (EOF): Treated as invalid input, prompts again

---

## Project Structure Overview

```
src/todo_app/
├── main.py               # CLI entry point and menu loop
├── models/
│   └── task.py          # Task dataclass
├── services/
│   └── task_manager.py  # CRUD operations
├── ui/
│   ├── menu.py          # Menu display
│   └── formatter.py     # Task formatting ([✓]/[ ])
└── validators/
    └── input_validator.py # Input validation

tests/
├── unit/                # Unit tests for each module
└── integration/         # End-to-end CLI tests
```

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'todo_app'"

**Solution**: Ensure you're running from the repository root:
```bash
python src/todo_app/main.py
```

### "pytest: command not found"

**Solution**: Install dev dependencies:
```bash
uv sync
```

### "SyntaxError: invalid syntax"

**Solution**: Verify Python 3.13+ is installed:
```bash
python --version
```

### Application hangs after Ctrl+C

**Solution**: This is expected behavior - Ctrl+C exits immediately with status 130. No cleanup needed (data is in-memory only).

---

## Performance Expectations

Based on success criteria (SC-001 to SC-010):

- **Startup time**: < 2 seconds
- **Operation response time**: < 500ms per action
- **Capacity**: 100 tasks without noticeable degradation
- **Memory footprint**: < 50MB

**Tested on**: Linux/macOS/Windows with Python 3.13

---

## Next Steps

- **Extend functionality**: Add task search, filtering, or sorting (requires spec update)
- **Persist data**: Add file-based storage (Phase-2+ feature, violates Phase-1 Constitution)
- **Add tests**: Contribute unit tests for edge cases

**Note**: All enhancements must follow Spec-Driven Development workflow:
1. Update `spec.md` with new requirements
2. Run `/sp.clarify` to resolve ambiguities
3. Run `/sp.plan` to update implementation plan
4. Run `/sp.tasks` to generate task breakdown
5. Implement with Task ID traceability

---

## Contributing

All code must comply with Phase-1 Constitution:
- Single-process CLI only
- In-memory storage only (no persistence)
- Python stdlib only (no external runtime dependencies)
- Every function must reference Task ID in docstring
- Every file must list Task IDs in header

See `.specify/memory/constitution.md` for full requirements.

---

## Support

- **Issues**: Report bugs via GitHub Issues
- **Questions**: Check `spec.md` and `plan.md` for detailed requirements
- **Task Traceability**: See `tasks.md` for Task ID mappings

---

## License

[Add license information here]

---

**Phase-1 Status**: Training & Validation of SDD Methodology
**Constitution Version**: 1.0.0
**Last Updated**: 2025-12-29

# Todo CLI Application

**Phase-1 Training Project**: In-memory Python console todo application demonstrating Spec-Driven Development (SDD) methodology.

**Note**: This is Phase-1 of "The Evolution of Todo" multi-phase project. See the [root README](../ROOT-README.md) for the complete project structure.

## Overview

A command-line todo application that stores tasks in memory, providing five core operations: Add, View, Update, Delete, and Mark Complete. Built entirely through Claude Code following the Spec-Kit Plus framework and Phase-1 Constitution constraints.

## Features

- ✅ **Add tasks** with title and description
- ✅ **View all tasks** with status indicators ([✓] complete, [ ] incomplete)
- ✅ **Update tasks** - modify title and/or description
- ✅ **Delete tasks** permanently
- ✅ **Mark complete/incomplete** - toggle task status
- ✅ **Input validation** with clear error messages
- ✅ **Interactive menu** with numbered options
- ✅ **Clean exit** with goodbye message

## Prerequisites

- **Python 3.13+**: [Download Python](https://www.python.org/downloads/)
- **UV Package Manager**: Install via `pip install uv` or [UV docs](https://github.com/astral-sh/uv)

Verify installations:
```bash
python3 --version  # Should show 3.13.x or higher
uv --version       # Should show UV version
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "The Evolution of Todo – Mastering Spec-Driven Development & Cloud Native AI"
cd phase-1
```

### 2. Install Dependencies

```bash
uv sync
```

This installs pytest (dev dependency) for testing. No runtime dependencies are required.

## Running the Application

From the `phase-1/` directory:

```bash
cd phase-1
python3 -m src.todo_app.main
```

You'll see the main menu:

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

## Usage Examples

### Add a Task

```
Enter choice (1-6): 1
Enter task title: Buy groceries
Enter task description (optional): Milk, eggs, bread
✓ Task added successfully! (ID: 1)
```

### View All Tasks

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

```
Enter choice (1-6): 5
Enter task ID: 1
✓ Task 1 marked as complete.
```

### Update a Task

```
Enter choice (1-6): 3
Enter task ID: 1
Enter new title (or press Enter to skip): Buy organic groceries
Enter new description (or press Enter to skip): Whole Foods, get organic milk
✓ Task 1 updated successfully.
```

### Delete a Task

```
Enter choice (1-6): 4
Enter task ID: 2
✓ Task 2 deleted successfully.
```

### Exit

```
Enter choice (1-6): 6
Goodbye! All tasks will be lost.
```

**Note**: All tasks are stored in memory only. Data is lost when the application exits.

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

## Project Structure

```
src/todo_app/
├── main.py               # CLI entry point and menu loop
├── models/
│   └── task.py          # Task dataclass
├── services/
│   └── task_manager.py  # CRUD operations
├── ui/
│   ├── menu.py          # Menu display and input handlers
│   └── formatter.py     # Task formatting ([✓]/[ ])
└── validators/
    └── input_validator.py # Input validation logic

tests/
├── unit/                # Unit tests for each module
└── integration/         # End-to-end CLI tests

specs/001-todo-cli/      # Feature specification documents
├── spec.md              # Requirements and user stories
├── plan.md              # Implementation plan
├── tasks.md             # Task breakdown
├── data-model.md        # Data model documentation
├── research.md          # Technical research
└── quickstart.md        # Usage guide
```

## Development

### Running Tests

From the `phase-1/` directory:

```bash
# Run all tests
cd phase-1
pytest tests/

# Run unit tests only
pytest tests/unit/

# Run with verbose output
pytest tests/ -v
```

### Code Quality

All code follows:
- **PEP 8** style guidelines
- **Task traceability** - every function references Task ID in docstring
- **Spec traceability** - every file lists Task IDs and Spec references in header
- **Phase-1 Constitution** compliance - single-process, in-memory only, no external dependencies

### Task Traceability

This project uses Spec-Driven Development with full traceability:
- See `specs/001-todo-cli/spec.md` for requirements
- See `specs/001-todo-cli/plan.md` for architecture decisions
- See `specs/001-todo-cli/tasks.md` for task breakdown
- Every source file includes Task ID references

Example from `src/todo_app/models/task.py`:
```python
# Task: T006, T015, T023, T029
# Spec: FR-002, FR-003, FR-004, FR-005, FR-006

@dataclass
class Task:
    """Represents a todo task.

    Task: T006
    Spec: FR-002, FR-003 (Add task, Auto-assign IDs)
    """
```

## Performance

Based on success criteria:
- **Startup time**: < 2 seconds
- **Operation response time**: < 500ms per action
- **Capacity**: 100 tasks without degradation
- **Memory footprint**: < 50MB

## Constitution Compliance

This project strictly adheres to Phase-1 Constitution:
- ✅ Single-process CLI only (no microservices, no async)
- ✅ In-memory storage only (no databases, no files)
- ✅ Python stdlib only (no external runtime dependencies)
- ✅ No forbidden technologies (Docker, Kafka, web servers, etc.)
- ✅ Every function references Task ID in docstring
- ✅ Every file lists Task IDs in header

See `.specify/memory/constitution.md` for full requirements.

## Keyboard Shortcuts

- **Ctrl+C**: Exit immediately (data lost, exit code 130)
- **Ctrl+D** (EOF): Treated as invalid input, prompts again

## Troubleshooting

### "ModuleNotFoundError: No module named 'todo_app'"

**Solution**: Ensure you're running as a module from the phase-1/ directory:
```bash
cd phase-1
python3 -m src.todo_app.main
```

### "pytest: command not found"

**Solution**: Install dev dependencies:
```bash
uv sync
```

### "SyntaxError: invalid syntax"

**Solution**: Verify Python 3.13+ is installed:
```bash
python3 --version
```

## Contributing

All code must comply with Phase-1 Constitution:
- Single-process CLI only
- In-memory storage only (no persistence)
- Python stdlib only (no external runtime dependencies)
- Every function must reference Task ID in docstring
- Every file must list Task IDs in header

See `.specify/memory/constitution.md` for full requirements.

## License

[Add license information here]

## Acknowledgments

Built with:
- **Claude Code**: AI-powered development assistant
- **Spec-Kit Plus**: Spec-Driven Development framework
- **UV**: Fast Python package manager

---

**Phase-1 Status**: Training & Validation of SDD Methodology
**Constitution Version**: 1.0.0
**Last Updated**: 2025-12-29

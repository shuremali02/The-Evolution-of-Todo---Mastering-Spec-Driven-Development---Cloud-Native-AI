# Research: Todo In-Memory Python Console App

**Date**: 2025-12-29
**Feature**: 001-todo-cli
**Phase**: Phase 0 (Research)

## Research Questions & Findings

### 1. Python 3.13 CLI Best Practices

**Question**: What are the standard patterns for menu-driven CLI applications in Python?

**Decision**: Use `input()` with while loop for synchronous menu interaction

**Rationale**:
- `input()` is built-in, synchronous, and deterministic
- While loop provides simple menu redisplay pattern
- Try-except blocks handle Ctrl+C gracefully (raises KeyboardInterrupt)
- No external libraries needed (argparse/click overkill for menu-driven app)

**Alternatives Considered**:
- **argparse**: Rejected - designed for command-line arguments, not interactive menus
- **click**: Rejected - external dependency, violates Constitution's simplicity principle
- **curses**: Rejected - complex, platform-specific, unnecessary for simple menu

**Pattern**:
```python
def main():
    while True:
        display_menu()
        choice = input("Enter choice: ")
        if choice == '6':
            print("Goodbye!")
            sys.exit(0)
        handle_choice(choice)
```

---

### 2. UV Package Manager Setup

**Question**: How to initialize and configure a Python project with UV?

**Decision**: Use `uv init` with minimal pyproject.toml configuration

**Rationale**:
- UV is faster than pip/poetry for dependency resolution
- pyproject.toml is the Python standard (PEP 518)
- No external dependencies needed for core functionality (stdlib only)
- pytest is only dev dependency

**Alternatives Considered**:
- **pip + requirements.txt**: Rejected - UV specified in spec (FR-019)
- **poetry**: Rejected - heavier than UV, not specified in requirements

**Configuration**:
```toml
[project]
name = "todo-cli"
version = "0.1.0"
description = "Phase-1 Todo CLI Application"
requires-python = ">=3.13"
dependencies = []

[project.optional-dependencies]
dev = ["pytest>=7.0.0"]

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
```

---

### 3. In-Memory Data Structures

**Question**: What's the best way to manage task collections in memory?

**Decision**: Use `dict[int, Task]` with integer keys for task storage

**Rationale**:
- O(1) lookup by task ID (constant time performance)
- Sequential ID generation trivial with counter
- Dictionary preserves insertion order (Python 3.7+)
- No complex data structures needed

**Alternatives Considered**:
- **list[Task]**: Rejected - O(n) lookup by ID, requires linear search
- **OrderedDict**: Rejected - unnecessary, dict already ordered in Python 3.7+
- **dataclass with slots**: Considered for Task model (accepted)

**Implementation**:
```python
class TaskManager:
    def __init__(self):
        self.tasks: Dict[int, Task] = {}
        self.next_id: int = 1

    def add_task(self, title: str, description: str) -> Task:
        task = Task(id=self.next_id, title=title, description=description)
        self.tasks[self.next_id] = task
        self.next_id += 1
        return task
```

---

### 4. Input Validation

**Question**: What are Python patterns for stdin validation and error handling?

**Decision**: Separate validator module with explicit validation functions

**Rationale**:
- Single Responsibility Principle - validation logic isolated
- Testable independently from UI/business logic
- Clear error messages per spec clarifications
- Validation before business logic (fail fast)

**Alternatives Considered**:
- **pydantic**: Rejected - external dependency, overkill for simple validation
- **Inline validation**: Rejected - violates separation of concerns
- **Dataclass validators**: Rejected - validation should happen before object creation

**Pattern**:
```python
class InputValidator:
    @staticmethod
    def validate_title(title: str) -> tuple[str, Optional[str]]:
        """Validate title, return (cleaned_value, error_message)."""
        if not title or len(title) == 0:
            return "", "Title cannot be empty. Please enter at least 1 character."
        if len(title) > 200:
            return title[:200], "Title truncated to 200 characters."
        return title, None

    @staticmethod
    def validate_task_id(id_str: str) -> tuple[Optional[int], Optional[str]]:
        """Validate task ID input."""
        try:
            task_id = int(id_str)
        except ValueError:
            return None, "Invalid input. Please enter a numeric task ID."

        if task_id <= 0:
            return None, "Task ID must be positive."

        return task_id, None
```

---

### 5. Exit Codes

**Question**: What are the standard POSIX exit codes for CLI applications?

**Decision**: Use standard exit codes: 0 (success), 1 (error), 130 (SIGINT)

**Rationale**:
- POSIX standard compliance
- 0 = successful execution
- 1 = general error
- 130 = terminated by Ctrl+C (128 + SIGINT signal number 2)
- Python's default KeyboardInterrupt handling returns 130 automatically

**Alternatives Considered**:
- **Custom exit codes**: Rejected - unnecessary complexity, breaks conventions

**Implementation**:
```python
import sys

# Success
sys.exit(0)

# Error
sys.exit(1)

# Ctrl+C (automatic via KeyboardInterrupt, no custom handling needed)
```

---

### 6. Testing Strategy

**Question**: What are pytest patterns for CLI application testing?

**Decision**: Unit tests for all modules + integration test with capsys fixture

**Rationale**:
- pytest's capsys fixture captures stdout/stderr
- Unit tests validate individual components (task_manager, validator, formatter)
- Integration test validates full CLI flow end-to-end
- No mocking needed for in-memory app (no external dependencies)

**Alternatives Considered**:
- **unittest**: Rejected - pytest more Pythonic, better fixtures
- **doctest**: Rejected - insufficient for CLI testing
- **Manual testing only**: Rejected - violates automated testing best practices

**Patterns**:
```python
# Unit test
def test_add_task():
    manager = TaskManager()
    task = manager.add_task("Test", "Description")
    assert task.id == 1
    assert task.title == "Test"
    assert not task.completed

# Integration test with capsys
def test_cli_flow(capsys, monkeypatch):
    inputs = iter(['1', 'Buy milk', 'Get 2% milk', '2', '6'])
    monkeypatch.setattr('builtins.input', lambda _: next(inputs))

    main()

    captured = capsys.readouterr()
    assert "Task added" in captured.out
    assert "Buy milk" in captured.out
```

---

## Summary

All research questions resolved. Decisions align with Phase-1 Constitution requirements:

✅ **Article II Compliance**: No forbidden technologies (stdlib only, no databases/web/async)
✅ **Article III Compliance**: Single-process, synchronous, in-memory, deterministic
✅ **Article VIII Compliance**: Simple patterns, no magic, readable code

**Key Technologies Confirmed**:
- Python 3.13+ with stdlib only (no external packages for core functionality)
- UV for package management
- pytest for testing (dev dependency only)
- Dict-based in-memory storage
- Dataclass for Task model
- Separate validation module

**Ready for Phase 1** (data-model.md, quickstart.md generation).

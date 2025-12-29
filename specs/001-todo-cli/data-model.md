# Data Model: Todo In-Memory Python Console App

**Date**: 2025-12-29
**Feature**: 001-todo-cli
**Phase**: Phase 1 (Design)

## Entities

### Task

**Description**: Represents a single todo item with tracking information.

**Attributes**:

| Attribute | Type | Required | Default | Constraints | Description |
|-----------|------|----------|---------|-------------|-------------|
| `id` | int | Yes | Auto-generated | > 0, unique, sequential | Primary identifier |
| `title` | str | Yes | None | 1-200 characters | Task title/summary |
| `description` | str | No | "" | 0-1000 characters | Detailed task description |
| `completed` | bool | Yes | False | N/A | Completion status |
| `created_at` | datetime | Yes | Auto-generated | N/A | Timestamp of task creation |

**Implementation** (Python dataclass):
```python
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass
class Task:
    """Represents a todo task.

    Task: T-004
    Spec: FR-002, FR-003 (Add task, Auto-assign IDs)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.now)

    def __str__(self) -> str:
        """Format task for display.

        Task: T-010
        Spec: FR-004 (View tasks with status indicators)
        """
        status = "[✓]" if self.completed else "[ ]"
        return f"ID: {self.id} {status} {self.title}\nDescription: {self.description}"

    def toggle_completion(self) -> None:
        """Toggle task completion status.

        Task: T-005
        Spec: FR-005 (Mark complete/incomplete)
        """
        self.completed = not self.completed

    def update(self, title: Optional[str] = None, description: Optional[str] = None) -> None:
        """Update task fields.

        Task: T-005
        Spec: FR-006 (Update task)
        """
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
```

**Lifecycle States**:
1. **Created**: Task instantiated with `completed=False`
2. **Active**: Task exists in TaskManager.tasks dictionary
3. **Completed**: Task marked with `completed=True` (can be toggled back)
4. **Deleted**: Task removed from TaskManager.tasks dictionary (permanent)

**Relationships**: None (single entity model)

---

## State Management

### TaskManager

**Description**: Manages the collection of tasks and provides CRUD operations.

**State**:

| Attribute | Type | Description |
|-----------|------|-------------|
| `tasks` | Dict[int, Task] | Dictionary mapping task ID to Task object |
| `next_id` | int | Counter for sequential ID generation |

**Implementation**:
```python
from typing import Dict, List, Optional

class TaskManager:
    """Manages task collection and operations.

    Task: T-005
    Spec: FR-008 (In-memory storage)
    """

    def __init__(self):
        """Initialize empty task manager.

        Task: T-005
        Spec: FR-008
        """
        self.tasks: Dict[int, Task] = {}
        self.next_id: int = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """Add a new task.

        Task: T-005
        Spec: FR-002, FR-003 (Add task, Auto-assign IDs)

        Args:
            title: Task title (validated before this call)
            description: Task description (validated before this call)

        Returns:
            Newly created Task object
        """
        task = Task(
            id=self.next_id,
            title=title,
            description=description
        )
        self.tasks[self.next_id] = task
        self.next_id += 1
        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """Retrieve task by ID.

        Task: T-005
        Spec: FR-004 (View tasks)

        Args:
            task_id: Task ID to retrieve

        Returns:
            Task object if found, None otherwise
        """
        return self.tasks.get(task_id)

    def get_all_tasks(self) -> List[Task]:
        """Retrieve all tasks ordered by ID.

        Task: T-005
        Spec: FR-004 (View all tasks)

        Returns:
            List of Task objects sorted by ID
        """
        return sorted(self.tasks.values(), key=lambda t: t.id)

    def update_task(self, task_id: int, title: Optional[str] = None,
                    description: Optional[str] = None) -> bool:
        """Update an existing task.

        Task: T-005
        Spec: FR-006 (Update task)

        Args:
            task_id: ID of task to update
            title: New title (or None to keep current)
            description: New description (or None to keep current)

        Returns:
            True if task found and updated, False otherwise
        """
        task = self.get_task(task_id)
        if task is None:
            return False
        task.update(title=title, description=description)
        return True

    def delete_task(self, task_id: int) -> bool:
        """Delete a task.

        Task: T-005
        Spec: FR-007 (Delete task)

        Args:
            task_id: ID of task to delete

        Returns:
            True if task found and deleted, False otherwise
        """
        if task_id in self.tasks:
            del self.tasks[task_id]
            return True
        return False

    def toggle_completion(self, task_id: int) -> bool:
        """Toggle task completion status.

        Task: T-005
        Spec: FR-005 (Mark complete/incomplete)

        Args:
            task_id: ID of task to toggle

        Returns:
            True if task found and toggled, False otherwise
        """
        task = self.get_task(task_id)
        if task is None:
            return False
        task.toggle_completion()
        return True

    def count(self) -> int:
        """Return total number of tasks.

        Task: T-005
        Spec: FR-013 (Handle empty list)

        Returns:
            Number of tasks in collection
        """
        return len(self.tasks)
```

---

## Data Validation Rules

All validation occurs **before** TaskManager operations via InputValidator module.

### Title Validation

| Rule | Constraint | Error Message |
|------|------------|---------------|
| Not empty | len(title) >= 1 | "Title cannot be empty. Please enter at least 1 character." |
| Max length | len(title) <= 200 | "Title truncated to 200 characters." (warning, auto-truncate) |

### Description Validation

| Rule | Constraint | Error Message |
|------|------------|---------------|
| Optional | len(description) >= 0 | N/A (empty description accepted) |
| Max length | len(description) <= 1000 | "Description truncated to 1000 characters." (warning, auto-truncate) |

### Task ID Validation

| Rule | Constraint | Error Message |
|------|------------|---------------|
| Numeric | int(id_str) succeeds | "Invalid input. Please enter a numeric task ID." |
| Positive | id > 0 | "Task ID must be positive." |
| Exists | id in task_manager.tasks | "Task not found." |

---

## Memory Constraints

**Phase-1 Target**: Support 100 tasks without degradation (per SC-006)

**Estimated Memory per Task**:
- Task object: ~200 bytes (id, title, description, completed, created_at)
- TaskManager overhead: ~50 bytes per entry (dict entry)
- **Total per task**: ~250 bytes

**For 100 tasks**: ~25 KB (well within <50MB process limit)

**For 1000 tasks**: ~250 KB (still negligible)

**Conclusion**: Memory is not a constraint for Phase-1. Dict-based storage is efficient.

---

## Data Flow

```
User Input (stdin)
    ↓
InputValidator (validate, truncate, convert)
    ↓
TaskManager (CRUD operations)
    ↓
Task objects (in-memory dict)
    ↓
Formatter (format for display)
    ↓
Output (stdout)
```

**No persistence layer** - all data lost on application exit per FR-017 and SC-008.

---

## Traceability

| Data Entity | Spec Requirements | Implementation Module |
|-------------|-------------------|----------------------|
| Task | FR-002, FR-003, FR-004 | models/task.py |
| TaskManager | FR-005, FR-006, FR-007, FR-008 | services/task_manager.py |
| Validation rules | FR-009, FR-014, FR-015 | validators/input_validator.py |
| Display format | FR-004, SC-002 ([✓]/[ ]) | ui/formatter.py |

---

## Design Decisions

1. **Dataclass over regular class**: Built-in, type-safe, less boilerplate
2. **Dict over list**: O(1) lookup by ID (vs O(n) linear search)
3. **Sequential IDs**: Simple, deterministic, no UUID overhead
4. **No deletion flags**: Permanent deletion (no "soft delete") - simplicity
5. **In-memory only**: Per Constitution Article II (no databases/files)
6. **Validation before creation**: Fail fast, no invalid Tasks in memory

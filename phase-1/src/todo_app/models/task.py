# Task: T006, T015, T023, T029
# Spec: FR-002 (Add Task), FR-003 (Auto-assign IDs), FR-004 (View tasks), FR-005 (Mark complete), FR-006 (Update task)

"""Task model for todo application.

This module defines the Task dataclass representing a single todo item.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Task:
    """Represents a todo task.

    Task: T006
    Spec: FR-002, FR-003 (Add task, Auto-assign IDs)

    Attributes:
        id: Unique numeric identifier (auto-generated, sequential)
        title: Task title (1-200 characters)
        description: Task description (0-1000 characters, optional)
        completed: Completion status (default: False)
        created_at: Timestamp of task creation
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.now)

    def __str__(self) -> str:
        """Format task for display.

        Task: T015
        Spec: FR-004 (View tasks with status indicators)

        Returns:
            Formatted string with ID, status symbol ([✓] or [ ]), title, and description
        """
        status = "[✓]" if self.completed else "[ ]"
        return f"ID: {self.id} {status} {self.title}\nDescription: {self.description}"

    def toggle_completion(self) -> None:
        """Toggle task completion status.

        Task: T023
        Spec: FR-005 (Mark complete/incomplete)
        """
        self.completed = not self.completed

    def update(self, title: Optional[str] = None, description: Optional[str] = None) -> None:
        """Update task fields.

        Task: T029
        Spec: FR-006 (Update task)

        Args:
            title: New title (or None to keep current)
            description: New description (or None to keep current)
        """
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description

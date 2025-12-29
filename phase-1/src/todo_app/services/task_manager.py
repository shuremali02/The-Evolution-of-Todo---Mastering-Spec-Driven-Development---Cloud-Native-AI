# Task: T007, T012, T013, T014, T024, T025, T030, T034
# Spec: FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-013

"""Task manager service for CRUD operations.

This module provides the TaskManager class for managing task collections.
"""

from typing import Dict, List, Optional
from ..models.task import Task


class TaskManager:
    """Manages task collection and operations.

    Task: T007
    Spec: FR-008 (In-memory storage)

    Attributes:
        tasks: Dictionary mapping task ID to Task object
        next_id: Counter for sequential ID generation
    """

    def __init__(self):
        """Initialize empty task manager.

        Task: T007
        Spec: FR-008
        """
        self.tasks: Dict[int, Task] = {}
        self.next_id: int = 1

    def add_task(self, title: str, description: str = "") -> Task:
        """Add a new task.

        Task: T012
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

        Task: T024
        Spec: FR-004 (View tasks)

        Args:
            task_id: Task ID to retrieve

        Returns:
            Task object if found, None otherwise
        """
        return self.tasks.get(task_id)

    def get_all_tasks(self) -> List[Task]:
        """Retrieve all tasks ordered by ID.

        Task: T013
        Spec: FR-004 (View all tasks)

        Returns:
            List of Task objects sorted by ID
        """
        return sorted(self.tasks.values(), key=lambda t: t.id)

    def count(self) -> int:
        """Return total number of tasks.

        Task: T014
        Spec: FR-013 (Handle empty list)

        Returns:
            Number of tasks in collection
        """
        return len(self.tasks)

    def toggle_completion(self, task_id: int) -> bool:
        """Toggle task completion status.

        Task: T025
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

    def update_task(self, task_id: int, title: Optional[str] = None,
                    description: Optional[str] = None) -> bool:
        """Update an existing task.

        Task: T030
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

        Task: T034
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

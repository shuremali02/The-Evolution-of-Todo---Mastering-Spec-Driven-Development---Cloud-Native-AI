# Task: T016
# Spec: FR-004 (View tasks with status indicators), FR-013 (Handle empty list)

"""Output formatting module for displaying tasks.

This module provides formatting functions for task display.
"""

from typing import List
from ..models.task import Task


class Formatter:
    """Formats tasks for display.

    Task: T016
    Spec: FR-004 (View tasks with [✓]/[ ] symbols)
    """

    @staticmethod
    def format_task_list(tasks: List[Task]) -> str:
        """Format a list of tasks for display.

        Task: T016
        Spec: FR-004 (View all tasks with status indicators)

        Args:
            tasks: List of Task objects to format

        Returns:
            Formatted string with all tasks, or empty list message
        """
        if not tasks:
            return "No tasks found. Add your first task to get started!"

        header = "\n" + "=" * 40 + "\n"
        header += " " * 12 + "ALL TASKS\n"
        header += "=" * 40 + "\n\n"

        # Format each task using Task.__str__()
        task_strings = [str(task) for task in tasks]
        task_output = "\n\n".join(task_strings)

        footer = f"\n\nTotal tasks: {len(tasks)}"

        return header + task_output + footer

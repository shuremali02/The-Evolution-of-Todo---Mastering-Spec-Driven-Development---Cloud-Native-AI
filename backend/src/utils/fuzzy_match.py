"""
Task: T055, T056, T057, T058
Spec: 011-chatbot-issues-fixes/spec.md - Fuzzy Matching Utilities

Utility functions for fuzzy string matching to handle variations in task names.
"""

from typing import List, Tuple, Optional
from rapidfuzz import fuzz
from app.models.task import Task


def find_closest_task_match(task_name: str, tasks: List[Task], threshold: float = 0.8) -> Optional[Tuple[Task, float]]:
    """
    Find the closest matching task name from a list of tasks using fuzzy matching.

    Args:
        task_name: The name to match against
        tasks: List of tasks to search through
        threshold: Minimum similarity score (0.0-1.0) required for a match

    Returns:
        Tuple of (matching_task, similarity_score) if found, None otherwise
    """
    best_match = None
    best_score = 0

    for task in tasks:
        # Try matching against both title and description if available
        title_score = fuzz.ratio(task_name.lower(), task.title.lower()) / 100.0
        desc_score = 0
        if task.description:
            desc_score = fuzz.ratio(task_name.lower(), task.description.lower()) / 100.0

        # Use the highest score between title and description
        max_score = max(title_score, desc_score)

        if max_score > best_score and max_score >= threshold:
            best_score = max_score
            best_match = (task, max_score)

    return best_match


def fuzzy_match_task_by_name(task_name: str, tasks: List[Task]) -> Optional[Task]:
    """
    Find a task by name using fuzzy matching.

    Args:
        task_name: The name to match against
        tasks: List of tasks to search through

    Returns:
        Matching task if found, None otherwise
    """
    match = find_closest_task_match(task_name, tasks)
    return match[0] if match else None
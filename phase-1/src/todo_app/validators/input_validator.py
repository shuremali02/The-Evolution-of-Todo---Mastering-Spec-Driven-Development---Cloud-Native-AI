# Task: T008, T009, T010, T011
# Spec: FR-009 (Input validation), FR-014 (Title limits), FR-015 (Description limits)

"""Input validation module for user inputs.

This module provides validation functions for task-related user inputs.
"""

from typing import Optional, Tuple


# Task: T011
# Spec: FR-009, FR-011 (Validation and error messages)
ERROR_MESSAGES = {
    "empty_title": "Title cannot be empty. Please enter at least 1 character.",
    "title_truncated": "Title truncated to 200 characters.",
    "description_truncated": "Description truncated to 1000 characters.",
    "invalid_id": "Invalid input. Please enter a numeric task ID.",
    "negative_id": "Task ID must be positive.",
    "task_not_found": "Task not found.",
    "no_changes": "No changes provided. Please enter a new title or description.",
    "invalid_choice": "Invalid choice. Please enter a number between 1 and 6."
}


class InputValidator:
    """Validates user input for task operations.

    Task: T008
    Spec: FR-009 (Input validation and error messages)
    """

    @staticmethod
    def validate_title(title: str) -> Tuple[str, Optional[str]]:
        """Validate and clean title input.

        Task: T008
        Spec: FR-014 (Title length limits)

        Args:
            title: Raw title input from user

        Returns:
            Tuple of (cleaned_value, error_message)
            - cleaned_value: Truncated/cleaned title string
            - error_message: Error message if validation fails, None if success
        """
        # Check for empty title
        if not title or len(title.strip()) == 0:
            return "", ERROR_MESSAGES["empty_title"]

        title = title.strip()

        # Truncate if too long
        if len(title) > 200:
            return title[:200], ERROR_MESSAGES["title_truncated"]

        return title, None

    @staticmethod
    def validate_description(description: str) -> Tuple[str, Optional[str]]:
        """Validate and clean description input.

        Task: T009
        Spec: FR-015 (Description length limits)

        Args:
            description: Raw description input from user

        Returns:
            Tuple of (cleaned_value, warning_message)
            - cleaned_value: Truncated/cleaned description string
            - warning_message: Warning message if truncated, None otherwise
        """
        description = description.strip()

        # Truncate if too long
        if len(description) > 1000:
            return description[:1000], ERROR_MESSAGES["description_truncated"]

        return description, None

    @staticmethod
    def validate_task_id(id_str: str) -> Tuple[Optional[int], Optional[str]]:
        """Validate task ID input.

        Task: T010
        Spec: FR-009 (Input validation)

        Args:
            id_str: Raw task ID string from user

        Returns:
            Tuple of (task_id, error_message)
            - task_id: Integer ID if valid, None otherwise
            - error_message: Error message if validation fails, None if success
        """
        # Check if numeric
        try:
            task_id = int(id_str.strip())
        except ValueError:
            return None, ERROR_MESSAGES["invalid_id"]

        # Check if positive
        if task_id <= 0:
            return None, ERROR_MESSAGES["negative_id"]

        return task_id, None

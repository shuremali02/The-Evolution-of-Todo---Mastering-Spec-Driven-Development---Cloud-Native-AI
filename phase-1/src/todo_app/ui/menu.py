# Task: T017, T018, T019, T021, T022, T026, T028, T031, T033, T035, T037, T038, T039
# Spec: FR-001 (Interactive menu), FR-002 (Add task), FR-004 (View tasks), FR-009 (Validation)

"""Menu interface module for CLI interaction.

This module provides functions for displaying menus and handling user input.
"""

from typing import Optional
from ..services.task_manager import TaskManager
from ..validators.input_validator import InputValidator, ERROR_MESSAGES
from .formatter import Formatter


def display_menu() -> None:
    """Display the main menu.

    Task: T017, T038
    Spec: FR-001 (Interactive menu with numbered options)
    """
    print("\n" + "=" * 40)
    print(" " * 9 + "TODO CLI APPLICATION")
    print("=" * 40)
    print("\n1) Add Task")
    print("2) View All Tasks")
    print("3) Update Task")
    print("4) Delete Task")
    print("5) Mark Task Complete/Incomplete")
    print("6) Exit")
    print()


def handle_add_task(task_manager: TaskManager) -> None:
    """Handle adding a new task.

    Task: T018, T021, T022
    Spec: FR-002 (Add task with title and description), FR-009 (Input validation), FR-010 (Confirmation)

    Args:
        task_manager: TaskManager instance
    """
    # Get and validate title
    title_input = input("Enter task title: ")
    title, error = InputValidator.validate_title(title_input)

    if error:
        print(f"✗ {error}")
        return

    # Get and validate description
    desc_input = input("Enter task description (optional): ")
    description, warning = InputValidator.validate_description(desc_input)

    if warning:
        print(f"⚠ {warning}")

    # Add task
    task = task_manager.add_task(title, description)
    print(f"✓ Task added successfully! (ID: {task.id})")


def handle_view_tasks(task_manager: TaskManager) -> None:
    """Handle viewing all tasks.

    Task: T019
    Spec: FR-004 (View all tasks), FR-013 (Handle empty list)

    Args:
        task_manager: TaskManager instance
    """
    tasks = task_manager.get_all_tasks()
    output = Formatter.format_task_list(tasks)
    print(output)


def handle_toggle_completion(task_manager: TaskManager) -> None:
    """Handle marking a task as complete or incomplete.

    Task: T026, T028
    Spec: FR-005 (Mark complete/incomplete), FR-009 (Validation), FR-011 (Error messages)

    Args:
        task_manager: TaskManager instance
    """
    id_input = input("Enter task ID: ")
    task_id, error = InputValidator.validate_task_id(id_input)

    if error:
        print(f"✗ {error}")
        return

    # Check if task exists
    task = task_manager.get_task(task_id)
    if task is None:
        print(f"✗ {ERROR_MESSAGES['task_not_found']}")
        return

    # Toggle completion
    success = task_manager.toggle_completion(task_id)
    if success:
        status = "complete" if task.completed else "incomplete"
        print(f"✓ Task {task_id} marked as {status}.")
    else:
        print(f"✗ {ERROR_MESSAGES['task_not_found']}")


def handle_update_task(task_manager: TaskManager) -> None:
    """Handle updating a task's title and/or description.

    Task: T031, T033
    Spec: FR-006 (Update task), FR-009 (Validation), FR-011 (Error messages)

    Args:
        task_manager: TaskManager instance
    """
    id_input = input("Enter task ID: ")
    task_id, error = InputValidator.validate_task_id(id_input)

    if error:
        print(f"✗ {error}")
        return

    # Check if task exists
    task = task_manager.get_task(task_id)
    if task is None:
        print(f"✗ {ERROR_MESSAGES['task_not_found']}")
        return

    # Get new title (optional)
    title_input = input("Enter new title (or press Enter to skip): ")
    new_title: Optional[str] = None
    title_warning: Optional[str] = None

    if title_input.strip():
        new_title, title_error = InputValidator.validate_title(title_input)
        if title_error and "empty" not in title_error:
            # Truncation warning
            title_warning = title_error
        elif title_error:
            # Empty title error
            print(f"✗ {title_error}")
            return

    # Get new description (optional)
    desc_input = input("Enter new description (or press Enter to skip): ")
    new_desc: Optional[str] = None
    desc_warning: Optional[str] = None

    if desc_input.strip():
        new_desc, desc_warning = InputValidator.validate_description(desc_input)

    # Check if at least one field provided
    if new_title is None and new_desc is None:
        print(f"✗ {ERROR_MESSAGES['no_changes']}")
        return

    # Print warnings
    if title_warning:
        print(f"⚠ {title_warning}")
    if desc_warning:
        print(f"⚠ {desc_warning}")

    # Update task
    success = task_manager.update_task(task_id, title=new_title, description=new_desc)
    if success:
        print(f"✓ Task {task_id} updated successfully.")
    else:
        print(f"✗ {ERROR_MESSAGES['task_not_found']}")


def handle_delete_task(task_manager: TaskManager) -> None:
    """Handle deleting a task.

    Task: T035, T037
    Spec: FR-007 (Delete task), FR-009 (Validation), FR-011 (Error messages)

    Args:
        task_manager: TaskManager instance
    """
    id_input = input("Enter task ID: ")
    task_id, error = InputValidator.validate_task_id(id_input)

    if error:
        print(f"✗ {error}")
        return

    # Check if task exists
    task = task_manager.get_task(task_id)
    if task is None:
        print(f"✗ {ERROR_MESSAGES['task_not_found']}")
        return

    # Delete task
    success = task_manager.delete_task(task_id)
    if success:
        print(f"✓ Task {task_id} deleted successfully.")
    else:
        print(f"✗ {ERROR_MESSAGES['task_not_found']}")


def handle_invalid_choice() -> None:
    """Handle invalid menu choice.

    Task: T039
    Spec: FR-009 (Input validation), FR-011 (Error messages)
    """
    print(f"✗ {ERROR_MESSAGES['invalid_choice']}")

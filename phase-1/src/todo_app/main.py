# Task: T020, T027, T032, T036, T040, T041, T042
# Spec: FR-001 (Interactive menu), FR-012 (Clean exit), FR-016 (Single-process)

"""Main entry point for todo CLI application.

This module contains the main event loop and application lifecycle.
"""

import sys
from .services.task_manager import TaskManager
from .ui.menu import (
    display_menu,
    handle_add_task,
    handle_view_tasks,
    handle_toggle_completion,
    handle_update_task,
    handle_delete_task,
    handle_invalid_choice
)


def main() -> None:
    """Main application loop.

    Task: T020, T027, T032, T036, T040, T041, T042
    Spec: FR-001 (Interactive menu), FR-012 (Clean exit), FR-016 (Single-process)
    """
    # Initialize task manager
    task_manager = TaskManager()

    try:
        while True:
            display_menu()

            try:
                choice = input("Enter choice (1-6): ")

                if choice == '1':
                    # Task: T020 - Add task
                    handle_add_task(task_manager)
                elif choice == '2':
                    # Task: T020 - View tasks
                    handle_view_tasks(task_manager)
                elif choice == '3':
                    # Task: T032 - Update task
                    handle_update_task(task_manager)
                elif choice == '4':
                    # Task: T036 - Delete task
                    handle_delete_task(task_manager)
                elif choice == '5':
                    # Task: T027 - Mark complete/incomplete
                    handle_toggle_completion(task_manager)
                elif choice == '6':
                    # Task: T041 - Exit with goodbye message
                    print("Goodbye! All tasks will be lost.")
                    sys.exit(0)
                else:
                    # Task: T040 - Handle invalid choice
                    handle_invalid_choice()

            except ValueError:
                # Task: T040 - Handle invalid input
                handle_invalid_choice()

    except KeyboardInterrupt:
        # Task: T042 - Handle Ctrl+C gracefully
        print("\nGoodbye! All tasks will be lost.")
        sys.exit(130)  # Standard SIGINT exit code


if __name__ == "__main__":
    main()

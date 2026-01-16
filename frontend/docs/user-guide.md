# User Guide: New Interaction Patterns

This guide describes the new interaction patterns introduced in the Phase 1 UI Enhancements.

## Drag-and-Drop Task Reordering

### How to Reorder Tasks
1. Locate the grip icon (☰) on the left side of any task card
2. Click and hold the grip icon to pick up the task
3. Drag the task to its new position in the list
4. Release the mouse button to drop the task in the new position

### Keyboard Navigation for Reordering
1. Tab to the grip icon on a task card
2. Press `Space` to grab the task
3. Use `Arrow Up` or `Arrow Down` to move the task
4. Press `Enter` to drop the task in the new position
5. Press `Escape` to cancel the drag operation

## Calendar View

### Switching Views
- Click the "Calendar" button to switch from list view to calendar view
- Click the "List" button to switch from calendar view to list view

### Navigating the Calendar
- Use the Previous/Next month buttons to navigate between months
- Click on any date to select it
- Click the "Today" button to jump to the current month

### Keyboard Shortcuts for Calendar
- `Ctrl + Left Arrow`: Navigate to the previous month
- `Ctrl + Right Arrow`: Navigate to the next month
- `Ctrl + T`: Navigate to the current month

### Viewing Tasks in Calendar
- Tasks with due dates appear as colored bars in the calendar
- Different colors represent different priorities:
  - Red: High priority
  - Yellow: Medium priority
  - Green: Low priority

### Creating Tasks from Calendar
- Click the "+" button on any date to create a new task for that date
- This will open the task creation form with the selected date pre-filled

## Enhanced Animations

### Task Interactions
- Task cards now have smooth entrance animations when loaded
- Hover effects provide visual feedback for interactive elements
- Completion and deletion operations have subtle animations
- Page transitions are smoother when navigating

### Reduced Motion Support
- All animations respect the user's "prefers reduced motion" system setting
- Animations will be automatically disabled if the user has this preference enabled

## Accessibility Improvements

### Focus Indicators
- All interactive elements now have clear focus indicators
- Focus indicators are visible when navigating with keyboard
- Visual feedback is provided for all interactive elements

### Screen Reader Support
- Drag-and-drop operations provide audio feedback
- Calendar navigation includes proper announcements
- All new components have appropriate ARIA labels and roles
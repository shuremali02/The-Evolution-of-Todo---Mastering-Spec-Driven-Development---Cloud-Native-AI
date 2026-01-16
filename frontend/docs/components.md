# Component Documentation

This document describes the UI components added as part of the Phase 1 UI Enhancements.

## Drag-and-Drop Components

### TaskCardDnD
A draggable task card component that supports drag-and-drop reordering.

#### Props
- `task`: Task object to display
- `index`: Index of the task in the list
- `totalItems`: Total number of items in the list
- `onComplete`: Callback when task is marked complete
- `onDelete`: Callback when task is deleted
- `onEdit`: Callback when task is edited
- `onMove`: Callback when task is moved to a new position

#### Features
- Drag handle with ARIA labels
- Keyboard navigation support
- Visual feedback during drag operations
- Screen reader announcements

### TaskListDnD
A list container that manages drag-and-drop reordering of TaskCardDnD components.

#### Props
- `tasks`: Array of task objects
- `onTaskComplete`: Callback when task is completed
- `onTaskDelete`: Callback when task is deleted
- `onTaskEdit`: Callback when task is edited
- `onTaskReorder`: Callback when tasks are reordered

## Calendar Components

### CalendarView
A calendar view that displays tasks by date.

#### Props
- `tasks`: Array of task objects with due dates
- `onTaskSelect`: Callback when a task is selected
- `onDateSelect`: Callback when a date is selected
- `onTaskCreate`: Callback to create a task for a specific date
- `selectedDate`: Currently selected date

#### Features
- Month navigation
- Date selection
- Task display by date
- Keyboard navigation support

### CalendarDay
A single day in the calendar view.

#### Props
- `date`: Date to display
- `tasks`: Array of tasks for this date
- `isSelected`: Whether this date is selected
- `isCurrentMonth`: Whether this date is in the current month
- `onClick`: Callback when the day is clicked
- `onTaskSelect`: Callback when a task is selected
- `onTaskCreate`: Callback to create a task for this date

### CalendarEventItem
A single task event displayed in the calendar.

#### Props
- `task`: Task object to display
- `onClick`: Callback when the event is clicked

## Animation Components

### AnimatedButton
An animated button component with hover and click effects.

#### Props
- `children`: Button content
- `variant`: Button style variant (primary, secondary, danger, ghost)
- `size`: Button size (sm, md, lg)
- `isLoading`: Whether the button is in loading state
- `icon`: Icon to display
- `fullWidth`: Whether to take full width
- `className`: Additional CSS classes

### Other Animated Components
- `AnimatedDiv`: Animated div container
- `AnimatedList`: Animated list with staggered items
- `AnimatedListItem`: Individual animated list item
- `FadeIn`: Fade-in animation
- `SlideIn`: Slide-in animation

## Accessibility Utilities

### Hooks
- `useReducedMotion`: Detects if user prefers reduced motion
- `useFocusTrap`: Manages focus trapping for modals
- `useAriaAnnouncer`: Provides screen reader announcements
- `useKeyboardNavigation`: Manages keyboard navigation

### Functions
- `getAnimationStyles`: Conditionally applies animation styles
- `getDragDropAriaAttributes`: Generates ARIA attributes for drag-and-drop
- `getDragDropAriaDescription`: Generates ARIA descriptions for drag-and-drop
# Accessibility Guide

This document outlines the keyboard navigation patterns and accessibility features implemented in the Todo application.

## Keyboard Navigation

### Task List View
- **Ctrl+N**: Create a new task
- **Escape**: Close any open forms or dialogs
- **Space/Enter**: Mark a task as complete/incomplete
- **Tab**: Navigate between interactive elements
- **Shift+Tab**: Navigate backwards between interactive elements

### Drag-and-Drop Task Reordering
- **Space** (on drag handle): Grab a task to start dragging
- **Arrow keys** (while dragging): Move the task up/down in the list
- **Enter** (while dragging): Drop the task in the new position
- **Escape** (while dragging): Cancel the drag operation

### Calendar View
- **Ctrl+Left Arrow**: Navigate to the previous month
- **Ctrl+Right Arrow**: Navigate to the next month
- **Ctrl+T**: Navigate to the current month
- **Tab**: Navigate between dates and interactive elements
- **Click/Enter**: Select a date or task

## ARIA Labels and Roles

### Drag-and-Drop Components
- Each task card has `role="listitem"` for proper list semantics
- Drag handles include `aria-grabbed`, `aria-setsize`, and `aria-posinset` attributes
- Screen reader announcements are provided during drag operations
- Keyboard instruction descriptions are available for screen reader users

### Calendar Components
- Calendar grid uses `grid` and `gridcell` roles for proper table semantics
- Dates are announced with proper context
- Tasks on dates are announced with priority information

## Focus Management

- All interactive elements receive visible focus indicators
- Focus is managed properly during modal dialogs and dynamic content updates
- Keyboard focus is trapped within modal dialogs
- Focus returns to the triggering element after closing dialogs

## Reduced Motion Support

- The application respects the `prefers-reduced-motion` media query
- Animations are automatically disabled for users who prefer reduced motion
- Transitions are kept minimal and purposeful

## Color Contrast

- All text elements meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have sufficient contrast in all states (normal, hover, focus, active)
- Color is not used as the sole means of conveying information

## Testing

To test accessibility features:
1. Navigate the application using only the keyboard
2. Use a screen reader (like NVDA or VoiceOver) to verify announcements
3. Test with reduced motion enabled
4. Verify focus indicators are visible
5. Check color contrast ratios using developer tools
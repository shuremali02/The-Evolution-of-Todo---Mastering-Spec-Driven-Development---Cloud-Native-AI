# Data Model: Dashboard Fixes

## Task Model Extensions

### Reminder Field
- **Field Name**: `reminder`
- **Type**: `DateTime | null`
- **Default**: `null`
- **Validation**: If provided, must be a future date/time
- **Relationships**: Belongs to Task entity
- **Purpose**: Stores scheduled reminder time for the task

### Priority Distribution
- **Field Name**: `priority_distribution`
- **Type**: `Object`
- **Structure**: `{low: number, medium: number, high: number}`
- **Purpose**: Stores breakdown of task priorities for dashboard display

## Dashboard Response Model

### DashboardResponse
- **Fields**:
  - `stats`: `DashboardStats` - Overall statistics
  - `recent_activity`: `Array<RecentActivityItem>` - Recent user activity
  - `upcoming_deadlines`: `Array<UpcomingDeadlineItem>` - Upcoming task deadlines
  - `priority_distribution`: `Object` - Breakdown of task priorities

### DashboardStats
- **Fields**:
  - `total_tasks`: `number` - Total number of tasks
  - `completed_tasks`: `number` - Number of completed tasks
  - `pending_tasks`: `number` - Number of pending tasks
  - `overdue_tasks`: `number` - Number of overdue tasks
  - `tasks_due_today`: `number` - Number of tasks due today
  - `tasks_completed_today`: `number` - Number of tasks completed today
  - `tasks_completed_week`: `number` - Number of tasks completed this week
  - `tasks_completed_last_week`: `number` - Number of tasks completed last week
  - `streak_days`: `number` - Current completion streak
  - `average_completion_time`: `number` - Average time to complete tasks
  - `high_priority_tasks`: `number` - Number of high priority tasks
  - `medium_priority_tasks`: `number` - Number of medium priority tasks
  - `low_priority_tasks`: `number` - Number of low priority tasks

## Activity Item Models

### RecentActivityItem
- **Fields**:
  - `id`: `string` - Unique identifier
  - `type`: `string` - Activity type (task_created, task_completed, etc.)
  - `task_id`: `string` - Associated task ID
  - `task_title`: `string` - Title of associated task
  - `priority`: `string` - Priority level
  - `timestamp`: `string` - ISO date string
  - `description`: `string` - Human-readable description

### UpcomingDeadlineItem
- **Fields**:
  - `id`: `string` - Unique identifier
  - `task_id`: `string` - Associated task ID
  - `title`: `string` - Task title
  - `priority`: `string` - Priority level
  - `due_date`: `string` - ISO date string
  - `days_until_due`: `number` - Days until deadline
  - `is_overdue`: `boolean` - Whether task is overdue

## UI State Models

### QuickTaskFormData
- **Fields**:
  - `title`: `string` - Task title (required)
  - `description`: `string` - Task description (optional)
  - `priority`: `string` - Priority level (low, medium, high)
  - `due_date`: `string | null` - Due date (optional)
  - `reminder`: `string | null` - Reminder time (optional)

## Validation Rules

### Task Creation
- Title must be 1-200 characters
- Description must be 0-1000 characters if provided
- Priority must be one of 'low', 'medium', 'high'
- Due date must be a valid future date if provided
- Reminder must be a valid future datetime if provided

### Dashboard Stats Calculation
- Total tasks = completed_tasks + pending_tasks
- Pending tasks = total_tasks - completed_tasks
- Overdue tasks are pending tasks with past due dates
- Tasks due today are pending tasks with due_date = today
- Completion streak is calculated based on consecutive days with completed tasks

## State Transitions

### Task State Changes
- `active` → `completed` when task is marked complete
- `completed` → `active` when task completion is undone
- `created` → `active` when task is initially saved

### Reminder State
- `none` → `scheduled` when reminder is set
- `scheduled` → `triggered` when reminder time is reached
- `triggered` → `acknowledged` when user acknowledges reminder
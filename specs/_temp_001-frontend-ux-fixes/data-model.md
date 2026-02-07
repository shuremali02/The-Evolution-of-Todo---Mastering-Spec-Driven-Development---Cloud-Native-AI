# Data Model: Frontend UX Issues Fix

## Overview

This data model describes the state and data structures needed for the UX improvements.

## State Management

### Loading State
```typescript
interface LoadingState {
  isLoading: boolean;
  operation: string; // Description of the operation in progress
  progress?: number; // Optional progress percentage (0-100)
  timestamp: Date; // When the loading started
}
```

### Validation State
```typescript
interface ValidationError {
  field: string; // Field name that has error
  message: string; // Error message to display
  severity: 'error' | 'warning'; // Severity level
}

interface ValidationState {
  errors: ValidationError[];
  isValid: boolean;
  lastValidated: Date; // Timestamp of last validation
}
```

### Search State
```typescript
interface SearchQuery {
  term: string; // Search term entered by user
  filters: {
    status?: string; // Filter by task status
    priority?: string; // Filter by priority
    dateRange?: { start: Date; end: Date }; // Filter by date range
  };
  timestamp: Date; // When search was performed
}

interface SearchResult {
  items: any[]; // Array of search results
  totalCount: number; // Total count of matching items
  query: SearchQuery; // The query that produced these results
  tookMs: number; // Time taken to execute search
}
```

### Accessibility State
```typescript
interface AccessibilityPreferences {
  reducedMotion: boolean; // User prefers reduced motion
  highContrast: boolean; // User prefers high contrast mode
  screenReader: boolean; // User uses screen reader
  fontSize: 'small' | 'normal' | 'large' | 'larger'; // Preferred font size
}
```

## Component Props

### LoadingSpinner Props
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'; // Size of spinner
  label?: string; // Accessible label for screen readers
  variant?: 'default' | 'overlay' | 'inline'; // Style variant
}
```

### Skeleton Props
```typescript
interface SkeletonProps {
  height?: string; // Height of skeleton element
  width?: string; // Width of skeleton element
  shape?: 'rectangle' | 'circle' | 'text'; // Shape of skeleton
  animation?: boolean; // Whether to animate the skeleton
}
```

### SearchInput Props
```typescript
interface SearchInputProps {
  onSearch: (query: string) => void; // Callback when search is performed
  placeholder?: string; // Placeholder text
  debounceMs?: number; // Debounce time in milliseconds
  autoFocus?: boolean; // Whether to autofocus on mount
  loading?: boolean; // Whether search is in progress
}
```

### ValidationMessage Props
```typescript
interface ValidationMessageProps {
  message: string; // Error message to display
  severity?: 'error' | 'warning' | 'info'; // Message severity
  showIcon?: boolean; // Whether to show severity icon
  onDismiss?: () => void; // Callback when message is dismissed
}
```

## API Response Models

These extend the existing API contracts with additional fields for search functionality:

```typescript
// Search Response (extends existing task response)
interface TaskSearchResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  took_ms: number; // Time taken for search
  query: string; // The query that was executed
}

// Validation Response (for form validation endpoints)
interface ValidationResponse {
  valid: boolean;
  errors: {
    field: string;
    message: string;
    code: string; // Error code for client-side handling
  }[];
}
```

## Validation Rules

- Loading operations longer than 300ms should show indicators
- Form validation should occur on blur and submit
- Search should be debounced by 300ms
- Touch targets should be minimum 44px for mobile
- Color contrast ratios must meet WCAG 2.1 AA standards (4.5:1 for normal text)
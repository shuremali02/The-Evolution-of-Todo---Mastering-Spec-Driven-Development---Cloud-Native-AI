# Data Model: Breadcrumbs and Layout Width Fixes

**Feature**: Breadcrumbs and Layout Width Fixes
**Date**: 2026-01-17

## Entities

### Breadcrumb
**Description**: Represents a navigation segment in the hierarchical path

**Fields**:
- `label`: string - The display text for the breadcrumb segment
- `href`: string - The URL path for the breadcrumb link
- `isActive`: boolean - Whether this is the current page in the hierarchy

**Relationships**:
- Part of a breadcrumb trail/array representing the full navigation path

**Validation rules**:
- Label must be non-empty string
- Href must be valid URL path
- Only one breadcrumb in a trail should have isActive = true

### Layout Configuration
**Description**: Represents the width and positioning settings for content containers

**Fields**:
- `breakpoint`: string - The screen size breakpoint (e.g., "sm", "md", "lg", "xl", "2xl")
- `widthClass`: string - The Tailwind CSS class for width (e.g., "container", "max-w-7xl", "w-full")
- `alignment`: string - How content is aligned (e.g., "center", "left", "full")

**Relationships**:
- Applied to page layouts and components to control responsive behavior

**Validation rules**:
- breakpoint must be valid Tailwind CSS breakpoint
- widthClass must be valid Tailwind CSS width utility class
- alignment must be a valid layout value

## State Transitions

### Breadcrumb Trail
- **Initial state**: Empty or minimal trail for home page
- **Navigation**: Trail expands as user moves deeper into application hierarchy
- **Back navigation**: Trail contracts as user moves up the hierarchy
- **Direct link**: Trail updates to match the new location in hierarchy
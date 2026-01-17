# Quickstart Guide: Breadcrumbs and Layout Width Fixes

**Feature**: Breadcrumbs and Layout Width Fixes
**Date**: 2026-01-17

## Overview
This guide provides instructions for implementing breadcrumbs throughout the application and fixing layout width issues to improve user experience on larger screens.

## Prerequisites
- Node.js 18+ and npm/yarn installed
- Next.js 14+ with App Router configured
- Tailwind CSS 3.4+ configured in the project
- Understanding of the existing project structure

## Implementation Steps

### 1. Create the Breadcrumb Component
Create a reusable Breadcrumb component in `frontend/components/Breadcrumb.tsx`:

```typescript
/**
 * Task: T-XXX
 * Spec: 008-breadcrumbs-layout-fixes - Breadcrumb Component
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {item.isActive || pathname === item.href ? (
              <span className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 2. Update Page Layouts
Add the Breadcrumb component to relevant pages:

```typescript
// Example for dashboard page
import { Breadcrumb } from '@/components/Breadcrumb';

export default function DashboardPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard', isActive: true }
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      {/* Rest of the page content */}
    </div>
  );
}
```

### 3. Fix Layout Width Issues
Update layout containers to use appropriate Tailwind CSS classes:

```typescript
// In layout files, replace narrow containers with wider ones for larger screens
// Instead of: <div className="max-w-2xl mx-auto">
// Use: <div className="max-w-7xl mx-auto"> or <div className="w-full">
```

### 4. Ensure Responsive Behavior
Maintain responsive behavior for smaller screens while optimizing for larger screens:

```css
/* In globals.css or layout classes */
.container-wide {
  @apply w-full px-4 sm:px-6 lg:px-8;
}

@media (min-width: 1024px) {
  .container-wide {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

## Testing
1. Verify breadcrumbs appear on all major pages
2. Test that all breadcrumb links are clickable and navigate correctly
3. Check that layout width is improved on desktop/laptop screens
4. Ensure responsive behavior is maintained on mobile devices
5. Verify accessibility with keyboard navigation and screen readers
# Navbar Component API Contract

**Component File**: `frontend/components/Navbar.tsx`
**Spec Reference**: `specs/ui/components.md#3-navbar`
**Task**: T-004

---

## Purpose

Navigation bar for authenticated pages. Displays app title, user email (optional), and logout button.

---

## TypeScript Interface

```typescript
interface NavbarProps {
  userEmail?: string
  onLogout: () => void
}
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `userEmail` | `string` | No | `undefined` | Current user's email address. If not provided, user info is hidden. |
| `onLogout` | `() => void` | Yes | - | Called when logout button clicked. |

---

## Behavior

### Display Elements

1. **App Title**: "Todo App" (static text)
   - Left-aligned
   - Bold, larger font

2. **User Email** (optional):
   - If `userEmail` provided: Display email address
   - If `userEmail` not provided: Hide user info
   - Right-aligned
   - Gray, smaller font

3. **Logout Button**: Always visible
   - Right-aligned
   - Calls `onLogout()` when clicked
   - Label: "Logout"

### Responsive Behavior

- **Desktop (≥768px)**: Horizontal layout
  ```
  [Todo App]                      [user@email.com] [Logout]
  ```
- **Mobile (<768px)**: Vertical layout
  ```
  [Todo App]
  [user@email.com] [Logout]
  ```

### Logout Action

1. User clicks "Logout" button
2. Component calls `onLogout()`
3. Parent implementation:
   - Calls `apiClient.logout()` (clears JWT, redirects to `/login`)
   - No confirmation needed (logout is safe)

---

## Visual States

### With User

- Background: White, bottom shadow
- Title: Bold, text-xl, text-gray-900
- User email: Text-sm, text-gray-600
- Logout button: Gray-200 background, hover gray-300, text-gray-700

### Without User

- Background: White, bottom shadow
- Title: Bold, text-xl, text-gray-900
- User email: Hidden
- Logout button: Gray-200 background, hover gray-300, text-gray-700

### Hover States

- Logout button: Darker gray background (gray-300), cursor pointer
- Title and email: No hover effect (not interactive)

---

## Layout

### Desktop Layout (≥768px)

```
┌─────────────────────────────────────────────┐
│ Todo App        user@example.com  [Logout]  │
└─────────────────────────────────────────────┘
```

**Tailwind Classes**:
- Container: `bg-white shadow`
- Inner: `flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4`
- Title: `text-xl font-bold text-gray-900`
- User section: `flex items-center gap-4`
- Email: `text-sm text-gray-600`
- Logout button: `px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300`

### Mobile Layout (<768px)

```
┌─────────────────────────────────────┐
│ Todo App                            │
│ user@example.com  [Logout]          │
└─────────────────────────────────────┘
```

**Tailwind Classes** (responsive):
- Inner: `flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4`
- User section: `flex flex-col sm:flex-row items-center gap-2 sm:gap-4`

---

## Accessibility

- **Navigation**: `role="navigation"`, `aria-label="Main navigation"`
- **Logout Button**: `type="button"`, `aria-label="Logout"`
- **Semantic HTML**: Use `<header>` element
- **Focus States**: Blue ring on logout button focus
- **Screen Reader**: Title and logout button announced
- **Keyboard**: Tab to logout button, Enter to logout

---

## Usage Example

### With User Email

```typescript
'use client'

import { Navbar } from '@/components/Navbar'
import { apiClient } from '@/lib/api'

export function TasksPage() {
  // In a real app, fetch user email from JWT or /auth/me endpoint
  const userEmail = 'user@example.com'

  const handleLogout = () => {
    apiClient.logout()  // Clears JWT and redirects to /login
  }

  return (
    <div>
      <Navbar
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      {/* Page content */}
    </div>
  )
}
```

### Without User Email

```typescript
'use client'

import { Navbar } from '@/components/Navbar'
import { apiClient } from '@/lib/api'

export function TasksPage() {
  const handleLogout = () => {
    apiClient.logout()
  }

  return (
    <div>
      <Navbar
        // userEmail not provided - user info hidden
        onLogout={handleLogout}
      />
      {/* Page content */}
    </div>
  )
}
```

### Integration with AuthGuard

```typescript
'use client'

import { Navbar } from '@/components/Navbar'
import { AuthGuard } from '@/components/AuthGuard'
import { apiClient } from '@/lib/api'

export function TasksLayout({ children }: { children: React.ReactNode }) {
  const userEmail = 'user@example.com'  // Fetch from JWT

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          userEmail={userEmail}
          onLogout={() => apiClient.logout()}
        />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
```

---

## Implementation Notes

### Simple Component (Stateless)

```typescript
'use client'

import { Button } from './Button'  // Optional: Use shared Button component

interface NavbarProps {
  userEmail?: string
  onLogout: () => void
}

export function Navbar({ userEmail, onLogout }: NavbarProps) {
  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        {/* App Title */}
        <h1 className="text-xl font-bold text-gray-900">
          Todo App
        </h1>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* User Email (Optional) */}
          {userEmail && (
            <span className="text-sm text-gray-600 hidden sm:block">
              {userEmail}
            </span>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
```

---

## Future Enhancements

- **User Avatar**: Display user avatar or initials instead of email
- **User Dropdown**: Dropdown with profile link, settings, logout
- **Navigation Links**: Add links to other pages (settings, help)
- **Mobile Menu**: Hamburger menu for mobile (if more links added)
- **Theme Toggle**: Dark mode toggle button
- **Notifications**: Notification bell with badge count

---

## Testing

### Unit Tests
- Renders "Todo App" title
- Renders logout button
- Calls `onLogout()` when logout button clicked
- Renders user email when `userEmail` prop provided
- Hides user email when `userEmail` prop not provided
- Responsive layout changes on mobile breakpoint
- Logout button has correct aria-label

### Integration Tests
- Logout flow: click logout → JWT cleared → redirected to /login
- User info displays correctly when authenticated
- User info hidden when not provided

---

**Contract Version**: 1.0.0
**Last Updated**: 2026-01-01

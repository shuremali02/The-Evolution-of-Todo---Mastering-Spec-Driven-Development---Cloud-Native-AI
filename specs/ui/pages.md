# UI Pages Specification

## Overview

Page specifications for the Next.js App Router frontend. All pages use TypeScript and Tailwind CSS.

## Design System (Phase-2 Updates)

### Design Style: Modern Gradient
- Modern gradient backgrounds on pages
- Rounded corners (rounded-2xl, rounded-3xl)
- Vibrant accent colors with subtle shadows
- Smooth hover transitions and animations

### Auth Pages: Split Layout
- Split screen: form on left, branded content/visual on right
- Gradient or branded background on one side
- Clean centered form on the other side
- Consistent with landing page design

### Landing Page: Enhanced
- Hero section with animations
- Feature cards with gradient borders
- How it works with step indicators
- Testimonials section
- CTA section with gradient button
- Footer with links

## Page Routes

### 1. Login Page
**Route**: `/login`
**File**: `frontend/app/login/page.tsx`
**Auth Required**: No

**Purpose**: Allow existing users to authenticate.

**Layout (Split Design)**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                          │  ┌─────────────────┐ │
│                                          │  │   Login         │ │
│         [Branding / Visual /             │  │                 │ │
│          Gradient Background]            │  │  [Email field]  │ │
│                                          │  │  [Password]     │ │
│                                          │  │  [Login button] │ │
│                                          │  │  [Sign up link] │ │
│                                          │  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Split Layout Details**:
- Left side: Branded gradient background (indigo/purple) with app logo/name
- Right side: White card with form (rounded-2xl, shadow-xl)
- Responsive: Stack vertically on mobile

**Elements**:
- Email input (type=email, required)
- Password input (type=password, required)
- "Login" submit button with loading spinner
- Link to signup page: "Don't have an account? Sign up"
- Error message display (red alert)

**Styling (Modern Gradient)**:
- Page background: `bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500`
- Form card: `bg-white rounded-2xl shadow-xl p-8`
- Primary button: `bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg`

**Behavior**:
- Submit POST to `/api/v1/auth/login`
- On success: Store JWT, redirect to `/tasks`
- On 401 error: Show "Invalid email or password"
- On network error: Show "Unable to connect. Please try again."

---

### 2. Signup Page
**Route**: `/signup`
**File**: `frontend/app/signup/page.tsx`
**Auth Required**: No

**Purpose**: Allow new users to create an account.

**Layout (Split Design)**:
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐                    │                      │
│  │   Create        │                    │                      │
│  │   Account       │                    │                      │
│  │                 │                    │   [Branding /        │
│  │  [Email field]  │                    │    Visual /         │
│  │  [Password]     │                    │    Gradient BG]     │
│  │  [Create]       │                    │                      │
│  │  [Login link]   │                    │                      │
│  └─────────────────┘                    │                      │
└─────────────────────────────────────────────────────────────────┘
```

**Split Layout Details**:
- Left side: White card with form (rounded-2xl, shadow-xl)
- Right side: Branded gradient background (indigo/purple) with app logo/name
- Reversed from login for visual variety
- Responsive: Stack vertically on mobile

**Elements**:
- Email input (type=email, required)
- Password input (type=password, required, min=8)
- "Create Account" submit button with loading spinner
- Link to login page: "Already have an account? Login"
- Error message display (red alert)
- Password requirements hint

**Styling (Modern Gradient)**:
- Page background: `bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500`
- Form card: `bg-white rounded-2xl shadow-xl p-8`
- Primary button: `bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg`

**Behavior**:
- Client-side validation: Email format, password length
- Submit POST to `/api/v1/auth/signup`
- On success: Store JWT, redirect to `/tasks`
- On 409 error: Show "Email already exists"
- On validation error: Show specific field errors

---

### 3. Task List Page (Home)
**Route**: `/tasks` or `/`
**File**: `frontend/app/tasks/page.tsx` or `frontend/app/page.tsx`
**Auth Required**: Yes

**Purpose**: Display all tasks for authenticated user.

**Elements**:
- Page title: "My Tasks"
- "New Task" button (navigates to `/tasks/new`)
- Task list (empty state if no tasks)
- Each task shows: TaskCard component
- Logout button in navbar

**Layout**:
```
┌─────────────────────────────────────┐
│ Navbar: "My Tasks" | [Logout]      │
├─────────────────────────────────────┤
│ [+ New Task] button                 │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ TaskCard: Buy groceries         ││
│ │ [Complete] [Edit] [Delete]      ││
│ └─────────────────────────────────┘│
│ ┌─────────────────────────────────┐│
│ │ TaskCard: Finish project ✓      ││
│ │ [Complete] [Edit] [Delete]      ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

**Behavior**:
- Fetch tasks on page load: GET `/api/v1/tasks`
- Render TaskCard for each task
- Empty state: "No tasks yet. Create your first task!"
- On 401: Redirect to `/login`

---

### 4. Create Task Page
**Route**: `/tasks/new`
**File**: `frontend/app/tasks/new/page.tsx`
**Auth Required**: Yes

**Purpose**: Create a new task.

**Elements**:
- Page title: "Create New Task"
- TaskForm component (title, description inputs)
- "Create" submit button
- "Cancel" button (navigates back to `/tasks`)

**Behavior**:
- Submit POST to `/api/v1/tasks`
- On success: Redirect to `/tasks`
- On error: Show validation errors
- On 401: Redirect to `/login`

---

### 5. Edit Task Page
**Route**: `/tasks/[id]/edit`
**File**: `frontend/app/tasks/[id]/edit/page.tsx`
**Auth Required**: Yes

**Purpose**: Edit existing task.

**Elements**:
- Page title: "Edit Task"
- TaskForm component (pre-filled with existing data)
- "Save Changes" submit button
- "Cancel" button (navigates back to `/tasks`)

**Behavior**:
- Fetch task on page load: GET `/api/v1/tasks/{id}`
- Submit PUT to `/api/v1/tasks/{id}`
- On success: Redirect to `/tasks`
- On 404: Show "Task not found" and redirect to `/tasks`
- On 401: Redirect to `/login`

---

### 6. Task Detail Page (Optional)
**Route**: `/tasks/[id]`
**File**: `frontend/app/tasks/[id]/page.tsx`
**Auth Required**: Yes

**Purpose**: View full task details (optional for Phase-2, can be merged into list view).

**Elements**:
- Task title (large heading)
- Task description
- Completion status
- Created/updated timestamps
- "Edit" button (navigates to `/tasks/[id]/edit`)
- "Delete" button (with confirmation)
- "Back to Tasks" link

**Behavior**:
- Fetch task: GET `/api/v1/tasks/{id}`
- Display full information
- On 404: Redirect to `/tasks`

## Layout Structure

### Root Layout
**File**: `frontend/app/layout.tsx`

**Elements**:
- HTML structure with metadata
- Global styles (Tailwind)
- No navigation (auth context needed)

### Authenticated Layout
**File**: `frontend/app/tasks/layout.tsx`

**Elements**:
- Navbar component (with logout)
- AuthGuard wrapper (redirects if not authenticated)
- Main content area

## Navigation Flow

```
/login ───────┐
              ▼
         [Authenticate]
              │
/signup ──────┘
              │
              ▼
         /tasks (list)
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
/tasks/new  /tasks/[id]/edit  [Logout → /login]
    │         │
    └─────────┴──► /tasks
```

## Authentication Guards

### AuthGuard Component
Used in layouts to protect routes:

```typescript
// Pseudocode
if (!hasValidJWT()) {
  redirect('/login')
}
```

### Public Routes
- `/login`
- `/signup`

### Protected Routes
- `/tasks` (list)
- `/tasks/new` (create)
- `/tasks/[id]` (detail)
- `/tasks/[id]/edit` (edit)

## Error Handling

### 401 Unauthorized
- Clear stored JWT
- Redirect to `/login`
- Show message: "Session expired. Please login again."

### 404 Not Found
- Show message: "Task not found"
- Redirect to `/tasks`

### Network Errors
- Show toast/banner: "Unable to connect. Please check your internet."
- Allow retry

## Responsive Design

All pages must be responsive:
- Mobile: Single column, full-width components
- Tablet: Moderate spacing, comfortable touch targets
- Desktop: Max-width container (e.g., 1024px), centered

Use Tailwind responsive classes:
```tsx
<div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
```

## Accessibility

- All forms have proper labels
- Buttons have clear text or aria-labels
- Error messages associated with form fields
- Keyboard navigation works correctly
- Focus states visible

## Out of Scope (Phase-2)

❌ Task filtering UI
❌ Task search bar
❌ Task sorting controls
❌ Bulk actions (select multiple tasks)
❌ Task categories/tags UI
❌ Dark mode toggle
❌ User profile page
❌ Settings page

---

**Related Specs**:
- Components: `@specs/ui/components.md`
- API Endpoints: `@specs/api/rest-endpoints.md`
- Authentication: `@specs/features/authentication.md`
- Task CRUD: `@specs/features/task-crud.md`

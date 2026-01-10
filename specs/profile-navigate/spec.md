---
page: Profile Navigation Specification
output: specs/profile-navigate/spec.md
spec: specs/profile-navigate/spec.md
---

# Profile Navigation Specification

## Problem Statement
The current profile page navigation loads separate routes when switching between profile sections (Profile, Change Password, Update Email). This creates a poor user experience as users navigate between different pages instead of having a seamless tabbed interface within a single page.

Additionally, there's an inconsistency in navigation behavior:
- When users click "Your Profile" in the navbar dropdown, they land on the profile route and see their information
- When users click "Change Password" or "Update Email" in the navbar dropdown, they navigate to separate routes
- The desired behavior is to have all profile-related actions accessible within a single profile page with tabbed navigation, regardless of the entry point (navbar dropdown or sidebar)

## Current Behavior
- Clicking on "Profile", "Change Password", or "Update Email" in the sidebar navigates to separate pages
- Clicking on "Your Profile" in navbar dropdown goes to profile page
- Clicking on "Change Password" or "Update Email" in navbar dropdown goes to separate pages
- Each navigation triggers a full page reload
- User information is re-fetched on each page load
- Navigation feels like moving between different pages instead of switching tabs

## Expected Behavior
- All profile sections should be accessible within a single page
- Clicking sidebar options should switch content in the main panel without page reload
- Clicking profile-related options in navbar dropdown should also navigate to the same single profile page but with the appropriate tab activated
- User information remains visible and accessible across all sections
- Tab-like navigation experience within the profile section from any entry point

## Solution Approach
Convert the profile section to use client-side tab switching instead of server-side navigation between separate routes, and update navbar dropdown links to point to the single profile page with appropriate tab activation.

## Detailed Requirements

### 1. Single Page Interface
- Combine all profile-related pages into a single page component
- Maintain sidebar navigation for section selection
- Update main content area dynamically based on selected section
- Preserve user information table in the main panel

### 2. Unified Navigation
- Update navbar dropdown links to navigate to profile page with specific tab activated
- When clicking "Your Profile" in navbar: go to profile page, show Profile tab
- When clicking "Change Password" in navbar: go to profile page, show Password tab
- When clicking "Update Email" in navbar: go to profile page, show Email tab
- Sidebar navigation continues to work as tab switches within the same page

### 3. Tab-Based Navigation
- Sidebar links should act as tabs instead of page navigators
- Navbar dropdown links should navigate to profile page with specific tab activated
- Active state highlighting for the selected section
- Smooth transitions between sections
- URL can optionally reflect current section (using hash or query params)

### 4. Component Structure
- Main ProfilePage component managing state and layout
- Child components for each section:
  - UserProfile (displays user information table)
  - PasswordChangeForm (change password functionality)
  - EmailUpdateForm (update email functionality)
- Shared user data context/state across all sections
- State management to handle initial tab selection from URL parameters

### 5. Layout Structure
```
┌─────────────────────────────────────────┐
│              Profile Layout             │
├──────────────┬──────────────────────────┤
│              │                          │
│  [Profile]   │  ┌─────────────────────┐ │
│              │  │                     │ │
│ [Password]   │  │  User Information   │ │
│              │  │      Table          │ │
│ [Email]      │  │                     │ │
│              │  └─────────────────────┘ │
│              │                          │
│              │  Dynamic Content Area    │
│              │  (changes based on      │
│              │   selected tab)         │
│              │                          │
└──────────────┴──────────────────────────┘
```

### 6. State Management
- Track active section/tab in component state
- Handle initial tab selection based on URL parameters or navigation source
- Cache user profile data to avoid repeated API calls
- Handle form submissions and update cached data accordingly
- Maintain form states separately for each section

### 7. Navigation Implementation
- Clicking sidebar items updates active section state
- Clicking navbar dropdown items navigates to profile page with specific tab
- Main content area renders appropriate component based on active section
- Preserve scroll position and form data when switching between sections
- Optionally update URL to reflect current section for bookmarking/back-button support

### 8. Data Flow
1. Load user profile data once when ProfilePage mounts
2. Display user information in the permanent table area
3. Render appropriate form/component in dynamic area based on active section
4. Update cached user data when profile changes are made
5. Reflect updated information in the user table immediately

## Technical Implementation Plan

### Components to Modify
1. `/app/profile/page.tsx` - Convert to tabbed interface with URL parameter handling
2. `/app/profile/change-password/page.tsx` - Integrate as child component, update navbar links to point here
3. `/app/profile/update-email/page.tsx` - Integrate as child component, update navbar links to point here
4. `/components/Navbar.tsx` - Update dropdown links to navigate to profile page with tab parameters
5. Create new ProfileTabLayout component for the unified interface

### New Component Hierarchy
```
ProfilePage (manages active tab and user data)
├── ProfileSidebar (navigation for Profile/Password/Email)
├── UserInfoPanel (permanent user information table)
└── ActiveContentArea (renders current tab's content)
    ├── UserProfileTab (original profile content)
    ├── PasswordChangeTab (password change form)
    └── EmailUpdateTab (email update form)
```

### State Management
- `activeSection`: Tracks current tab (profile | password | email)
- `userData`: Cached user profile information
- Form-specific states for each section
- Handle URL parameters to determine initial active tab

### API Integration
- Fetch user data once when ProfilePage loads
- Update user data in cache after successful form submissions
- Handle errors gracefully without losing current form data

## Success Criteria
- [ ] All profile sections accessible within a single page
- [ ] No page reloads when switching between sections via sidebar
- [ ] Navbar dropdown links navigate to profile page with correct tab activated
- [ ] User information table remains visible during navigation
- [ ] Form data persists when switching between tabs
- [ ] Active section is clearly highlighted in sidebar
- [ ] Browser back/forward buttons work correctly
- [ ] URL optionally reflects current section for deep linking
- [ ] Performance improved due to reduced API calls

## User Experience Goals
- Seamless navigation between profile sections regardless of entry point
- Consistent user information visibility
- Faster switching between profile tasks
- Reduced loading times
- Improved accessibility and usability
- Unified experience whether accessed from sidebar or navbar dropdown

## Out of Scope
- Changing the actual form components (PasswordChangeForm, EmailUpdateForm functionality)
- Modifying authentication flow
- Updating unrelated pages outside the profile section
- Major UI redesign beyond navigation structure

## Dependencies
- React state management
- Next.js client-side routing (if maintaining URL synchronization)
- Existing user profile API endpoints
- Current UserProfile, PasswordChangeForm, and EmailUpdateForm components
- Navbar component with dropdown menu

## Risk Assessment
- Medium: Potential complexity in state management between sections
- Low: Positive UX improvement expected
- Low: Reusable components will maintain existing functionality
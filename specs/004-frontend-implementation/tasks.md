# Implementation Tasks: Phase-2 Frontend Product Website

**Feature**: Frontend Product Website
**Branch**: `004-frontend-implementation`
**Date**: 2026-01-01
**Total Tasks**: 10

---

## Task List

### T-001: Create PublicNavbar Component

**Status**: `pending`
**Priority**: `high`
**Complexity**: `low`
**File**: `frontend/components/PublicNavbar.tsx`
**Contract**: `specs/004-frontend-implementation/plan.md`
**Dependencies**: None
**Estimated Time**: 1 hour

**Description**:
Create a marketing navigation bar component for public-facing pages. Displays app logo, navigation links (Home, Features, Pricing, Login, Sign Up), and remains sticky at the top of the page while scrolling.

**Acceptance Criteria**:
- [ ] Component file created with `'use client'` directive
- [ ] Props interface matches spec exactly
- [ ] Logo and app name displayed on left side
- [ ] Navigation links displayed on right side (Home, Features, Pricing, Login, Sign Up)
- [ ] Login/Sign Up buttons use button styles
- [ ] Navbar remains sticky/fixed at top when scrolling
- [ ] Mobile hamburger menu icon displayed on devices <768px
- [ ] Mobile menu expands/slides into view when clicked
- [ ] Mobile menu closes after clicking any navigation link
- [ ] Smooth transition effect when scrolling
- [ ] "Sign Up" button has distinct primary button styling to draw attention
- [ ] No TypeScript errors
- [ ] Component exports correctly
- [ ] Matches visual design from spec (white background, proper spacing)

**Implementation Notes**:
- Use Tailwind responsive classes: `sm:flex-row md:flex-row` for desktop, `flex-col` for mobile
- Sticky behavior: Use `sticky` or fixed positioning with backdrop blur
- Mobile menu: Use state hook for menu open/close
- Logo: Can use emoji or SVG icon
- Links: Use Next.js `<Link>` component for navigation
- Aria-labels on all interactive elements
- Add `role="navigation"` and `aria-label="Main navigation"` attributes

---

### T-002: Create Hero Component

**Status**: `pending`
**Priority**: `high`
**Complexity**: `medium`
**File**: `frontend/components/Hero.tsx`
**Contract**: `specs/004-frontend-implementation/plan.md`
**Dependencies**: None
**Estimated Time**: 2 hours

**Description**:
Create a hero section component with vibrant gradient background, compelling headline, subheading, call-to-action buttons, and app screenshot/visual representation.

**Acceptance Criteria**:
- [ ] Component file created with `'use client'` directive
- [ ] Props interface matches spec exactly
- [ ] Gradient background using Indigo-600 to Purple-600
- [ ] Headline (H1) is compelling and clearly communicates product value
- [ ] Subheading (H2 or paragraph) elaborates on headline
- [ ] Two CTA buttons: primary "Sign Up" and secondary "Learn More"
- [ ] Screenshot/visual placeholder or actual app screenshot
- [ ] Responsive layout: stacked vertically on mobile, side-by-side on desktop
- [ ] Hero content is above fold on all screen sizes
- [ ] No TypeScript errors
- [ ] Component exports correctly
- [ ] Matches visual design from spec (gradient, proper spacing)

**Implementation Notes**:
- Use Tailwind gradient: `bg-gradient-to-r from-indigo-600 to-purple-600`
- Text color: white for contrast
- Buttons: primary with Indigo-600, secondary with white background and Indigo-600 text
- Screenshot: Use placeholder emoji or create image in `public/images/` directory
- Use Tailwind responsive classes for layout
- Content section width constrained on desktop with `max-w-7xl mx-auto`
- Add aria-label for accessibility

---

### T-003: Create FeatureCard Component

**Status**: `pending`
**Priority**: `high`
**Complexity**: `medium`
**File**: `frontend/components/FeatureCard.tsx`
**Contract**: `specs/004-frontend-implementation/plan.md`
**Dependencies**: None
**Estimated Time**: 2 hours

**Description**:
Create a reusable card component for displaying individual features. Each card shows an icon, title, and description with hover effects.

**Acceptance Criteria**:
- [ ] Component file created with `'use client'` directive
- [ ] Props interface matches spec exactly
- [ ] Feature card displays icon (emoji or SVG string)
- [ ] Title is bold and prominent
- [ ] Description paragraph provides 3-4 sentences max
- [ ] Card has white background, Gray-200 border, rounded-xl corners
- [ ] Medium shadow effect on normal state
- [ ] Hover effect shows elevated shadow (xl) and border color change (Indigo-300)
- [ ] No TypeScript errors
- [ ] Component exports correctly
- [ ] Matches visual design from spec (card styles, hover effects)

**Implementation Notes**:
- Card styles: `bg-white border border-gray-200 rounded-xl shadow-md`
- Hover styles: `hover:shadow-xl hover:border-indigo-300`
- Icon: Use emoji for simplicity or SVG string
- Typography: Title `text-lg font-semibold`, description `text-gray-600 text-sm`
- Use Tailwind classes: `p-6` for padding
- Add line-clamp-2 to truncate long descriptions: `line-clamp-2`
- Responsive grid: 1 column mobile, 2-3 tablet, 3-4 desktop
- Aria-label on card: `aria-label="Feature: [title]"`

---

### T-004: Create HowItWorks Component

**Status**: `pending`
**Priority**: `medium`
**Complexity**: `medium`
**File**: `frontend/components/HowItWorks.tsx`
**Contract**: `specs/004-frontend-implementation/plan.md`
**Dependencies**: None
**Estimated Time**: 1.5 hours

**Description**:
Create a "How It Works" section that displays 3-5 sequential steps showing the product workflow. Each step is numbered with a title and description.

**Acceptance Criteria**:
- [ ] Component file created with `'use client'` directive
- [ ] Props interface matches spec exactly
- [ ] Steps are numbered sequentially (1, 2, 3, etc.)
- [ ] Each step has a title and description
- [ ] Optional icon for each step
- [ ] Visual connectors (arrows or lines) on desktop layout
- [ ] Steps stack vertically on mobile
- [ ] Use brand colors (Indigo, Emerald, Amber) for step indicators
- [ ] No TypeScript errors
- [ ] Component exports correctly
- [ ] Matches visual design from spec (numbered steps, visual connectors)

**Implementation Notes**:
- Steps interface: `{ number: number; title: string; description: string; icon?: string }`
- Use ordered list or array for steps
- Desktop layout: Horizontal with arrows between steps using Tailwind or SVG
- Mobile layout: Vertical stacking with clear numbering
- Step indicators: Circular badges with numbers using brand colors
- Aria-labels: `aria-label="Step [number]: [title]"`
- Use CSS Grid or Flexbox for responsive layout

---

### T-005: Create CTASection Component

**Status**: `pending`
**Priority**: `high`
**Complexity**: `low`
**File**: `frontend/components/CTASection.tsx`
**Contract**: `specs/004-frontend-implementation/plan.md`
**Dependencies**: None
**Estimated Time**: 1 hour

**Description**:
Create a call-to-action section with a distinct background color, compelling headline, and large CTA button. This section appears at the bottom of the landing page before the footer.

**Acceptance Criteria**:
- [ ] Component file created with `'use client'` directive
- [ ] Props interface matches spec exactly
- [ ] Distinct background color (Indigo-600 gradient or solid)
- [ ] Compelling headline (H2 or H3) prompts user action
- [ ] Large CTA button (larger than standard) with primary styling
- [ ] Section is centered horizontally
- [ ] Constrained width on desktop, full width on mobile
- [ ] No TypeScript errors
- [ ] Component exports correctly
- [ ] Matches visual design from spec (distinct background, prominent CTA)

**Implementation Notes**:
- CTA styles: Indigo-600 background or gradient
- Button styles: `px-8 py-4 bg-indigo-600 text-white rounded-lg` (larger than standard)
- Text color: White for contrast against Indigo background
- Use Tailwind classes: `max-w-4xl mx-auto` for width constraint
- Center content: `text-center`
- Add aria-label to CTA button
- Optional supporting text below button
- Section padding: `py-12` or more

---

### T-006: Create Footer Component

**Status**: `pending`
**Priority**: `medium`
**Complexity**: `low`
**File**: `frontend/components/Footer.tsx`
**Contract**: `specs/004-frontend-implementation/plan.md`
**Dependencies**: None
**Estimated Time**: 1 hour

**Description**:
Create a footer component that displays the app name, copyright notice, and navigation links. Footer is always visible at the bottom of the page.

**Acceptance Criteria**:
- [ ] Component file created with `'use client'` directive
- [ ] Props interface matches spec exactly
- [ ] App name or logo displayed
- [ ] Copyright notice with current year
- [ ] Navigation links: Login, Sign Up, GitHub, Privacy
- [ ] Responsive layout: horizontal links on desktop, vertically stacked on mobile
- [ ] Dark background (Gray-900) with white text for contrast
- [ ] No TypeScript errors
- [ ] Component exports correctly
- [ ] Matches visual design from spec (responsive layout, proper contrast)

**Implementation Notes**:
- Footer styles: `bg-gray-900 text-white`
- Links: `<Link>` components from Next.js
- GitHub URL: Use actual repository URL or placeholder
- Privacy link: Can be placeholder or point to future privacy page
- Use Tailwind responsive classes: `flex flex-col md:flex-row` for layout
- Aria-labels on all links
- Current year: `new Date().getFullYear()`
- Add semantic `<footer>` element with `role="contentinfo"`

---

### T-007: Create/Update Landing Page (app/page.tsx)

**Status**: `pending`
**Priority**: `critical`
**Complexity**: `medium`
**File**: `frontend/app/page.tsx`
**Contract**: `specs/004-frontend-implementation/spec.md`
**Dependencies**: T-001, T-002, T-003, T-004, T-005, T-006
**Estimated Time**: 2 hours

**Description**:
Replace the existing root page with a professional SaaS landing page. Compose all components (Navbar, Hero, Features, How It Works, CTA, Footer) into a modern, colorful, and friendly marketing homepage.

**Acceptance Criteria**:
- [ ] Landing page created with `'use client'` directive (if needed)
- [ ] All 6 components (Navbar, Hero, FeatureCard, HowItWorks, CTASection, Footer) imported and composed
- [ ] Hero section is at top of page
- [ ] Features section follows with 3-5 feature cards in grid
- [ ] How It Works section displays 3-5 sequential steps
- [ ] CTA section at bottom before footer
- [ ] Footer at page bottom
- [ ] Content is stacked vertically (Navbar → Hero → Features → HowItWorks → CTA → Footer)
- [ ] No TypeScript errors
- [ ] Page loads in under 2 seconds on 4G mobile
- [ ] Hero section is visible above fold on all device sizes
- [ ] Navigation links work correctly (anchor scrolling, page routing)
- [ ] All colors match design system (Indigo, Emerald, Amber)
- [ ] Typography follows specification
- [ ] No existing functionality broken (/login, /signup, /tasks still work)
- [ ] Matches visual design from spec (modern, colorful, professional)

**Implementation Notes**:
- Remove all existing monolithic content
- Keep page as simple component composition
- Use semantic `<main>` for page content (or direct children if no state needed)
- Add proper meta tags for SEO (title, description)
- Use smooth scrolling for anchor navigation
- Test all responsive breakpoints
- Ensure contrast ratios meet WCAG AA standard

**Implementation Notes**:
- Import all components from `components/`
- No internal state needed (all components are stateless)
- Use Next.js `<Link>` for navigation
- Layout: `max-w-7xl mx-auto px-4 sm:px-6 lg:py-12`
- Sections: Hero, Features, HowItWorks, CTA, Footer
- Anchor scrolling: Use `scroll-smooth` or CSS
- Meta tags: title, description, keywords

---

### T-008: Test Responsive Design

**Status**: `pending`
**Priority**: `high`
**Complexity**: `medium`
**File**: Multiple (manual testing in browser)
**Contract**: `specs/004-frontend-implementation/quickstart.md`
**Dependencies**: T-001, T-002, T-003, T-004, T-005, T-006, T-007
**Estimated Time**: 1 hour

**Description**:
Manually test responsive design on all device sizes (mobile < 768px, tablet 768px-1024px, desktop > 1024px). Ensure all components render correctly and layout adapts properly.

**Acceptance Criteria**:
- [ ] Mobile layout (<768px):
  - [ ] Navbar hamburger menu appears and works
  - [ ] Navigation links show/hide when menu toggled
  - [ ] Hero content stacks vertically
  - [ ] Feature cards stack in 1 column
- [ ] How It Works steps stack vertically
- [ ] Footer links stack vertically
  - [ ] No horizontal scroll required
  [ ] All touch targets are minimum 44x44 pixels
- [ ] Mobile menu responds within 200ms of tap

- [ ] Tablet layout (768px-1024px):
  - [ ] Navbar shows all links horizontally
  - [ ] Feature cards display in 2-3 columns
  - [ ] How It Works steps display horizontally
  - [ ] Grid layouts are balanced
- [ ] Spacing is appropriate

- [ ] Desktop layout (>1024px):
  - [ ] Navbar shows all links with sufficient spacing
  - [ ] Feature cards display in 3-4 columns
- [ ] How It Works steps display horizontally
- [ ] Full grid layout is centered
- [ ] Content width is constrained (not too wide)

- [ ] All components render without layout shifts
- [ ] No TypeScript errors
- [ ] Matches visual design from spec (responsive breakpoints)

**Implementation Notes**:
- Test on actual devices if possible
- Use browser DevTools Responsive Design Mode
- Test Chrome, Firefox, Safari, Edge
- Take screenshots of different breakpoints
- Verify Tailwind responsive prefixes (sm:, md:, lg:, xl:) are working
- Check for horizontal overflow or broken layouts
- Document any issues found

---

### T-009: Verify Routing

**Status**: `pending`
**Priority**: `medium`
**Complexity**: `low`
**File**: Browser testing (manual)
**Contract**: `specs/004-frontend-implementation/plan.md`
**Dependencies**: T-001, T-002, T-003, T-004, T-005, T-006, T-007
**Estimated Time**: 30 minutes

**Description**:
Verify all routing rules work correctly. Ensure root path (/) shows landing page, login and signup paths are unchanged, and tasks path works as expected.

**Acceptance Criteria**:
- [ ] Visit `/` URL shows new landing page
- [ ] Clicking "Home" in navbar scrolls to hero section (anchor: #hero or just scrolls to top)
- [ ] Clicking "Features" in navbar scrolls to features section (anchor: #features)
- [ ] Clicking "Pricing" in navbar shows fake pricing (if implemented) or scrolls
- [ ] Clicking "Login" redirects to `/login` page
- [ ] Clicking "Sign Up" (navbar or hero CTA) redirects to `/signup` page
- [ ] Clicking "Tasks" link (if present) redirects to `/tasks` page
- [ ] Footer "Login" link redirects to `/login`
- [ ] Footer "Sign Up" link redirects to `/signup`
- [ ] Footer "GitHub" link opens actual GitHub repository URL
- [ ] Footer "Privacy" link opens privacy page (if implemented) or placeholder
- [ ] User authentication state persists across page navigations
- [ ] All navigation links respond within 500ms of click
- [ ] No TypeScript errors
- [ ] Existing authentication pages (/login, /signup) remain functional
- [ ] Existing task app (/tasks) remains functional
- [ ] Matches routing rules from spec

**Implementation Notes**:
- Open http://localhost:3000
- Test each navigation link individually
- Verify URL updates with hash anchors when scrolling (e.g., http://localhost:3000#features)
- Test redirect behavior on protected routes
- Use Next.js `<Link>` component for all links
- Test authentication state (should persist via JWT or sessionStorage)
- Check for 401 redirect behavior on protected routes

---

### T-010: Test Accessibility

**Status**: `pending`
**Priority**: `high`
**Complexity**: `low`
**File**: Browser testing (manual with DevTools)
**Contract**: `specs/004-frontend-implementation/quickstart.md`
**Dependencies**: T-007
**Estimated Time**: 1 hour

**Description**:
Perform accessibility testing to ensure the landing page meets WCAG AA standards. Test color contrast ratios, keyboard navigation, screen reader compatibility, and focus states.

**Acceptance Criteria**:
- [ ] Color contrast meets WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
- [ ] Use browser DevTools or Lighthouse Color Contrast Analyzer
- [ ] All text is readable on all backgrounds (white, Indigo-600, Gray-900)
- [ ] All buttons have sufficient contrast with backgrounds
- [ ] Navigation links have good visibility and hover states

- [ ] Keyboard navigation works correctly:
  - [ ] Tab through interactive elements in logical order (Navbar → Hero links → Features cards → CTA buttons → Footer links)
  - [ ] Enter key activates primary CTA buttons
- [ [ ] Escape key closes mobile menu (if implemented)

- [ ] Focus states are visible on all interactive elements (blue rings)

- [ ] Screen reader reads content correctly:
  - [ ] All buttons have `aria-label` attributes
- [ ] Navigation links have descriptive text
- [ ] Navigation landmarks are announced (`<nav>`, `<header>`, `<footer>` elements)
- [ ] Use screen reader extension or browser native screen reader to verify

- [ ] Focus management is correct (no unexpected focus traps)

- [ ] No console errors in browser DevTools
- [ ] Lighthouse accessibility score is 90+
- [ ] WCAG AA contrast passes for all elements

**Implementation Notes**:
- Use Chrome DevTools Accessibility panel or Lighthouse audit
- Test color contrast: https://webaim.org/resources/contrastchecker/
- Test keyboard navigation: Tab through all interactive elements
- Test screen reader: Use NVDA or browser built-in screen reader
- Check focus states: Tab through to verify blue rings
- Lighthouse target: 90+ accessibility score

---

## Dependency Graph

```
T-001 (PublicNavbar)
    │
    ├─► T-007 (uses PublicNavbar in page layout)
    │
T-002 (Hero)
    │
    ├─► T-007 (uses Hero in page)
    │
T-003 (FeatureCard)
    │
    ├─► T-007 (uses FeatureCard in Hero - if implemented)
    │
T-004 (HowItWorks)
    │
    ├─► T-007 (uses HowItWorks in page - if implemented)
    │
T-005 (CTASection)
    │
    ├─► T-007 (uses CTASection in page)
    │
T-006 (Footer)
    │
    └─► T-007 (uses Footer in page layout)
    │
T-007 (Update landing page)
    │
    ├─► T-001, T-002, T-003, T-004, T-005, T-006 (all components)
    │
    ├─► T-008 (responsive testing)
    ├─► T-009 (routing verification)
    └─► T-010 (accessibility testing)
    │
    └─► COMPLETE
```

---

## Implementation Order

**Suggested Sequence**:

1. **T-006** (Footer) - Simplest, no dependencies
2. **T-001** (PublicNavbar) - Simple, no dependencies
3. **T-002** (Hero) - Medium, no dependencies
4. **T-003** (FeatureCard) - Medium, no dependencies
5. **T-004** (HowItWorks) - Medium, no dependencies
6. **T-005** (CTASection) - Simple, no dependencies
7. **T-007** (Landing Page) - High complexity, depends on all components
8. **T-008** (Responsive) - Medium, depends on all components
9. **T-009** (Routing) - Low, depends on T-007
10. **T-010** (Accessibility) - Low, depends on T-007

**Parallel Tasks**: T-001, T-002, T-003, T-004, T-005, T-006 can all be done in parallel by different team members if available

---

## Estimated Timeline

| Task | Hours | Day |
|------|--------|------|
| T-001 | 1 | 1 |
| T-002 | 2 | 1 |
| T-003 | 2 | 1-2 |
| T-004 | 1.5 | 1-2 |
| T-005 | 1 | 1 |
| T-006 | 1 | 1 |
| T-007 | 2 | 2 |
| T-008 | 1 | 2 |
| T-009 | 0.5 | 2-3 |
| T-010 | 1 | 3 |
| **Total** | **10.5 hours** | **3 days** |

---

## Completion Checklist

**All Tasks Complete When**:
- [ ] T-001 through T-010 marked as `completed`
- [ ] All acceptance criteria met for each task
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No build errors: `npm run build`
- [ ] All manual tests pass (T-008, T-009, T-010)
- [ ] All components have Task ID comments in headers
- [ ] Landing page loads in under 2 seconds on 4G mobile
- [ ] Hero section visible above fold on all devices
- [ ] Navigation works correctly (all links route properly)
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Colors match design system (Indigo, Emerald, Amber palette)
- [ ] Typography follows specification
- [ ] Light theme only (no dark mode)
- [ ] Accessibility passes (WCAG AA 90+ score)
- [ ] Existing authentication and task pages remain functional
- [ ] Landing page feels modern, colorful, and professional
- [ ] CTA section is prominent and draws attention
- [ ] All components are reusable and independently testable

**Ready for PR When**:
- [ ] All acceptance criteria above met
- [ ] All tasks marked as `completed`
- [ ] Git commits follow conventional commits format
- [ ] Pull request description references this tasks.md
- [ ] Code review checklist from quickstart.md passed

---

**Tasks Generated**: 2026-01-01
**Feature**: Phase-2 Frontend Refactoring (Product Website)

---

**End of tasks.md**

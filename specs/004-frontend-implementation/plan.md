# Implementation Plan: Product Website - Professional SaaS Landing Page

**Branch**: `004-frontend-implementation` | **Date**: 2026-01-01 | **Spec**: `specs/004-frontend-implementation/spec.md`
**Input**: Feature specification from `/specs/004-frontend-implementation/spec.md`

## Summary

This plan focuses on **creating a professional SaaS landing page** with modern, colorful, and friendly design. The existing authentication and task management app pages are complete and remain unchanged. This is purely a marketing layer that adds a public-facing homepage.

**Key Insight**: This is a static/marketing UI only - no backend changes, no API endpoints, no data persistence. All components are visual and use existing routing infrastructure.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), React 18+, Tailwind CSS
**Storage**: N/A (static content only)
**Testing**: Manual browser testing (automated testing out of scope for this phase)
**Target Platform**: Web browser (responsive: mobile, tablet, desktop)
**Project Type**: Marketing website (frontend only, no backend changes)
**Performance Goals**: <2s page load on 4G mobile, WCAG AA accessibility, Lighthouse 85+ score
**Constraints**:
  - Must NOT modify existing authentication pages (/login, /signup)
  - Must NOT modify existing task app pages (/tasks)
  - MUST use App Router (NOT Pages Router)
  - MUST use Tailwind CSS (no inline styles, no CSS-in-JS)
  - MUST use light theme only (no dark mode)
  - MUST use specified color palette (Indigo, Emerald, Amber)
  - Strict TypeScript with no `any` types
**Scale/Scope**: ~5 components to create, 1 page to compose

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Since this is **Phase-2 (Full-Stack Web App)** and the spec follows Phase-2 scope (web technologies permitted), the Phase-1 constitution constraints do not apply. The Phase-2 constitution is not yet created, so we proceed with the spec requirements.

## Current State Analysis

### Existing Frontend (Working & Unchanged)
```
frontend/
├── app/
│   ├── layout.tsx              ✅ Root layout (keep as-is)
│   ├── page.tsx                ⚠️ Will be replaced with landing page
│   ├── login/page.tsx          ✅ Keep as-is (already complete)
│   ├── signup/page.tsx         ✅ Keep as-is (already complete)
│   └── tasks/
│       ├── layout.tsx         ✅ Keep as-is (uses Navbar component)
│       └── page.tsx          ✅ Keep as-is (uses components)
├── components/
│   ├── AuthGuard.tsx           ✅ Keep as-is
│   ├── Navbar.tsx              ✅ Keep as-is (app navbar)
│   ├── ConfirmDialog.tsx        ✅ Keep as-is
│   ├── TaskCard.tsx            ✅ Keep as-is
│   └── TaskForm.tsx            ✅ Keep as-is
├── lib/
│   └── api.ts                 ✅ Keep as-is (API client unchanged)
└── types/
    ├── auth.ts                 ✅ Keep as-is
    └── task.ts                ✅ Keep as-is
```

### What's New (Per Landing Page Spec)

**New Components to Create:**
1. **PublicNavbar.tsx** - Separate from app Navbar, includes logo and marketing links
2. **Hero.tsx** - Hero section with gradient, headline, subheading, CTA buttons, screenshot
3. **FeatureCard.tsx** - Reusable feature cards with icon, title, description
4. **HowItWorks.tsx** - Steps section with numbered steps and visual connectors
5. **CTASection.tsx** - Call-to-action section with distinct background
6. **Footer.tsx** - Footer with app name, copyright, navigation links

**Page to Create/Modify:**
1. **app/page.tsx** - Landing page composed of all new components

### What's NOT Changing
- Authentication pages (/login, /signup) - remain unchanged
- Task management pages (/tasks) - remain unchanged
- API client (lib/api.ts) - unchanged
- AuthGuard - unchanged
- Existing components (ConfirmDialog, TaskCard, TaskForm, Navbar) - unchanged

## Project Structure

### Documentation (this feature)

```text
specs/004-frontend-implementation/
├── plan.md                    # This file (already created)
├── research.md                # Phase 0 output (not needed - no unknowns)
├── data-model.md              # Phase 1 output (component props)
├── contracts/                 # Not needed (UI-only, no API)
├── quickstart.md              # Phase 1 output (dev setup)
└── tasks.md                  # Phase 2 output (not yet generated)
```

### Source Code (frontend landing page)

```text
frontend/
├── app/
│   ├── layout.tsx             # Keep as-is
│   ├── page.tsx               # ✅ REPLACE with landing page
│   ├── login/                # Keep as-is
│   ├── signup/               # Keep as-is
│   └── tasks/                 # Keep as-is
│
├── components/
│   ├── AuthGuard.tsx            # Keep as-is
│   ├── Navbar.tsx               # Keep as-is (app navbar)
│   ├── PublicNavbar.tsx          # 🆕 NEW: Marketing navbar
│   ├── Hero.tsx                 # 🆕 NEW
│   ├── FeatureCard.tsx           # 🆕 NEW
│   ├── HowItWorks.tsx           # 🆕 NEW
│   ├── CTASection.tsx           # 🆕 NEW
│   ├── Footer.tsx               # 🆕 NEW
│   ├── ConfirmDialog.tsx          # Keep as-is
│   ├── TaskCard.tsx              # Keep as-is
│   └── TaskForm.tsx              # Keep as-is
│
├── lib/
│   └── api.ts                  # Keep as-is
│
└── types/
    ├── auth.ts                 # Keep as-is
    └── task.ts                # Keep as-is
```

**Structure Decision**: Frontend-only changes to public-facing marketing layer. No backend modifications, no API changes, no database changes.

## Complexity Tracking

Not applicable - no constitution violations for Phase-2.

## Phase 0: Outline & Research

### Research Questions

**No research needed** - All requirements are clearly defined in the spec:
- Design system is fully specified (colors, typography, buttons, cards, spacing)
- Component requirements are detailed with Tailwind class specifications
- Routing rules are explicit
- No unknowns or decision points requiring research

**Output**: research.md (minimal or skipped - no research needed)

## Phase 1: Design & Contracts

**Prerequisites**: N/A (no Phase 0 research needed)

### 1.1 Component Interfaces (`data-model.md`)

Define TypeScript interfaces for all landing page components:
- PublicNavbarProps, HeroProps, FeatureCardProps, HowItWorksProps, CTASectionProps, FooterProps
- No internal state needed for most components (stateless)
- Ensure strict typing with no `any` types

### 1.2 Component Design Details

Document component design specifications:
- **PublicNavbar**: Logo, navigation links, sticky behavior, mobile menu
- **Hero**: Gradient background, headline, subheading, CTA buttons, screenshot/visual
- **FeatureCard**: Icon, title, description, hover effects
- **HowItWorks**: Sequential steps, numbering, visual connectors
- **CTASection**: Distinct background, headline, large CTA button
- **Footer**: App name, copyright, navigation links, responsive layout

### 1.3 Page Composition

Document landing page structure:
- Navbar (sticky at top)
- Hero section (full viewport on mobile, above fold on all devices)
- Features section (3-5 cards in grid)
- How It Works section (3-5 steps)
- CTA section (bottom of page)
- Footer (always visible at page bottom)

### 1.4 Responsive Design Strategy

Document responsive breakpoints and layouts:
- Mobile (<768px): Stacked layouts, hamburger menu, 1 column grids
- Tablet (768px-1024px): 2-3 column grids, full navbar
- Desktop (>1024px): 3-4 column grids, full navbar with all links

### 1.5 Quickstart Guide

Create developer setup guide:
- How to run dev server
- How to view landing page
- How to test responsiveness
- Checklist for component completion

**Output**: data-model.md, quickstart.md, research.md (if needed)

## Phase 2: Implementation Tasks

**Prerequisites**: Phase 1 complete (data-model.md, quickstart.md available)

Implementation tasks will include:
- T-001: Create PublicNavbar component
- T-002: Create Hero component
- T-003: Create FeatureCard component
- T-004: Create HowItWorks component
- T-005: Create CTASection component
- T-006: Create Footer component
- T-007: Create landing page (app/page.tsx) composing all components
- T-008: Test responsive design on mobile/tablet/desktop
- T-009: Verify routing (/, /login, /signup, /tasks)
- T-010: Verify accessibility (contrast, keyboard navigation, screen reader)

## Implementation Approach

### Component Creation Order

```
PublicNavbar (simplest, independent)
    ↓
Footer (simplest, independent)
    ↓
FeatureCard (medium, independent)
    ↓
Hero (complex, but independent)
    ↓
HowItWorks (medium, independent)
    ↓
CTASection (simple, independent)
    ↓
Landing Page (integration)
```

### Design System Usage

All components MUST use:
**Colors**:
- Primary: Indigo-600 (#4F46E5)
- Secondary: Emerald-600 (#059669)
- Accent: Amber-500 (#F59E0B)
- Backgrounds: Gray-50, White, Indigo gradients
- Text: Gray-900, Gray-600, Gray-500, White

**Typography**:
- H1 (Hero): 3xl (48px), Bold
- H2 (Section): 2xl (36px), Semi-bold
- H3 (Card): xl (24px), Semi-bold
- Body: Base (16px), Normal

**Buttons**:
- Primary: Indigo-600 bg, white text, rounded-lg, md shadow
- Secondary: White bg, Indigo-600 text, rounded-lg
- Ghost: Transparent, Indigo-600 text

**Cards**:
- FeatureCard: White bg, Gray-200 border, rounded-xl, md shadow
- Content: White bg, rounded-lg, sm shadow

**Spacing**: 4px base scale (xs=8px, sm=12px, md=16px, lg=24px, etc.)
**Border Radius**: md=6px, lg=8px, xl=12px, full

### Testing Strategy

**Manual Testing** (component-by-component):
1. PublicNavbar displays correctly on all breakpoints
2. Hero section is above fold on all screen sizes
3. Feature cards display in correct grid layout
4. How It Works steps are numbered and visually connected
5. CTA section is prominent and draws attention
6. Footer displays correctly with all links
7. All buttons show hover effects
8. All colors match design system specification
9. Typography is correct (sizes, weights, line heights)
10. Navigation links work correctly (anchor scrolling, page routing)

**Responsive Testing**:
1. Mobile (<768px): Hamburger menu works, content stacks, no horizontal scroll
2. Tablet (768px-1024px): Grid layouts correct, navbar shows all links
3. Desktop (>1024px): Full grid layout, optimal spacing

**Accessibility Testing**:
1. Color contrast meets WCAG AA (use browser dev tools)
2. Keyboard navigation works (Tab through links/buttons)
3. Screen reader reads content correctly (use screen reader extension)
4. Focus states visible on all interactive elements
5. Aria labels on buttons and links

### Routing Verification

1. Visit `/` - Shows landing page
2. Click "Login" - Redirects to `/login`
3. Click "Sign Up" - Redirects to `/signup`
4. Click "Tasks" link (if present) - Redirects to `/tasks`
5. Scroll to features section - URL shows `#features`
6. Scroll to CTA section - URL shows `#cta`

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking existing authentication flows | Do NOT modify /login or /signup pages |
| Breaking existing task app | Do NOT modify /tasks pages or components |
| Inconsistent design system | Use exact Tailwind classes from spec |
| Responsive layout issues | Test on multiple screen sizes during implementation |
| Navigation conflicts | Use clear anchor routing, avoid hash conflicts |
| Performance degradation | Optimize images, minimize re-renders, test Lighthouse |

## Success Criteria

Product Website implementation is successful when:

1. ✅ Landing page loads in under 2 seconds on 4G mobile
2. ✅ Hero section is visible above fold on all device sizes (mobile, tablet, desktop)
3. ✅ All 6 components are created and reusable
4. ✅ Navigation works correctly (all links route properly)
5. ✅ Responsive design works on mobile (<768px), tablet (768px-1024px), desktop (>1024px)
6. ✅ All colors match design system specification (Indigo, Emerald, Amber palette)
7. ✅ Typography follows specification (sizes, weights, line heights)
8. ✅ No TypeScript errors (strict mode passes)
9. ✅ All components use Tailwind CSS (no inline styles)
10. ✅ Light theme only (no dark mode elements)
11. ✅ Accessibility passes (WCAG AA contrast, keyboard navigation)
12. ✅ Existing authentication and task pages remain functional
13. ✅ Landing page feels modern, colorful, and professional
14. ✅ CTA section is prominent and draws attention

## Out of Scope

❌ Backend API changes (no new endpoints)
❌ Database schema changes (no new tables)
❌ Authentication flow changes (keep existing /login and /signup)
❌ Task management app changes (keep existing /tasks)
❌ Dark mode theme (light theme only)
❌ Internationalization (i18n) (English only)
❌ Real pricing page (fake pricing links only)
❌ Privacy policy page implementation (placeholder link only)
❌ Animated transitions beyond CSS (no Framer Motion initially)
❌ Icon library integration (use emoji or SVG initially)
❌ Analytics integration (Google Analytics, etc.)
❌ SEO optimization beyond basic meta tags
❌ Live chat or support widgets
❌ Email capture or newsletter signup

---

**Next Steps**:
1. Phase 0: Skip (no research needed)
2. Phase 1: Create data-model.md, quickstart.md
3. Phase 2: Run `/sp.tasks` to generate implementation tasks
4. Implement components one by one with manual testing
5. Verify responsive design and accessibility
6. Polish and optimize performance

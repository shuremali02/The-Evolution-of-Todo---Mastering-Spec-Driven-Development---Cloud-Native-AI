# Component Data Model: Product Website - Professional SaaS Landing Page

**Date**: 2026-01-01
**Feature**: Frontend Product Website
**Spec**: `specs/004-frontend-implementation/spec.md`

## Overview

This document defines the TypeScript interfaces and prop types for all landing page components. All components are stateless (no internal state) and receive all data via props.

---

## Component Interfaces

### 1. PublicNavbar

**Purpose**: Marketing navigation bar with logo and links for public pages (landing, features, pricing).

**Interface**:
```typescript
/**
 * Task: T-001
 * Spec: 3.1 Navbar (Public) Component
 */
interface PublicNavbarProps {
  onNavigate?: (section: string) => void  // Optional: Scroll to section
}

interface NavLink {
  label: string
  href: string
  section?: string  // For anchor scrolling (e.g., "features")
}

interface NavLink {
  label: string
  href: string
  type?: 'primary' | 'secondary'
}
```

**State**: No internal state (stateless component)

**Visual States**:
- **Default**: White background, all links visible
- **Sticky**: Fixed at top when scrolling
- **Mobile**: Hamburger menu icon, collapsed links
- **Mobile Open**: Full-screen or dropdown menu with all links
- **Scrolling**: Smooth transition to solid background

---

### 2. Hero

**Purpose**: Hero section with gradient background, compelling headline, subheading, CTA buttons, and app screenshot/visual.

**Interface**:
```typescript
/**
 * Task: T-002
 * Spec: 2.1 Hero Section Component
 */
interface HeroProps {
  headline: string
  subheadline: string
  primaryCTA?: {
    label: string
    href: string
    type?: 'primary' | 'secondary'
  }
  secondaryCTA?: {
    label: string
    href: string
  }
  screenshot?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}
```

**State**: No internal state (stateless component)

**Visual States**:
- **Mobile**: Content stacked vertically (headline → subheading → CTA buttons → screenshot)
- **Desktop**: Content side-by-side (left: headline + subheading + CTA buttons, right: screenshot)
- **Screenshot**: Optional - can use placeholder if not provided

---

### 3. FeatureCard

**Purpose**: Reusable card displaying a single feature with icon, title, and description.

**Interface**:
```typescript
/**
 * Task: T-003
 * Spec: 2.2 Feature Card Component
 */
interface FeatureCardProps {
  icon: string  // Emoji or SVG icon string
  title: string
  description: string
}
```

**State**: No internal state (stateless component)

**Visual States**:
- **Default**: White background, normal shadow
- **Hover**: Elevated shadow, border color change to Indigo-300

---

### 4. HowItWorks

**Purpose**: Section displaying sequential steps showing product workflow.

**Interface**:
```typescript
/**
 * Task: T-004
 * Spec: 2.3 How It Works Section Component
 */
interface Step {
  number: number
  title: string
  description: string
  icon?: string
}

interface HowItWorksProps {
  steps: Step[]
  sectionHeading?: string
}
```

**State**: No internal state (stateless component)

**Visual States**:
- **Desktop**: Steps displayed horizontally with arrows/connectors
- **Mobile**: Steps stacked vertically with clear numbering
- **Step Indicator**: Circular badge with number using brand colors

---

### 5. CTASection

**Purpose**: Call-to-action section with distinct background, compelling headline, and large CTA button.

**Interface**:
```typescript
/**
 * Task: T-005
 * Spec: 2.4 Call to Action Section Component
 */
interface CTASectionProps {
  headline: string
  subtext?: string
  ctaButton: {
    label: string
    href: string
    type?: 'primary' | 'large'
  }
}
```

**State**: No internal state (stateless component)

**Visual States**:
- **All Breakpoints**: Full width on mobile, constrained width on desktop
- **Background**: Indigo-600 gradient or solid color
- **CTA Button**: Large size, centered, prominent

---

### 6. Footer

**Purpose**: Footer with app name, copyright, and navigation links.

**Interface**:
```typescript
/**
 * Task: T-006
 * Spec: 2.5 Footer Component
 */
interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  appName?: string
  year?: number  // Current year for copyright
  links?: FooterLink[]
  githubUrl?: string
  privacyUrl?: string
}
```

**State**: No internal state (stateless component)

**Visual States**:
- **Desktop**: Horizontal layout for links
- **Mobile**: Vertical stack for links
- **Background**: Gray-900 (#111827)
- **Text**: White (#FFFFFF) for contrast

---

## Page Composition (app/page.tsx)

### LandingPageProps

**Interface**:
```typescript
/**
 * Task: T-007
 * Spec: Landing Page Composition
 */
interface LandingPageProps {
  // All content is static, no props needed
}
```

**State**: No internal state (page composed of stateless components)

---

## Type Safety Rules

### Strict TypeScript Requirements

1. **No `any` types**: All interfaces and props must be explicitly typed
2. **Explicit return types**: All functions must have explicit return types
3. **Optional props**: Use optional chaining (`?:`) for optional props
4. **Union types**: Use union types for variant props (e.g., `'primary' | 'secondary'`)
5. **Readonly arrays**: Mark arrays as `readonly` when appropriate

### Example Best Practices

**✅ GOOD - Explicit Types**:
```typescript
interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return <div>...</div>
}
```

**❌ BAD - Implicit Types**:
```typescript
export function FeatureCard({ icon, title, description }: any) {
  return <div>...</div>
}
```

---

## State Management

### Parent State (Landing Page)

The landing page (`app/page.tsx`) should NOT have internal state. All components are stateless.

**Reason**:
- Content is static (no data fetching)
- No user interactions requiring state
- Simpler implementation and testing
- Server components where possible

---

## Component Hierarchy

```
app/page.tsx (Landing Page)
│
├─ components/PublicNavbar (sticky at top)
│  ├─ Links: Home (anchor to hero), Features, Pricing (fake)
│  └─ Actions: Login, Sign Up
│
├─ components/Hero
│  ├─ Headline
│  ├─ Subheadline
│  ├─ CTA Buttons
│  └─ Screenshot/Visual
│
├─ components/HowItWorks
│  └─ Step[] (3-5 steps with numbering)
│
├─ components/FeatureCard[] (3-5 cards)
│
├─ components/CTASection
│  └─ Large CTA button
│
└─ components/Footer
   ├─ App Name + Copyright
   ├─ Links: Login, Sign Up, GitHub, Privacy
   └─ Responsive layout
```

---

## Export Strategy

All component interfaces should be exported for reuse:

```typescript
// Each component file exports:
export type { ComponentProps, RelatedTypes }

// Example:
export type { PublicNavbarProps, NavLink, NavLink }
```

---

## Summary

**Components**: 6 total
- PublicNavbar (stateless)
- Hero (stateless)
- FeatureCard (stateless)
- HowItWorks (stateless)
- CTASection (stateless)
- Footer (stateless)

**Page**: 1 total
- Landing Page (composed of stateless components)

**Type Safety**: Strict TypeScript with no `any` types
**State Management**: Zero internal state (all stateless)

---

**Data Model Complete** ✅

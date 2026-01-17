/**
 * Task: T061
 * Spec: 002-authentication/spec.md - Profile Layout with Auth Guard and Navbar
 */

'use client';

import { ReactNode } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' }
  ];

  return (
    <LayoutWrapper breadcrumbs={breadcrumbs} fullWidth={true}>
      {children}
    </LayoutWrapper>
  );
}
/**
 * Task: T063
 * Spec: Frontend UI Fixes - Breadcrumb Navigation for Profile Sub-Pages
 */

import { ReactNode } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';

export default function PasswordLayout({ children }: { children: ReactNode }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
    { label: 'Change Password', href: '/profile/password' }
  ];

  return (
    <LayoutWrapper breadcrumbs={breadcrumbs} fullWidth={true}>
      {children}
    </LayoutWrapper>
  );
}
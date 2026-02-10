/**
 * Task: TXXX
 * Spec: Audit Trail Page Layout
 */

'use client';

import { ReactNode } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';

export const dynamic = 'force-dynamic';

export default function AuditLayout({
  children,
}: {
  children: ReactNode;
}) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Audit Trail', href: '/audit' }
  ];

  return (
    <LayoutWrapper breadcrumbs={breadcrumbs} fullWidth={false}>
      {children}
    </LayoutWrapper>
  );
}

/**
 * Task: T062
 * Spec: 002-authentication/spec.md - Tasks Layout with Auth Guard and Profile Avatar
 */

'use client'

import { ReactNode } from 'react'
import { LayoutWrapper } from '@/components/LayoutWrapper'

export default function TasksLayout({ children }: { children: ReactNode }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Tasks', href: '/tasks' }
  ]

  return (
    <LayoutWrapper breadcrumbs={breadcrumbs} fullWidth={true}>
      {children}
    </LayoutWrapper>
  )
}

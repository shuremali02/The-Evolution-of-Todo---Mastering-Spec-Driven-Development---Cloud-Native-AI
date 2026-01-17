/**
 * Task: T001
 * Spec: 006 Dashboard
 */

'use client'

import { ReactNode } from 'react'
import { LayoutWrapper } from '@/components/LayoutWrapper'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' }
  ]

  return (
    <LayoutWrapper breadcrumbs={breadcrumbs} fullWidth={true}>
      {children}
    </LayoutWrapper>
  )
}
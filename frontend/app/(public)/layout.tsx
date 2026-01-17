/**
 * Task: T-008
 * Spec: 008-breadcrumbs-layout-fixes/spec.md - Landing page layout with breadcrumbs
 */

import { ReactNode } from 'react'
import { PublicPageLayout } from '@/components/PublicPageLayout'

export default function LandingLayout({ children }: { children: ReactNode }) {
  const breadcrumbs = [
    { label: 'Home', href: '/' }
  ]

  return (
    <PublicPageLayout breadcrumbs={breadcrumbs} fullWidth={true}>
      {children}
    </PublicPageLayout>
  )
}
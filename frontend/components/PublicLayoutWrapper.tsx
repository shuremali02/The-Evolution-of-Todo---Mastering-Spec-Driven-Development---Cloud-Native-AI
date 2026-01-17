/**
 * Task: T-008
 * Spec: 008-breadcrumbs-layout-fixes/spec.md - Public layout wrapper for login/signup pages
 */

import { ReactNode } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PublicLayoutWrapperProps {
  children: ReactNode
  breadcrumbs: BreadcrumbItem[]
  showBreadcrumbs?: boolean
}

export function PublicLayoutWrapper({
  children,
  breadcrumbs,
  showBreadcrumbs = true
}: PublicLayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {showBreadcrumbs && <Breadcrumb items={breadcrumbs} />}
        {children}
      </div>
    </div>
  )
}
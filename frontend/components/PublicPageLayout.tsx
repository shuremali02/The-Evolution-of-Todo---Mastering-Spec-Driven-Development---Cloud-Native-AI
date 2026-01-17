/**
 * Task: T-008
 * Spec: 008-breadcrumbs-layout-fixes/spec.md - Public layout for landing page with breadcrumbs and full-width layout
 */

import { ReactNode } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'
import PublicNavbar from '@/components/PublicNavbar'
import Footer from '@/components/Footer'

interface PublicPageLayoutProps {
  children: ReactNode
  breadcrumbs?: { label: string; href?: string }[]
  showBreadcrumbs?: boolean
  fullWidth?: boolean
}

export function PublicPageLayout({
  children,
  breadcrumbs = [{ label: 'Home', href: '/' }],
  showBreadcrumbs = true,
  fullWidth = false
}: PublicPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PublicNavbar fullWidth={fullWidth} />
      <main className={`${fullWidth ? '' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 w-full flex-grow`}>
        {showBreadcrumbs && <Breadcrumb items={breadcrumbs} />}
        {children}
      </main>
      <Footer fullWidth={fullWidth} />
    </div>
  )
}
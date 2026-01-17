/**
 * Task: T-008
 * Spec: 008-breadcrumbs-layout-fixes/spec.md - Layout wrapper for breadcrumbs and full-width layout
 */

'use client'

import { ReactNode } from 'react'
import { Breadcrumb } from '@/components/Breadcrumb'
import { AuthGuard } from '@/components/AuthGuard'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/app/providers'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LayoutWrapperProps {
  children: ReactNode
  breadcrumbs: BreadcrumbItem[]
  showBreadcrumbs?: boolean
  fullWidth?: boolean
}

export function LayoutWrapper({
  children,
  breadcrumbs,
  showBreadcrumbs = true,
  fullWidth = false
}: LayoutWrapperProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear any potential localStorage tokens too
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      sessionStorage.removeItem('access_token')
    }
    router.push('/') // Redirect to home page after logout
  }

  return (
    <Providers>
      <AuthGuard>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Navbar onLogout={handleLogout} />
          <main className={`${fullWidth ? '' : 'max-w-7xl mx-auto'} px-4 py-8 w-full flex-grow`}>
            {showBreadcrumbs && <Breadcrumb items={breadcrumbs} />}
            {children}
          </main>
          <Footer fullWidth={fullWidth} />
        </div>
      </AuthGuard>
    </Providers>
  )
}
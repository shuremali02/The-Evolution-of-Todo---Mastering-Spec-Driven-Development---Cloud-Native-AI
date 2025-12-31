/**
 * Task: T051, T052, T053
 * Spec: 002-authentication/spec.md - Protected Route Guard (US-3)
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * AuthGuard component that protects routes from unauthenticated access.
 *
 * **Behavior**:
 * 1. Checks if JWT token exists in sessionStorage
 * 2. Shows loading state while checking authentication
 * 3. Redirects to /login if no token found
 * 4. Renders children (protected content) if authenticated
 *
 * **Usage**:
 * Wrap any page or layout that requires authentication:
 * ```tsx
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const isAuth = apiClient.isAuthenticated()

      if (!isAuth) {
        // No token found - redirect to login
        router.push('/login')
        setIsAuthenticated(false)
      } else {
        // Token exists - allow access
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [router])

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - will redirect (show nothing)
  if (!isAuthenticated) {
    return null
  }

  // Authenticated - render protected content
  return <>{children}</>
}

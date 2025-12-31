/**
 * Task: T054
 * Spec: 002-authentication/spec.md - Protected Tasks Layout (US-3)
 */

import { AuthGuard } from '@/components/AuthGuard'

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  )
}

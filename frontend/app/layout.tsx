/**
 * Task: T010
 * Spec: 002-authentication/quickstart.md - Frontend Setup
 */

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hackathon Todo',
  description: 'Multi-user task management application with JWT authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

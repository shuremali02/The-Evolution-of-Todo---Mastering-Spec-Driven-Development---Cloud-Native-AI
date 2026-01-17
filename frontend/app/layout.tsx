/**
 * Task: T010
 * Spec: 002-authentication/quickstart.md - Frontend Setup
 */

import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Hackathon Todo',
  description: 'Multi-user task management application with JWT authentication',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning={true}>
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

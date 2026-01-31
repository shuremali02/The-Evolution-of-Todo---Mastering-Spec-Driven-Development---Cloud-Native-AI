/**
 * Task: T036
 * Spec: Enhanced Chatbot UI with Floating Icon - Root layout with floating chat icon
 */

import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Hackathon Todo',
  description: 'Multi-user task management application with JWT authentication',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

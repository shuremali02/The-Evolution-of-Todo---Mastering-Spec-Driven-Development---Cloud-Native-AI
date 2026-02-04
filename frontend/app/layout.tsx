/**
 * Task: T040, T044
 * Spec: 012-AI-Powered UI Enhancements
 */

import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'AI-Powered Task Manager',
  description: 'AI-enhanced multi-user task management application with intelligent features',
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
      <body className="min-h-screen bg-gradient-ai">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

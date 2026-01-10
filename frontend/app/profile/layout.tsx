/**
 * Task: T061
 * Spec: 002-authentication/spec.md - Profile Layout with Auth Guard and Navbar
 */

'use client';

import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { apiClient } from '@/lib/api';
import { Providers } from '@/app/providers';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear any potential localStorage tokens too
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
    }
    router.push('/'); // Redirect to home page after logout
  };

  return (
    <Providers>
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar onLogout={handleLogout} />
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </AuthGuard>
    </Providers>
  );
}
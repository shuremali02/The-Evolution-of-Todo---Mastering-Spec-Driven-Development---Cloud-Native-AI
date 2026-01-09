/**
 * Task: T038
 * Spec: 002-authentication/spec.md - Auth Guard Component
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../../lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated using the helper function
    const status = isAuthenticated();
    setAuthStatus(status);

    setLoading(false);

    if (!status) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (authStatus === false) {
    return null; // Redirect happens in useEffect
  }

  return <>{children}</>;
};
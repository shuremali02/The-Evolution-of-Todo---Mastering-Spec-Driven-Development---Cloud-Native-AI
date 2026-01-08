/**
 * Task: T038
 * Spec: 002-authentication/spec.md - Auth Guard Component
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to make a request to a protected endpoint to verify auth
        await apiClient.request('/auth/protected');
        setIsAuthenticated(true);
      } catch (error) {
        // If request fails with 401, user is not authenticated
        setIsAuthenticated(false);
        // Redirect to login
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Redirect happens in useEffect
  }

  return <>{children}</>;
};
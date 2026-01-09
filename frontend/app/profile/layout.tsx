/**
 * Task: T061
 * Spec: 002-authentication/spec.md - Profile Layout with Auth Guard
 */

import { AuthGuard } from '@/components/AuthGuard';
import { Providers } from '@/app/providers';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AuthGuard>{children}</AuthGuard>
    </Providers>
  );
}
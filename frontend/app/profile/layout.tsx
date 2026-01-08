/**
 * Task: T061
 * Spec: 002-authentication/spec.md - Profile Layout with Auth Guard
 */

import { AuthGuard } from '@/components/AuthGuard';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
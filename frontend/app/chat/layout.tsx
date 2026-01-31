/**
 * Task: T040
 * Spec: 010-ai-chatbot/spec.md - Chat Layout with Auth Guard
 */

import { AuthGuard } from '@/components/AuthGuard';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
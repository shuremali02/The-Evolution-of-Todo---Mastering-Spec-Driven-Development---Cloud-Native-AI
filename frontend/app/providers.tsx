'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import { FloatingChatIcon } from '@/components/FloatingChatIcon';
import { ChatManager } from '@/components/ChatManager';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          {children}
          <FloatingChatIcon />
          <ChatManager />
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
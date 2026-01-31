/**
 * Task: T036
 * Spec: Enhanced Chatbot UI with Floating Icon - Chat Manager Component
 */

'use client';

import React, { useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { ChatOverlay } from './ChatOverlay';
import ChatInterface from './ChatInterface';

export function ChatManager() {
  const { isChatOpen, closeChat } = useChat();

  // Handle Escape key to close chat
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChatOpen) {
        closeChat();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isChatOpen, closeChat]);

  return (
    <>
      {isChatOpen && (
        <ChatOverlay isOpen={isChatOpen} onClose={closeChat}>
          <ChatInterface />
        </ChatOverlay>
      )}
    </>
  );
}
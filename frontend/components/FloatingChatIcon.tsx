/**
 * Task: T006
 * Spec: Enhanced Chatbot UI with Floating Icon - Floating chat icon component
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiLoader } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { AuthCheckModal } from './AuthCheckModal';

export function FloatingChatIcon() {
  const { user, loading } = useAuth();
  const { openChat } = useChat();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleClick = () => {
    // Wait for auth to finish loading before making decision
    if (loading) {
      // Still loading, do nothing or show a temporary indicator
      return;
    }

    if (!user) {
      setShowAuthModal(true);
    } else {
      openChat();
    }
  };

  // Show a loading state when auth is still initializing
  if (loading) {
    return (
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 bg-gray-400 text-white rounded-full shadow-lg cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        aria-label="Loading chat..."
        role="button"
        disabled={true}
      >
        <FiLoader className="h-6 w-6 animate-spin" />
      </motion.button>
    );
  }

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        aria-label="Open chat"
        role="button"
      >
        <FiMessageCircle className="h-6 w-6" />
      </motion.button>

      {showAuthModal && (
        <AuthCheckModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={() => {
            setShowAuthModal(false);
            // Redirect to login page
            window.location.href = '/login';
          }}
        />
      )}
    </>
  );
}
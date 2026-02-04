/**
 * Task: T030, T031, T032, T037
 * Spec: 012-AI-Powered UI Enhancements
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiLoader, FiStar } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { AuthCheckModal } from './AuthCheckModal';

export function FloatingChatIcon() {
  const { user, loading } = useAuth();
  const { openChat } = useChat();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  // Animation variants for pulsing effect
  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      boxShadow: [
        "0 0 0 0 rgba(100, 149, 237, 0.4)",
        "0 0 0 10px rgba(100, 149, 237, 0)",
        "0 0 0 0 rgba(100, 149, 237, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  };

  // Portal content for the floating icon
  const FloatingIconContent = useMemo(() => {
    // Show a loading state when auth is still initializing
    if (loading) {
      return (
        <motion.button
          className="fixed bottom-6 right-6 z-[10000] p-4 bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(280,65%,60%)] text-white rounded-full shadow-lg cursor-not-allowed glow"
          style={{ pointerEvents: 'auto', position: 'fixed' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
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
      <motion.button
        className="fixed bottom-6 right-6 z-[10000] p-4 bg-gradient-to-r from-[hsl(217,91%,60%)] to-[hsl(280,65%,60%)] text-white rounded-full shadow-lg hover:from-[hsl(217,91%,50%)] hover:to-[hsl(280,65%,50%)] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent border border-white/30 backdrop-blur-sm glow"
        style={{ pointerEvents: 'auto', position: 'fixed' }}
        onClick={handleClick}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        aria-label="Open AI Assistant"
        role="button"
      >
        {/* Pulsing effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          variants={pulseVariants}
          animate="animate"
        />

        {/* Main icon container */}
        <div className="relative z-10 flex items-center justify-center">
          <FiMessageCircle className="h-6 w-6" />
          {/* Sparkle effect */}
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <FiStar className="w-full h-full text-yellow-300" />
          </motion.div>
        </div>
      </motion.button>
    );
  }, [loading, handleClick, pulseVariants]);

  if (!mounted) {
    return null;
  }

  // Render modal outside of the normal DOM hierarchy using a portal
  return (
    <>
      {typeof document !== 'undefined' && createPortal(
        <>
          {FloatingIconContent}
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
        </>,
        document.body
      )}
    </>
  );
}
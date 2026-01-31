/**
 * Task: T017
 * Spec: Enhanced Chatbot UI with Floating Icon - Authentication check modal
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AuthCheckModal({ isOpen, onClose, onLogin }: AuthCheckModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Chat Access Required</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please log in to access the chatbot and manage your tasks with AI assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onLogin}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Login
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
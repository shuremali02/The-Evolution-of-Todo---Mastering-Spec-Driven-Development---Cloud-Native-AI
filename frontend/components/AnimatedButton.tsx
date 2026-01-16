/**
 * Task: T021
 * Spec: Phase 1 UI Enhancements
 */

'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { useReducedMotion } from '@/utils/accessibility';

// Omit motion-specific event handlers that conflict between React and Framer Motion
type ConflictingMotionProps =
  | 'onDragStart' | 'onDrag' | 'onDragEnd' | 'onDragTransitionEnd'
  | 'onAnimationStart' | 'onAnimationComplete' | 'onAnimationIteration'
  | 'whileHover' | 'whileFocus' | 'whileTap' | 'whileDrag'
  | 'variants' | 'transition';

interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ConflictingMotionProps> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    // Define variant styles
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border-transparent',
      secondary: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300 focus:ring-blue-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border-transparent',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-blue-500 border-transparent',
    };

    // Define size styles
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const baseClasses = `
      inline-flex items-center justify-center rounded-md font-medium
      border transition-colors duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variantClasses[variant]} ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''} ${className}
    `;

    // Animation variants
    const buttonVariants: Variants = prefersReducedMotion
      ? {
          rest: { scale: 1 },
          hover: { scale: 1 },
          tap: { scale: 1 },
        }
      : {
          rest: { scale: 1 },
          hover: { scale: 1.02 },
          tap: { scale: 0.98 },
        };

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        variants={buttonVariants}
        whileHover={!prefersReducedMotion && !disabled && !isLoading ? 'hover' : undefined}
        whileTap={!prefersReducedMotion && !disabled && !isLoading ? 'tap' : undefined}
        {...props}
      >
        {icon && (
          <span className={`${children ? 'mr-2' : ''}`}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.span
                  key="spinner"
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className="animate-spin h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </motion.span>
              ) : (
                <motion.span
                  key="icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {icon}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        )}
        <AnimatePresence mode="wait">
          <motion.span
            key={isLoading ? 'loading' : 'content'}
            initial={{ opacity: 0, x: isLoading ? 10 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLoading ? -10 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? 'Processing...' : children}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
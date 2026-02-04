/**
 * Task: T012
 * Spec: Phase 1 UI Enhancements
 */

'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function AnimatedDiv({
  children,
  className = '',
  delay = 0,
  duration = 0.3,
  direction = 'up'
}: AnimatedDivProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
      },
    },
    exit: {
      opacity: 0,
      x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
      transition: {
        duration: duration * 0.8,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  stagger?: number;
  delay?: number;
}

export function AnimatedList({
  children,
  className = '',
  itemClassName = '',
  stagger = 0.05,
  delay = 0
}: AnimatedListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          custom={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: (i: number) => ({
              opacity: 1,
              y: 0,
              transition: {
                delay: delay + i * stagger,
                duration: 0.3,
              },
            }),
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  isVisible: boolean;
  index?: number;
  stagger?: number;
}

export function AnimatedListItem({
  children,
  className = '',
  isVisible = true,
  index = 0,
  stagger = 0.05
}: AnimatedListItemProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            delay: index * stagger,
            duration: 0.3,
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.3
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay,
        duration,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
}

export function SlideIn({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.3
}: SlideInProps) {
  const x = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
  const y = direction === 'up' ? 100 : direction === 'down' ? -100 : 0;

  return (
    <motion.div
      initial={{ x, y, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        delay,
        duration,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
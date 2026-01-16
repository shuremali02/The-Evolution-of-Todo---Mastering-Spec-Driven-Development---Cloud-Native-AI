/**
 * Task: T-XXX
 * Spec: Scroll Animations Component
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollAnimationProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FadeInWhenVisible({
  children,
  delay = 0,
  duration = 0.5,
  distance = 50,
  direction = 'up',
  ...props
}: ScrollAnimationProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
}

export function StaggerContainer({
  children,
  delayChildren = 0,
  staggerChildren = 0.1,
  ...props
}: StaggerContainerProps & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
}

export function StaggerChild({
  children,
  ...props
}: StaggerChildProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInWhenVisibleProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  scaleFrom?: number;
}

export function ScaleInWhenVisible({
  children,
  delay = 0,
  duration = 0.5,
  scaleFrom = 0.8,
  ...props
}: ScaleInWhenVisibleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: scaleFrom }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideInWhenVisible({
  children,
  delay = 0,
  duration = 0.5,
  distance = 50,
  direction = 'up',
  ...props
}: ScrollAnimationProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { x: 0, y: distance };
      case 'down': return { x: 0, y: -distance };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      default: return { x: 0, y: distance };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
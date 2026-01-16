/**
 * Task: T029
 * Spec: Phase 1 UI Enhancements
 */

'use client';

import { Task } from '@/types/task';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '@/utils/accessibility';

interface CalendarEventItemProps {
  task: Task;
  onClick: (e: React.MouseEvent) => void;
}

export function CalendarEventItem({ task, onClick }: CalendarEventItemProps) {
  const prefersReducedMotion = useReducedMotion();

  // Determine color based on priority
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-800 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-800 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-400 text-green-800 dark:text-green-200';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 text-blue-800 dark:text-blue-200';
    }
  };

  // Animation variants
  const itemVariants: Variants = prefersReducedMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        hover: { scale: 1 }
      }
    : {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        hover: { scale: 1.02 }
      };

  return (
    <motion.div
      className={`text-xs p-1 rounded truncate cursor-pointer ${getPriorityColor()} border-l-4`}
      onClick={onClick}
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={!prefersReducedMotion ? 'hover' : undefined}
      transition={{ duration: 0.2 }}
      aria-label={`Task: ${task.title}`}
    >
      <div className="truncate font-medium">{task.title}</div>
    </motion.div>
  );
}
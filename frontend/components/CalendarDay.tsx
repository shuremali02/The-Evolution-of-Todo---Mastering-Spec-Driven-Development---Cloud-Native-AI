/**
 * Task: T028
 * Spec: Phase 1 UI Enhancements
 */

'use client';

import { format, isSameDay, isToday } from 'date-fns';
import { Task } from '@/types/task';
import { CalendarEventItem } from './CalendarEventItem';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '@/utils/accessibility';

interface CalendarDayProps {
  date: Date;
  tasks: Task[];
  isSelected?: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
  onTaskSelect?: (task: Task) => void;
  onTaskCreate?: (date: Date) => void;
}

export function CalendarDay({ date, tasks, isSelected, isCurrentMonth, onClick, onTaskSelect, onTaskCreate }: CalendarDayProps) {
  const prefersReducedMotion = useReducedMotion();

  const handleClick = () => {
    onClick();
  };

  // Animation variants
  const containerVariants: Variants = prefersReducedMotion
    ? {
        hover: {
          backgroundColor: '#f3f4f6',
          scale: 1
        },
      }
    : {
        hover: {
          backgroundColor: '#f3f4f6',
          scale: 1.02
        },
      };

  return (
    <motion.div
      className={`h-full min-h-24 p-1 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      onClick={handleClick}
      variants={containerVariants}
      whileHover={!prefersReducedMotion ? 'hover' : undefined}
    >
      <div className="flex justify-between items-center">
        <div className={`text-right p-1 ${
          isToday(date)
            ? 'bg-blue-500 dark:bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto'
            : isCurrentMonth
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-400 dark:text-gray-400'
        }`}>
          {format(date, 'd')}
        </div>

        {onTaskCreate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTaskCreate(date);
            }}
            className="ml-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-xs"
            aria-label={`Add task for ${format(date, 'yyyy-MM-dd')}`}
          >
            +
          </button>
        )}
      </div>

      <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
        {tasks.slice(0, 4).map((task) => (
          <CalendarEventItem
            key={task.id}
            task={task}
            onClick={(e) => {
              e.stopPropagation();
              if (onTaskSelect) {
                onTaskSelect(task);
              }
            }}
          />
        ))}
        {tasks.length > 4 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 pl-1" title={`${tasks.length} tasks scheduled`}>
            +{tasks.length - 4} more
          </div>
        )}
      </div>
    </motion.div>
  );
}
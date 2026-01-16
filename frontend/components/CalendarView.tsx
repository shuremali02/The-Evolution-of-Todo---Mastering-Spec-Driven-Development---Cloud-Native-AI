/**
 * Task: T027
 * Spec: Phase 1 UI Enhancements
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, addDays } from 'date-fns';
import { Task } from '@/types/task';
import { CalendarDay } from './CalendarDay';
import { CalendarEventItem } from './CalendarEventItem';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '@/utils/accessibility';

interface CalendarViewProps {
  tasks: Task[];
  onTaskSelect?: (task: Task) => void;
  onDateSelect?: (date: Date) => void;
  onTaskCreate?: (date: Date) => void;
  selectedDate?: Date;
}

export function CalendarView({ tasks, onTaskSelect, onDateSelect, onTaskCreate, selectedDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const calendarRef = useRef<HTMLDivElement>(null);

  // Add keyboard navigation for calendar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          // Navigate to previous month with Ctrl/Cmd + ArrowLeft
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setCurrentDate(subMonths(currentDate, 1));
          }
          break;
        case 'ArrowRight':
          // Navigate to next month with Ctrl/Cmd + ArrowRight
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setCurrentDate(addMonths(currentDate, 1));
          }
          break;
        case 't':
          // Go to today with Ctrl/Cmd + T
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setCurrentDate(new Date());
          }
          break;
        default:
          break;
      }
    };

    const calendarContainer = calendarRef.current;
    if (calendarContainer) {
      calendarContainer.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (calendarContainer) {
        calendarContainer.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [currentDate]);

  const currentMonthStart = startOfMonth(currentDate);
  const currentMonthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(currentMonthStart);
  const endDate = endOfWeek(currentMonthEnd);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    tasks.forEach(task => {
      if (task.due_date) {
        const dateKey = format(new Date(task.due_date), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  // Generate all days in the calendar view
  const calendarDays = useMemo(() => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(new Date(day)); // Create new Date object to prevent mutation
      day = addDays(day, 1);
    }

    return days;
  }, [startDate, endDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Animation variants
  const containerVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0,
          },
        },
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.02,
          },
        },
      };

  const dayVariants: Variants = prefersReducedMotion
    ? {
        hidden: { y: 0, opacity: 1 },
        visible: { y: 0, opacity: 1 },
      }
    : {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={calendarRef} className="bg-white rounded-lg shadow-md overflow-hidden" tabIndex={0} aria-label="Calendar view">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <motion.div
        className="grid grid-cols-7"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {calendarDays.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate[dateKey] || [];

          return (
            <motion.div
              key={dateKey}
              variants={dayVariants}
              className={`min-h-24 border-r border-b p-1 ${
                index % 7 === 6 ? 'border-r-0' : ''
              } ${!isSameMonth(day, currentDate) ? 'bg-gray-50' : 'bg-white'}`}
            >
              <CalendarDay
                date={day}
                tasks={dayTasks}
                isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
                isCurrentMonth={isSameMonth(day, currentDate)}
                onClick={() => handleDateClick(day)}
                onTaskSelect={onTaskSelect}
                onTaskCreate={onTaskCreate}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
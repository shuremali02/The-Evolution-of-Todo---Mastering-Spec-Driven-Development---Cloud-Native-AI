/**
 * Task: T050, T051, T052, T053, T054, T055, T056, T057
 * Spec: 012-AI-Powered UI Enhancements
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useAriaAnnouncer, useReducedMotion } from '@/utils/accessibility';
import { Task } from '@/types/task';
import { apiClient } from '@/lib/api';
import { motion, Variants } from 'framer-motion';
import { FiCheck, FiTrash2, FiChevronDown, FiChevronUp, FiZap, FiActivity, FiInfo, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

interface TaskCardDnDProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  index: number;
  totalItems: number;
}

export function TaskCardDnD({
  task,
  onComplete,
  onDelete,
  onEdit,
  onMove,
  index,
  totalItems
}: TaskCardDnDProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandleFocused, setDragHandleFocused] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const { startDrag, overItem, endDrag } = useDragDrop();
  const prefersReducedMotion = useReducedMotion();
  const { announce } = useAriaAnnouncer();
  const dragHandleRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate AI data for demonstration
  const aiPriorityScore = Math.floor(Math.random() * 10) + 1; // Random score 1-10
  const aiConfidence = Math.floor(Math.random() * 40) + 60; // Random confidence 60-99%
  const aiSuggestions = [
    "Consider breaking this into smaller subtasks",
    "This task might be a prerequisite for others",
    "You've completed similar tasks in 2 days average"
  ];

  // Announce when dragging starts/stops
  useEffect(() => {
    if (isDragging) {
      announce(`Moving task "${task.title}". Use arrow keys to move, enter to drop, escape to cancel.`);
    }
  }, [isDragging, task.title, announce]);

  const handleDragStart = () => {
    setIsDragging(true);
    startDrag(task.id);
    announce(`Started dragging task "${task.title}". Press arrow keys to move.`);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    endDrag();
    announce(`Finished moving task "${task.title}".`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    overItem(task.id);
  };

  // Handle keyboard-based drag and drop
  const handleKeyDown = (e: React.KeyboardEvent, action: 'moveUp' | 'moveDown' | 'grab' | 'drop') => {
    if (e.key === ' ' && action === 'grab') {
      e.preventDefault();
      handleDragStart();
    } else if (e.key === 'Enter' && action === 'drop' && isDragging) {
      e.preventDefault();
      handleDragEnd();
    } else if (e.key === 'Escape' && isDragging) {
      e.preventDefault();
      setIsDragging(false);
      endDrag();
      announce(`Cancelled moving task "${task.title}".`);
    } else if (e.key === 'ArrowUp' && action === 'moveUp' && isDragging) {
      e.preventDefault();
      if (index > 0) {
        onMove(index, index - 1);
        announce(`Moved task "${task.title}" up to position ${index}.`);
      }
    } else if (e.key === 'ArrowDown' && action === 'moveDown' && isDragging) {
      e.preventDefault();
      if (index < totalItems - 1) {
        onMove(index, index + 1);
        announce(`Moved task "${task.title}" down to position ${index + 2}.`);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await apiClient.updateTask(task.id, {
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  // Get AI-enhanced background based on priority and AI score
  const getAIEnhancedBackground = () => {
    if (isDragging) return 'bg-white shadow-xl';

    // Enhanced background with AI indicators
    let bgColor = getPriorityColor(task.priority);
    if (aiPriorityScore >= 8) {
      bgColor += ' border-l-[#4A90E2] bg-gradient-to-r from-blue-50 to-indigo-50'; // High AI priority
    } else if (aiPriorityScore >= 5) {
      bgColor += ' border-l-[#7B61FF] bg-gradient-to-r from-purple-50 to-pink-50'; // Medium AI priority
    }
    return bgColor;
  };

  // Animation variants
  const cardVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    dragging: {
      scale: 1.02,
      boxShadow: '0 10px 25px rgba(100, 149, 237, 0.25)',
      zIndex: 10
    }
  };

  // Generate ARIA description for drag and drop
  const dragDropDescription = `${task.title}. Item ${index + 1} of ${totalItems}. Press spacebar to grab, arrow keys to move, enter to drop, escape to cancel.`;

  return (
    <motion.div
      ref={containerRef}
      variants={prefersReducedMotion ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 1, y: 0 }, dragging: { scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: 'auto' } } : cardVariants}
      animate={isDragging ? 'dragging' : 'animate'}
      layout
      transition={{ duration: 0.2 }}
      className={`relative border-l-4 rounded-r-lg shadow-sm transition-all duration-200 glow ${
        getAIEnhancedBackground()
      }`}
      role="listitem"
      aria-grabbed={isDragging}
      aria-setsize={totalItems}
      aria-posinset={index + 1}
      aria-describedby={`task-${task.id}-description drag-instructions-${task.id}`}
    >
      {/* AI Priority Indicator */}
      <div className="absolute -top-2 -right-2 bg-gradient-ai rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white">
        <FiZap className="text-white text-sm" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {aiPriorityScore}
        </span>
      </div>

      {/* Drag handle - visually hidden but accessible */}
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          ref={dragHandleRef}
          className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            dragHandleFocused ? 'bg-blue-100' : 'bg-gray-100'
          }`}
          onMouseDown={handleDragStart}
          onKeyDown={(e) => handleKeyDown(e, 'grab')}
          onFocus={() => setDragHandleFocused(true)}
          onBlur={() => setDragHandleFocused(false)}
          aria-label={`Drag task "${task.title}" to reorder`}
          aria-describedby={`task-${task.id}-description drag-instructions-${task.id}`}
          aria-pressed={isDragging}
          aria-dropeffect={isDragging ? "move" : "none"}
        >
          <svg className="text-gray-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 5h8M8 12h8M8 19h8" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Edit task title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              aria-label="Edit task description"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-gradient-ai text-white rounded-md hover:from-[hsl(217,91%,50%)] hover:to-[hsl(280,65%,50%)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Save changes"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onComplete(task.id)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  />
                  <h3
                    className={`text-lg font-medium truncate ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* AI Confidence Indicator */}
                  <div className="ml-2 flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    <FiTrendingUp className="mr-1" />
                    {aiConfidence}%
                  </div>
                </div>

                {task.description && (
                  <p className={`mt-1 text-gray-600 ${isExpanded ? '' : 'truncate'}`}>
                    {task.description}
                  </p>
                )}

                {task.description && task.description.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
                  >
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                )}

                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {task.priority && (
                    <span className={`px-2 py-1 rounded-full text-white ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                  {task.due_date && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}

                  {/* AI Optimization Indicator */}
                  <span className="px-2 py-1 bg-gradient-ai text-white rounded-full flex items-center">
                    <FiInfo className="mr-1 text-xs" />
                    AI Optimized
                  </span>
                </div>

                {/* AI Suggestions Preview */}
                <div className="mt-3 flex items-center text-xs text-gray-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                  <FiActivity className="mr-1 text-blue-500" />
                  <span>AI suggests: {aiSuggestions[0]}</span>
                  <button
                    onClick={() => setShowAISuggestions(!showAISuggestions)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    aria-label={showAISuggestions ? "Hide AI suggestions" : "Show AI suggestions"}
                  >
                    {showAISuggestions ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>

                {/* AI Suggestions Expanded */}
                {showAISuggestions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 p-3 bg-gradient-ai text-white rounded-lg text-sm"
                  >
                    <div className="flex items-center mb-2">
                      <FiAlertTriangle className="mr-2" />
                      <strong>AI Recommendations</strong>
                    </div>
                    <ul className="space-y-1 pl-5 list-disc">
                      {aiSuggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => onEdit(task)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Edit task "${task.title}"`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Delete task "${task.title}"`}
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Hidden description for screen readers */}
            <div id={`task-${task.id}-description`} className="sr-only">
              {task.description ? `Description: ${task.description}` : 'No description'}
              {`. Priority: ${task.priority}. ${task.due_date ? `Due date: ${task.due_date}` : 'No due date'}.`}
              {`. AI Priority Score: ${aiPriorityScore}. AI Confidence: ${aiConfidence}%.`}
            </div>
          </>
        )}
      </div>

      {/* Drag and drop keyboard instructions for screen readers */}
      <div className="sr-only" id={`drag-instructions-${task.id}`}>
        To move this task, focus the drag handle, press Space to grab, use Arrow keys to move, press Enter to drop, or Escape to cancel.
      </div>
    </motion.div>
  );
}
/**
 * Task: T023
 * Spec: Enhanced Chatbot UI with Floating Icon - Quick task suggestions component
 */

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface QuickSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

export function QuickSuggestions({ onSelectSuggestion }: QuickSuggestionsProps) {
  const suggestions = [
    "Add a new task",
    "Show my tasks",
    "Complete task [task name/id]",
    "Update task [task name/id]",
    "Delete task [task name/id]",
    "Show completed tasks",
    "Set deadline for [task name]"
  ];

  const [expanded, setExpanded] = useState(false);

  // Show only first 3 suggestions by default, expand to show all on mobile
  const visibleSuggestions = expanded ? suggestions : suggestions.slice(0, 3);

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Quick suggestions:</h4>
        {suggestions.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={expanded ? "Collapse suggestions" : "Expand suggestions"}
          >
            {expanded ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              onSelectSuggestion(suggestion);
              // On mobile, collapse after selection
              if (window.innerWidth < 768) {
                setExpanded(false);
              }
            }}
            className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Show expand button on desktop too if there are more than 3 */}
      {suggestions.length > 3 && !expanded && (
        <div className="hidden md:block mt-2">
          <button
            onClick={() => setExpanded(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + {suggestions.length - 3} more suggestions
          </button>
        </div>
      )}
    </div>
  );
}
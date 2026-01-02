/**
 * Task: T050
 * Spec: 005-task-management-ui/tasks.md - SortDropdown Component
 *
 * Professional sort dropdown with:
 * - Multiple sort options
 * - Direction toggle
 * - Keyboard navigation
 * - Clear active state
 */

'use client'

import { useState, useRef, useEffect } from 'react'

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'title-asc'
  | 'title-desc'
  | 'priority-high'
  | 'priority-low'
  | 'due-date'
  | 'completed'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
  className?: string
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'newest', label: 'Newest First', icon: '📅' },
  { value: 'oldest', label: 'Oldest First', icon: '📅' },
  { value: 'title-asc', label: 'Title (A-Z)', icon: '🔤' },
  { value: 'title-desc', label: 'Title (Z-A)', icon: '🔤' },
  { value: 'priority-high', label: 'Priority (High First)', icon: '⚡' },
  { value: 'priority-low', label: 'Priority (Low First)', icon: '⚡' },
  { value: 'due-date', label: 'Due Date', icon: '📆' },
  { value: 'completed', label: 'Completed First', icon: '✅' },
]

export function SortDropdown({ value, onChange, className = '' }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value)

  return (
    <div ref={dropdownRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        aria-label="Sort tasks"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        <span className="hidden sm:inline">
          {selectedOption?.label || 'Sort'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none">
          <ul
            role="listbox"
            aria-label="Sort options"
            className="py-1"
          >
            {SORT_OPTIONS.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    option.value === value
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="flex-1 text-left">{option.label}</span>
                  {option.value === value && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

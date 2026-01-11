'use client';

import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
  onSearch?: (query: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  loading = false,
  autoFocus = false,
  debounceMs = 300,
  onSearch
}) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Trigger search if we have a search callback
    if (onSearch && newValue.trim().length > 0) {
      // Debounce the search
      if ((window as any).__searchTimeout) {
        clearTimeout((window as any).__searchTimeout);
      }
      (window as any).__searchTimeout = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          focused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
        aria-label="Search input"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
        {loading ? (
          <LoadingSpinner size="sm" label="" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
    </div>
  );
};
/**
 * Task: T-009
 * Spec: Add proper logo to application navbars and favicon
 */

import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  permanentWhite?: boolean;
}

export function AppLogo({ size = 'md', className = '', permanentWhite = false }: AppLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        className={`${sizeClasses[size]} mr-2`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor"/>
      </svg>
      <span className={`text-xl font-bold ${permanentWhite ? 'text-white' : 'text-gray-900 dark:text-white'} tracking-tight`}>
        Todo App
      </span>
    </div>
  );
}
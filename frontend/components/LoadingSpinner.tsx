'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  variant?: 'default' | 'overlay' | 'inline';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = {
    default: '',
    overlay: 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50',
    inline: 'inline-block',
  };

  return (
    <div className={containerClasses[variant]}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-blue-500 border-t-transparent`} role="status">
        <span className="sr-only">{label}</span>
      </div>
      {variant !== 'overlay' && <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{label}</span>}
    </div>
  );
};
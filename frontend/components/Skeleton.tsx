'use client';

import React from 'react';

interface SkeletonProps {
  height?: string;
  width?: string;
  shape?: 'rectangle' | 'circle' | 'text';
  animation?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = 'h-4',
  width = 'w-full',
  shape = 'rectangle',
  animation = true,
  className = ''
}) => {
  const shapeClasses = {
    rectangle: `${height} ${width}`,
    circle: 'rounded-full',
    text: 'h-4 rounded',
  };

  const animationClass = animation ? 'animate-pulse' : '';

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 ${shapeClasses[shape]} ${animationClass} ${className}`}
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Loading content</span>
    </div>
  );
};
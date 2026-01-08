/**
 * Task: T041
 * Spec: 002-authentication/spec.md - Avatar Component
 */

import React from 'react';

interface AvatarProps {
  username: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  username,
  size = 'md',
  className = ''
}) => {
  // Get the first letter of the username and make it uppercase
  const avatarLetter = username?.[0]?.toUpperCase() || '?';

  // Define size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div
      className={`
        flex items-center justify-center rounded-full bg-blue-500 text-white font-bold
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {avatarLetter}
    </div>
  );
};
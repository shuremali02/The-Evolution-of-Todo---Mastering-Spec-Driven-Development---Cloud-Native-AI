/**
 * Task: T090
 * Spec: 005-task-management-ui/tasks.md - SkeletonTaskCard Component
 *
 * Loading placeholder that mimics TaskCard structure:
 * - Shimmer animation
 * - Same dimensions as TaskCard
 * - Professional appearance
 */

'use client'

import { Skeleton } from './Skeleton';

export function SkeletonTaskCard() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-white animate-pulse">
      {/* Checkbox skeleton */}
      <Skeleton width="w-5" height="h-5" shape="circle" />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton width="w-16" height="h-5" shape="rectangle" />
          <Skeleton width="w-14" height="h-5" shape="rectangle" />
          <Skeleton width="w-24" height="h-5" shape="rectangle" />
        </div>

        {/* Title skeleton */}
        <Skeleton width="w-3/4" height="h-5" className="mb-2" />

        {/* Description skeleton */}
        <Skeleton width="w-full" height="h-4" className="mb-1" />
        <Skeleton width="w-2/3" height="h-4" className="mb-3" />

        {/* Date skeleton */}
        <Skeleton width="w-24" height="h-3" />
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Skeleton width="w-8" height="h-8" shape="circle" />
        <Skeleton width="w-8" height="h-8" shape="circle" />
      </div>
    </div>
  )
}

export function SkeletonTaskList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTaskCard key={i} />
      ))}
    </div>
  )
}

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

export function SkeletonTaskCard() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-white animate-pulse">
      {/* Checkbox skeleton */}
      <div className="w-5 h-5 rounded border-2 border-gray-200 bg-gray-100" />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-16 h-5 rounded-full bg-gray-200" />
          <div className="w-14 h-5 rounded-full bg-gray-200" />
          <div className="w-24 h-5 rounded-full bg-gray-200" />
        </div>

        {/* Title skeleton */}
        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />

        {/* Description skeleton */}
        <div className="h-4 w-full bg-gray-100 rounded mb-1" />
        <div className="h-4 w-2/3 bg-gray-100 rounded mb-3" />

        {/* Date skeleton */}
        <div className="h-3 w-24 bg-gray-100 rounded" />
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gray-200" />
        <div className="w-8 h-8 rounded-lg bg-gray-200" />
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

/**
 * Task: T070
 * Spec: 005-task-management-ui/tasks.md - useKeyboardShortcuts Hook
 *
 * React hook for managing keyboard shortcuts with:
 * - Multiple shortcut combinations
 * - Focus-aware handling
 * - Clean up on unmount
 */

'use client'

import { useEffect, useCallback } from 'react'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  callback: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const { key, ctrl, shift, alt, meta, callback } = shortcut

        // Check modifiers
        const ctrlMatch = ctrl ? event.ctrlKey : !event.ctrlKey && !event.metaKey
        const shiftMatch = shift ? event.shiftKey : !event.shiftKey
        const altMatch = alt ? event.altKey : !event.altKey
        const metaMatch = meta ? event.metaKey : !event.metaKey

        // Check main key (case-insensitive)
        const keyMatch = event.key.toLowerCase() === key.toLowerCase()

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault()
          callback()
          return
        }
      }
    },
    [shortcuts]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Preset shortcuts for the tasks page
export const TASK_SHORTCUTS = [
  {
    key: 'n',
    ctrl: true,
    callback: () => {},
    description: 'Create new task',
  },
  {
    key: '/',
    callback: () => {},
    description: 'Focus search',
  },
  {
    key: 'Escape',
    callback: () => {},
    description: 'Close form/dialog',
  },
] as const

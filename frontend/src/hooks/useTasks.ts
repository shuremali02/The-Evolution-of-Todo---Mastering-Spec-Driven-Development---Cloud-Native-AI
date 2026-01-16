/**
 * Task: T004
 * Spec: 005-task-management-ui/tasks.md - useTasks Custom Hook
 *
 * Custom hook for managing task data and operations.
 * Provides task list state and CRUD actions.
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import type { Task, TaskCreate, TaskUpdate } from '@/types/task'

/**
 * Task operation loading states
 */
export type TaskOperation = 'idle' | 'loading' | 'creating' | 'updating' | 'deleting' | 'completing'

/**
 * useTasks hook return type
 */
interface UseTasksReturn {
  // Task data
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  loading: boolean
  error: string | null

  // Operation state
  operation: TaskOperation

  // CRUD operations
  fetchTasks: () => Promise<void>
  createTask: (data: TaskCreate) => Promise<Task>
  updateTask: (id: string, data: TaskUpdate) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
  completeTask: (id: string) => Promise<Task>

  // Utilities
  clearError: () => void
  refreshTasks: () => Promise<void>
}

/**
 * Custom hook for managing task list and operations.
 *
 * **Provides**:
 * - Task list state management
 * - CRUD operations with automatic state updates
 * - Loading and error states
 * - Automatic task list refresh after operations
 *
 * **Usage**:
 * ```tsx
 * const { tasks, loading, createTask, completeTask } = useTasks()
 *
 * useEffect(() => {
 *   fetchTasks()
 * }, [])
 * ```
 */
export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [operation, setOperation] = useState<TaskOperation>('idle')

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Fetch all tasks for the authenticated user
   */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getTasks()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Refresh tasks (alias for fetchTasks)
   */
  const refreshTasks = useCallback(async () => {
    await fetchTasks()
  }, [fetchTasks])

  /**
   * Create a new task
   */
  const createTask = useCallback(async (data: TaskCreate): Promise<Task> => {
    try {
      setOperation('creating')
      setError(null)
      const newTask = await apiClient.createTask(data)
      setTasks((prev) => [newTask, ...prev]) // Add to beginning (newest first)
      return newTask
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task'
      setError(message)
      throw new Error(message)
    } finally {
      setOperation('idle')
    }
  }, [])

  /**
   * Update an existing task
   */
  const updateTask = useCallback(async (id: string, data: TaskUpdate): Promise<Task> => {
    try {
      setOperation('updating')
      setError(null)
      const updatedTask = await apiClient.updateTask(id, data)
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
      return updatedTask
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task'
      setError(message)
      throw new Error(message)
    } finally {
      setOperation('idle')
    }
  }, [])

  /**
   * Delete a task
   */
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      setOperation('deleting')
      setError(null)
      await apiClient.deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task'
      setError(message)
      throw new Error(message)
    } finally {
      setOperation('idle')
    }
  }, [])

  /**
   * Mark a task as complete
   */
  const completeTask = useCallback(async (id: string): Promise<Task> => {
    try {
      setOperation('completing')
      setError(null)
      const updatedTask = await apiClient.completeTask(id)
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
      return updatedTask
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete task'
      setError(message)
      throw new Error(message)
    } finally {
      setOperation('idle')
    }
  }, [])

  return {
    tasks,
    setTasks,
    loading,
    error,
    operation,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    clearError,
    refreshTasks,
  }
}

/**
 * Hook for managing a single task's operations
 */
export function useTask(taskId: string) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [operation, setOperation] = useState<TaskOperation>('idle')

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getTask(taskId)
      setTask(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task')
    } finally {
      setLoading(false)
    }
  }, [taskId])

  const update = useCallback(
    async (data: TaskUpdate): Promise<Task> => {
      try {
        setOperation('updating')
        setError(null)
        const updated = await apiClient.updateTask(taskId, data)
        setTask(updated)
        return updated
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update task'
        setError(message)
        throw new Error(message)
      } finally {
        setOperation('idle')
      }
    },
    [taskId]
  )

  const complete = useCallback(async (): Promise<Task> => {
    try {
      setOperation('completing')
      setError(null)
      const updated = await apiClient.completeTask(taskId)
      setTask(updated)
      return updated
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete task'
      setError(message)
      throw new Error(message)
    } finally {
      setOperation('idle')
    }
  }, [taskId])

  const remove = useCallback(async () => {
    try {
      setOperation('deleting')
      setError(null)
      await apiClient.deleteTask(taskId)
      setTask(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task'
      setError(message)
      throw new Error(message)
    } finally {
      setOperation('idle')
    }
  }, [taskId])

  return {
    task,
    setTask,
    loading,
    error,
    operation,
    fetchTask,
    update,
    complete,
    remove,
  }
}

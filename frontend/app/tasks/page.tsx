/**
 * Task: T009, T011, T013, T016, T018, T019, T021, T037
 * Spec: 005-task-management-ui/tasks.md - Tasks Page (Professional UI)
 *
 * Professional tasks page with:
 * - Clean, modern UI
 * - Filter toggle (All, Active, Completed)
 * - Task cards with status indicators
 * - Smooth interactions
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import type { Task, TaskCreate, TaskUpdate } from '@/types/task'
import { TaskCard } from '@/components/TaskCard'
import { TaskForm } from '@/components/TaskForm'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EmptyState } from '@/components/EmptyState'
import { ErrorBanner } from '@/components/ErrorState'
import { SearchBar } from '@/components/SearchBar'
import { SortDropdown, type SortOption } from '@/components/SortDropdown'
import { Toaster, toast } from 'react-hot-toast'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { SkeletonTaskList } from '@/components/SkeletonTaskCard'
import { AnimatePresence, motion } from 'framer-motion'

type FilterType = 'all' | 'active' | 'completed'

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      callback: () => {
        if (!showForm && !editingTask && !deleteConfirm) {
          setShowForm(true)
        }
      },
      description: 'Create new task',
    },
    {
      key: 'Escape',
      callback: () => {
        if (showForm) {
          setShowForm(false)
        } else if (editingTask) {
          setEditingTask(null)
        } else if (deleteConfirm) {
          setDeleteConfirm(null)
        }
      },
      description: 'Close form/dialog',
    },
  ])

  // Operation tracking
  const [operations, setOperations] = useState<{
    creating: boolean
    updating: string | null
    deleting: string | null
  }>({
    creating: false,
    updating: null,
    deleting: null,
  })

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getTasks()
      // Ensure data is an array
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTask(data: TaskCreate) {
    setOperations((prev) => ({ ...prev, creating: true }))
    try {
      const newTask = await apiClient.createTask(data)
      setTasks((prev) => [newTask, ...prev])
      setShowForm(false)
      toast.success('Task created successfully!')
    } catch (err) {
      toast.error('Failed to create task. Please try again.')
      throw err
    } finally {
      setOperations((prev) => ({ ...prev, creating: false }))
    }
  }

  async function handleUpdateTask(data: TaskUpdate) {
    if (!editingTask) return
    setOperations((prev) => ({ ...prev, updating: editingTask.id }))
    try {
      const updatedTask = await apiClient.updateTask(editingTask.id, data)
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
      setEditingTask(null)
      toast.success('Task updated successfully!')
    } catch (err) {
      toast.error('Failed to update task. Please try again.')
      throw err
    } finally {
      setOperations((prev) => ({ ...prev, updating: null }))
    }
  }

  async function handleToggleComplete(taskId: string) {
    setOperations((prev) => ({ ...prev, updating: taskId }))
    try {
      const updatedTask = await apiClient.completeTask(taskId)
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
      if (updatedTask.completed) {
        toast.success('Task marked as completed!')
      } else {
        toast('Task marked as active', { icon: '📋' })
      }
    } catch (err) {
      console.error('Failed to complete task:', err)
      setError('Failed to update task. Please try again.')
      toast.error('Failed to update task.')
    } finally {
      setOperations((prev) => ({ ...prev, updating: null }))
    }
  }

  async function handleDeleteTask(taskId: string) {
    setOperations((prev) => ({ ...prev, deleting: taskId }))
    try {
      await apiClient.deleteTask(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      setDeleteConfirm(null)
      toast.success('Task deleted successfully!')
    } catch (err) {
      console.error('Failed to delete task:', err)
      setError('Failed to delete task. Please try again.')
      toast.error('Failed to delete task.')
    } finally {
      setOperations((prev) => ({ ...prev, deleting: null }))
    }
  }

  function startEdit(task: Task) {
    setEditingTask(task)
    setShowForm(false)
  }

  function cancelEdit() {
    setEditingTask(null)
  }

  function handleDeleteClick(taskId: string) {
    setDeleteConfirm(taskId)
  }

  function cancelDelete() {
    setDeleteConfirm(null)
  }

  function dismissError() {
    setError(null)
  }

  const completedCount = (tasks || []).filter((t) => t.completed).length
  const activeCount = (tasks || []).filter((t) => !t.completed).length
  const isCreating = operations.creating
  const isUpdating = (id: string) => operations.updating === id
  const isDeleting = (id: string) => operations.deleting === id

  // Filter and sort tasks
  const filteredTasks = (tasks || [])
    .filter((task) => {
      // Status filter
      if (filter === 'active') return !task.completed
      if (filter === 'completed') return task.completed

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const titleMatch = task.title.toLowerCase().includes(searchLower)
        const descMatch = task.description?.toLowerCase().includes(searchLower)
        if (!titleMatch && !descMatch) return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort
      switch (sort) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        case 'priority-high':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'priority-low':
          const priorityOrderLow = { high: 3, medium: 2, low: 1 }
          return priorityOrderLow[a.priority] - priorityOrderLow[b.priority]
        case 'due-date':
          if (!a.due_date && !b.due_date) return 0
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        case 'completed':
          return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
        default:
          return 0
      }
    })

  const filterCounts = {
    all: tasks.length,
    active: activeCount,
    completed: completedCount,
  }

  // Loading state
  if (loading) {
    return (
      <div>
        {/* Header skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="mb-6 flex justify-between">
          <div className="flex gap-1">
            <div className="w-16 h-10 bg-gray-200 rounded-lg" />
            <div className="w-20 h-10 bg-gray-100 rounded-lg" />
            <div className="w-24 h-10 bg-gray-100 rounded-lg" />
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-lg" />
        </div>

        {/* Task list skeleton */}
        <SkeletonTaskList count={5} />
      </div>
    )
  }

  return (
    <div>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.75rem',
            padding: '1rem',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-gray-500">
                <span className="text-blue-600 font-medium">{activeCount}</span> active
              </p>
              <p className="text-sm text-gray-500">
                <span className="text-green-600 font-medium">{completedCount}</span> completed
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {tasks.length > 0 && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-12 h-2 bg-blue-500 rounded-full overflow-hidden" title="Active">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: '100%' }} />
                </div>
                <div className="w-12 h-2 bg-green-500 rounded-full overflow-hidden" title="Completed">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${(completedCount / tasks.length) * 100}%` }} />
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {Math.round((completedCount / tasks.length) * 100)}%
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={fetchTasks}
          onDismiss={dismissError}
        />
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Filter Tabs */}
          {tasks.length > 0 && (
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
              {(['all', 'active', 'completed'] as FilterType[]).map((f) => {
                const config = {
                  all: { bg: 'bg-gray-200', text: 'text-gray-800', activeBg: 'bg-white', activeText: 'text-blue-600' },
                  active: { bg: 'bg-blue-100', text: 'text-blue-700', activeBg: 'bg-white', activeText: 'text-blue-700' },
                  completed: { bg: 'bg-green-100', text: 'text-green-700', activeBg: 'bg-white', activeText: 'text-green-700' },
                }[f]

                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                      filter === f
                        ? `${config.activeBg} ${config.activeText} shadow-sm`
                        : `${config.bg} ${config.text} hover:opacity-80`
                    }`}
                  >
                    {f} ({filterCounts[f]})
                  </button>
                )
              })}
            </div>
          )}

          {/* Search */}
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search tasks..."
            className="w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* New Task Button */}
          {!showForm && !editingTask && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          )}

          {/* Sort Dropdown */}
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-6">
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
            submitLabel="Add Task"
            loading={isCreating}
          />
        </div>
      )}

      {/* Edit Form */}
      {editingTask && (
        <div className="mb-6">
          <TaskForm
            initialData={{
              title: editingTask.title,
              description: editingTask.description,
              priority: editingTask.priority,
              due_date: editingTask.due_date,
            }}
            onSubmit={handleUpdateTask}
            onCancel={cancelEdit}
            submitLabel="Save Changes"
            loading={isUpdating(editingTask.id)}
          />
        </div>
      )}

      {/* Task List */}
      <section>
        {filteredTasks.length === 0 ? (
          <EmptyState onAction={() => setShowForm(true)} />
        ) : (
          <motion.div
            className="space-y-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard
                    task={task}
                    onComplete={handleToggleComplete}
                    onDelete={handleDeleteClick}
                    onEdit={startEdit}
                    loadingOperations={{
                      complete: isUpdating(task.id),
                      delete: isDeleting(task.id),
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Task?"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => handleDeleteTask(deleteConfirm)}
          onCancel={cancelDelete}
          variant="danger"
        />
      )}
    </div>
  )
}

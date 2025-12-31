/**
 * Task: T023-T025, T028-T030, T038-T041, T044-T046, T049-T052
 * Spec: 003-task-crud - Tasks Page (All User Stories)
 *
 * Complete task management page with:
 * - US-1: View all tasks
 * - US-2: Create task
 * - US-3: View single task details
 * - US-4: Update task
 * - US-5: Toggle completion
 * - US-6: Delete task
 */

'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import type { Task, TaskCreate, TaskUpdate } from '@/types/task'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
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
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    try {
      setFormLoading(true)
      setFormError(null)

      const taskData: TaskCreate = {
        title: title.trim(),
        description: description.trim() || null,
      }

      const newTask = await apiClient.createTask(taskData)
      setTasks([newTask, ...tasks]) // Add to beginning (newest first)
      setTitle('')
      setDescription('')
      setShowForm(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleUpdateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!editingTask || !title.trim()) return

    try {
      setFormLoading(true)
      setFormError(null)

      const updateData: TaskUpdate = {
        title: title.trim(),
        description: description.trim() || null,
      }

      const updatedTask = await apiClient.updateTask(editingTask.id, updateData)
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
      setEditingTask(null)
      setTitle('')
      setDescription('')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleToggleComplete(taskId: string) {
    try {
      const updatedTask = await apiClient.completeTask(taskId)
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
    } catch (err) {
      console.error('Failed to complete task:', err)
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await apiClient.deleteTask(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  function startEdit(task: Task) {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description || '')
    setShowForm(false)
  }

  function cancelEdit() {
    setEditingTask(null)
    setTitle('')
    setDescription('')
  }

  const completedCount = tasks.filter(t => t.completed).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
              <p className="mt-1 text-sm text-gray-600">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total, {completedCount} completed
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowForm(!showForm)
                  setEditingTask(null)
                  setTitle('')
                  setDescription('')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {showForm ? 'Cancel' : '+ New Task'}
              </button>
              <button
                onClick={() => apiClient.logout()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Create/Edit Form */}
        {(showForm || editingTask) && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {formError}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter task title..."
                />
                <p className="mt-1 text-xs text-gray-500">{title.length}/200 characters</p>
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter task description..."
                />
                <p className="mt-1 text-xs text-gray-500">{description.length}/1000 characters</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={formLoading || !title.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {formLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                </button>
                {editingTask && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-6">Create your first task to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white p-6 rounded-lg shadow hover:shadow-lg transition ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      {task.completed && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className={`mt-2 ml-8 text-gray-600 ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    )}
                    <p className="mt-2 ml-8 text-xs text-gray-400">
                      Created {new Date(task.created_at).toLocaleDateString()} at {new Date(task.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {!task.completed && (
                      <button
                        onClick={() => startEdit(task)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteConfirm(task.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === task.id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 mb-3">
                      Are you sure you want to delete this task? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

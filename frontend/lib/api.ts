/**
 * Task: T020, T022, T027, T032, T037, T043, T048
 * Spec: 002-authentication/contracts/jwt-spec.md - Frontend Integration
 * Spec: 003-task-crud - Task API Client Methods
 */

import type { Task, TaskCreate, TaskUpdate } from '../types/task'

const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('.hf.space')
    ? `${window.location.origin}/api/v1`
    : process.env.NODE_ENV === 'production'
      ? `${window.location.origin}/api/v1`  // Production - use same origin
      : 'http://localhost:8000/api/v1')  // Development URL

/**
 * API client for communicating with FastAPI backend.
 * Automatically attaches JWT tokens to requests and handles authentication errors.
 */
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL
  }

  /**
   * Get stored JWT token from sessionStorage.
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem('access_token')
  }

  /**
   * Store JWT token in sessionStorage.
   */
  private setToken(token: string): void {
    if (typeof window === 'undefined') return
    sessionStorage.setItem('access_token', token)
  }

  /**
   * Clear stored JWT token.
   */
  public clearToken(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem('access_token')
  }

  /**
   * Make HTTP request to API with automatic JWT attachment.
   *
   * @param endpoint - API endpoint path (e.g., "/tasks")
   * @param options - Fetch options (method, body, headers, etc.)
   * @returns Parsed JSON response
   * @throws Error if request fails
   */
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      this.clearToken()
      // Redirect to login (only in browser)
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('Unauthorized - redirecting to login')
    }

    // Handle other errors
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Register a new user account.
   *
   * @param email - User email address
   * @param password - User password (min 8 characters)
   * @returns Auth response with token and user info
   */
  async signup(email: string, password: string) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // Store token after successful signup
    this.setToken(data.access_token)
    return data
  }

  /**
   * Login existing user.
   *
   * @param email - User email address
   * @param password - User password
   * @returns Auth response with token and user info
   */
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    // Store token after successful login
    this.setToken(data.access_token)
    return data
  }

  /**
   * Logout current user.
   * Clears stored token only. Caller should handle redirect.
   */
  logout(): void {
    this.clearToken()
  }

  /**
   * Check if user is authenticated (has valid token).
   * Note: This only checks if token exists, not if it's valid.
   * Backend will validate on actual API calls.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  // ========== Task API Methods ==========

  /**
   * Get all tasks for authenticated user.
   * Task: T022
   * Spec: US-1 View All Tasks
   */
  async getTasks(): Promise<Task[]> {
    const response = await this.request<{ tasks: Task[] }>('/tasks')
    return response.tasks || []
  }

  /**
   * Create a new task.
   * Task: T027
   * Spec: US-2 Create Task
   */
  async createTask(data: TaskCreate): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Get a single task by ID.
   * Task: T032
   * Spec: US-3 View Single Task
   */
  async getTask(taskId: string): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}`)
  }

  /**
   * Update a task.
   * Task: T037
   * Spec: US-4 Update Task
   */
  async updateTask(taskId: string, data: TaskUpdate): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * Mark task as complete.
   * Task: T043
   * Spec: US-5 Toggle Completion
   */
  async completeTask(taskId: string): Promise<Task> {
    return this.request<Task>(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
    })
  }

  /**
   * Delete a task.
   * Task: T048
   * Spec: US-6 Delete Task
   */
  async deleteTask(taskId: string): Promise<void> {
    await this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

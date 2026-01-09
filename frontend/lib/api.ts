/**
 * Task: T020, T022, T027, T032, T037, T043, T048
 * Spec: 002-authentication/contracts/jwt-spec.md - Frontend Integration
 * Spec: 003-task-crud - Task API Client Methods
 */

import type { Task, TaskCreate, TaskUpdate } from '../types/task'
import type { UserProfile } from '../types/auth'

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

    // Check if response has body content before parsing JSON
    if (response.status === 204 || !response.body) {
      // No content responses (like 204 No Content) return undefined
      return undefined as T;
    }

    // Check if response has content length of 0
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      return undefined as T;
    }

    // For other responses, check content type and parse accordingly
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // For non-JSON responses, try to parse as JSON or return empty object
      const text = await response.text();
      if (!text) {
        return undefined as T;
      }
      try {
        return JSON.parse(text) as T;
      } catch {
        // If it's not JSON-parseable, return as text or empty object
        return {} as T;
      }
    }
  }

  /**
   * Register a new user account.
   *
   * @param username - User username (3-20 chars, alphanumeric/_/- only)
   * @param email - User email address
   * @param password - User password (min 8 characters)
   * @param confirmPassword - Password confirmation (must match password)
   * @returns Auth response with token and user info
   */
  async signup(username: string, email: string, password: string, confirmPassword: string) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
    })
    // Store token after successful signup
    this.setToken(data.access_token)
    return data
  }

  /**
   * Login existing user with email or username.
   *
   * @param emailOrUsername - User email or username
   * @param password - User password
   * @returns Auth response with token and user info
   */
  async login(emailOrUsername: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email_or_username: emailOrUsername, password }),
    })
    // Store token after successful login
    this.setToken(data.access_token)
    return data
  }

  /**
   * Logout current user.
   * Clears stored token only. Caller should handle redirect.
   */
  async logout() {
    try {
      // Call the logout endpoint
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // If the logout API call fails, still clear the token
      console.error('Logout API call failed:', error);
    } finally {
      // Clear token regardless of API call result
      this.clearToken();
    }
  }

  /**
   * Change user's password.
   *
   * @param currentPassword - Current password for verification
   * @param newPassword - New password (min 8 characters)
   * @param confirmPassword - New password confirmation (must match new password)
   * @returns Success message
   */
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }),
    });
  }

  /**
   * Update user's email address.
   *
   * @param newEmail - New email address
   * @param password - Current password for verification
   * @returns Success message with new email
   */
  async updateEmail(newEmail: string, password: string) {
    return this.request('/auth/update-email', {
      method: 'POST',
      body: JSON.stringify({
        new_email: newEmail,
        password: password
      }),
    });
  }

  /**
   * Check if user is authenticated (has valid token).
   * Note: This only checks if token exists, not if it's valid.
   * Backend will validate on actual API calls.
   */
  /**
   * Get current user profile.
   *
   * @returns User profile information
   */
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/me')
  }

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

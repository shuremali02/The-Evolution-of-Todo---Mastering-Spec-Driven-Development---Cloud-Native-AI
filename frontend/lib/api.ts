/**
 * Task: T020, T022, T027, T032, T037, T043, T048
 * Spec: 002-authentication/contracts/jwt-spec.md - Frontend Integration
 * Spec: 003-task-crud - Task API Client Methods
 */

import type { Task, TaskCreate, TaskUpdate } from '../types/task'
import type { UserProfile } from '../types/auth'
import type { DashboardStats, RecentActivityItem, UpcomingDeadlineItem, DashboardResponse } from '../types/dashboard'

// ========== Environment Variables ==========
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shurem-todo-app.hf.space/api/v1"
const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "https://shurem-todo-app.hf.space/api/v1"
const NODE_ENV = process.env.NODE_ENV || "production"

// ========== Default API URLs ==========
const DEFAULT_DEV_API_URL_V1 = 'http://localhost:8000/api/v1'
const DEFAULT_DEV_CHAT_API_URL = 'http://localhost:8000/api/v1'  // Chat API URL (same as backend)
const DEFAULT_PROD_API_URL_V1 = 'https://shurem-todo-app.hf.space/api/v1'  // Your backend URL
const DEFAULT_PROD_CHAT_API_URL = 'https://shurem-todo-app.hf.space/api/v1'  // Chat API URL (same as backend)

function getApiUrl(version: 'v1' | 'chat' = 'v1'): string {
  // Use environment variable if available
  if (version === 'v1' && API_URL) {
    return API_URL
  } else if (version === 'chat' && CHAT_API_URL) {
    return CHAT_API_URL
  }

  // For production deployments, use the backend API URL
  // This should be configured separately from the frontend URL
  if (typeof window !== 'undefined') {
    // In production, use your actual backend URL
    // For development, default to localhost
    if (version === 'v1') {
      return NODE_ENV === 'production'
        ? DEFAULT_PROD_API_URL_V1  // Using your actual backend URL
        : DEFAULT_DEV_API_URL_V1
    } else { // chat version
      return NODE_ENV === 'production'
        ? DEFAULT_PROD_CHAT_API_URL  // Using your actual backend URL
        : DEFAULT_DEV_CHAT_API_URL
    }
  }

  // For server-side rendering, use environment variable or default to dev URL
  return version === 'v1' ? DEFAULT_DEV_API_URL_V1 : DEFAULT_DEV_CHAT_API_URL
}

/**
 * API client for communicating with FastAPI backend.
 * Automatically attaches JWT tokens to requests and handles authentication errors.
 */
class ApiClient {
  private baseURL: string
  private apiVersion: 'v1' | 'chat'

  constructor(baseURL?: string, apiVersion: 'v1' | 'chat' = 'v1') {
    this.baseURL = baseURL || getApiUrl(apiVersion)
    this.apiVersion = apiVersion
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
    // Determine the correct base URL based on the endpoint
    let effectiveBaseURL = this.baseURL;

    // If the endpoint starts with /chat, use the chat API URL
    if (endpoint.startsWith('/chat')) {
      effectiveBaseURL = getApiUrl('chat');
    }

    const token = this.getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${effectiveBaseURL}${endpoint}`, {
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

      // Map technical error messages to user-friendly messages
      const getUserFriendlyMessage = (errorMessage: string): string => {
        const errorMap: Record<string, string> = {
          // Authentication errors
          'Could not validate credentials': 'Session expired. Please log in again.',
          'Unauthorized': 'Access denied. Please log in to continue.',
          'Expired signature': 'Your session has expired. Please log in again.',

          // Common validation errors
          'Task not found': 'The task you are looking for does not exist.',
          'Task does not belong to user': 'You do not have permission to access this task.',
          'Invalid input': 'The information provided is not valid. Please check and try again.',
          'Validation Error': 'Please check the information you entered and try again.',
        };

        // Check if the error message contains any of the keys as substrings
        for (const [technical, userFriendly] of Object.entries(errorMap)) {
          if (errorMessage.toLowerCase().includes(technical.toLowerCase())) {
            return userFriendly;
          }
        }

        // Default fallback message
        return error.detail || `HTTP ${response.status}: ${response.statusText}`;
      };

      const userFriendlyMessage = getUserFriendlyMessage(error.detail || `HTTP ${response.status}: ${response.statusText}`);
      throw new Error(userFriendlyMessage);
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
  async getTasks(search?: string, filterStatus?: string, sort?: string, limit?: number, offset?: number): Promise<Task[]> {
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filterStatus) params.append('filter_status', filterStatus);
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';

    const response = await this.request<{ tasks: Task[] }>(endpoint)
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

  /**
   * Reorder tasks by updating their position.
   * Task: T011
   * Spec: Phase 1 UI Enhancements - Drag-and-Drop Task Reordering
   */
  async reorderTasks(taskIds: string[]): Promise<{ success: boolean; message: string; count: number }> {
    return this.request('/tasks/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ task_ids: taskIds }),
    })
  }

  // ========== Chat API Methods ==========

  /**
   * Send a message to the AI chatbot.
   * Task: T032
   * Spec: 010-ai-chatbot - Chat API endpoint
   */
  async sendMessage(conversationId: string | null, message: string) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        conversation_id: conversationId || undefined,
        message: message
      }),
    })
  }

  /**
   * Get conversation history.
   * Task: T032
   * Spec: 010-ai-chatbot - Chat API endpoint
   */
  async getConversationHistory(conversationId: string) {
    return this.request(`/chat/conversations/${conversationId}`)
  }

  /**
   * List user's conversations.
   * Task: T032
   * Spec: 010-ai-chatbot - Chat API endpoint
   */
  async listConversations() {
    return this.request('/chat/conversations')
  }

  // ========== Dashboard API Methods ==========

  /**
   * Get dashboard statistics for authenticated user.
   * Task: T033
   * Spec: 006 Dashboard - Statistics endpoint
   */
  async getTaskStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/tasks/stats')
  }

  /**
   * Get recent activity for authenticated user.
   * Task: T036
   * Spec: 006 Dashboard - Recent activity endpoint
   */
  async getRecentActivity(): Promise<RecentActivityItem[]> {
    return this.request<RecentActivityItem[]>('/tasks/recent')
  }

  /**
   * Get upcoming deadlines for authenticated user.
   * Task: T037
   * Spec: 006 Dashboard - Upcoming deadlines endpoint
   */
  async getUpcomingDeadlines(): Promise<UpcomingDeadlineItem[]> {
    return this.request<UpcomingDeadlineItem[]>('/tasks/upcoming')
  }
}

// Export singleton instance with lazy initialization to avoid SSR issues
let _apiClient: ApiClient | null = null

export const getApiClient = (): ApiClient => {
  if (!_apiClient) {
    _apiClient = new ApiClient()
  }
  return _apiClient
}

// For backward compatibility, still export as apiClient
export const apiClient = getApiClient()

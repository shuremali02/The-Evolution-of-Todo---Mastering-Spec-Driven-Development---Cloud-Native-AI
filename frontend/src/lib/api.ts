// Task: T013, T021, T031
// Spec: US1 - User Registration, US2 - Login, US4 - Logout

import type { SignupRequest, LoginRequest, TokenResponse, UserProfile } from '@/types/auth';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get API base URL - use environment variable or default
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Check if we're in the browser environment before accessing localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new ApiError(response.status, error.detail || 'An error occurred');
  }

  return response.json();
}

export async function signup(data: SignupRequest): Promise<TokenResponse> {
  const response = await fetchApi<TokenResponse>('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Store token only in browser environment
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('username', response.username);
  }

  return response;
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await fetchApi<TokenResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Store token only in browser environment
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('username', response.username);
  }

  return response;
}

export async function getProfile(): Promise<UserProfile> {
  return fetchApi<UserProfile>('/api/v1/auth/me');
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('access_token');
  }
  return false;
}

export async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
  const response = await fetchApi<void>('/api/v1/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    }),
  });

  return response;
}

export async function updateEmail(newEmail: string, password: string): Promise<void> {
  const response = await fetchApi<void>('/api/v1/auth/update-email', {
    method: 'POST',
    body: JSON.stringify({
      new_email: newEmail,
      password: password
    }),
  });

  return response;
}

// Task-related API functions
export async function getTasks(): Promise<any[]> {
  const response = await fetchApi<any>('/api/v1/tasks', {
    method: 'GET',
  });

  // The backend returns a TaskListResponse with tasks property
  return response.tasks || [];
}

export async function createTask(taskData: any): Promise<any> {
  const response = await fetchApi<any>('/api/v1/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });

  return response;
}

export async function getTask(taskId: string): Promise<any> {
  const response = await fetchApi<any>(`/api/v1/tasks/${taskId}`, {
    method: 'GET',
  });

  return response;
}

export async function updateTask(taskId: string, taskData: any): Promise<any> {
  const response = await fetchApi<any>(`/api/v1/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });

  return response;
}

export async function completeTask(taskId: string): Promise<any> {
  const response = await fetchApi<any>(`/api/v1/tasks/${taskId}/complete`, {
    method: 'PATCH',
  });

  return response;
}

export async function deleteTask(taskId: string): Promise<void> {
  await fetchApi<void>(`/api/v1/tasks/${taskId}`, {
    method: 'DELETE',
  });
}

// Define the ApiClient interface for type safety
interface ApiClient {
  // Auth functions
  login: (data: LoginRequest) => Promise<TokenResponse>;
  signup: (data: SignupRequest) => Promise<TokenResponse>;
  getProfile: () => Promise<UserProfile>;
  logout: () => void;
  isAuthenticated: () => boolean;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;

  // Task functions
  getTasks: () => Promise<any[]>;
  createTask: (taskData: any) => Promise<any>;
  getTask: (taskId: string) => Promise<any>;
  updateTask: (taskId: string, taskData: any) => Promise<any>;
  completeTask: (taskId: string) => Promise<any>;
  deleteTask: (taskId: string) => Promise<void>;
}

// Export a client object for backward compatibility with existing code
export const apiClient: ApiClient = {
  // Auth functions
  login: login,
  signup: signup,
  getProfile: getProfile,
  logout: logout,
  isAuthenticated: isAuthenticated,
  changePassword: changePassword,
  updateEmail: updateEmail,

  // Task functions
  getTasks: getTasks,
  createTask: createTask,
  getTask: getTask,
  updateTask: updateTask,
  completeTask: completeTask,
  deleteTask: deleteTask,
};

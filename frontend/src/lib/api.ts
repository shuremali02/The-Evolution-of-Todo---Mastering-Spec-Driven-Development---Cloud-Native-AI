// Task: T013, T021, T031
// Spec: US1 - User Registration, US2 - Login, US4 - Logout

import type { SignupRequest, LoginRequest, TokenResponse, UserProfile } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

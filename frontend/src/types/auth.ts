/**
 * Task: T021
 * Spec: 002-authentication/data-model.md - TypeScript Types
 */

/**
 * User entity (matches backend UserResponse schema).
 */
export interface User {
  id: string
  email: string
  created_at: string  // ISO 8601 timestamp
}

/**
 * User registration request payload.
 */
export interface SignupRequest {
  email: string
  password: string
}

/**
 * User login request payload.
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Authentication response from signup/login endpoints.
 * Contains JWT token and user information.
 */
export interface AuthResponse {
  access_token: string
  token_type: string  // Always "bearer"
  user: User
}

/**
 * JWT token payload structure (decoded).
 * For reference only - tokens are decoded on backend.
 */
export interface JWTPayload {
  sub: string  // User ID (subject)
  exp: number  // Expiration timestamp (Unix epoch)
  iat: number  // Issued at timestamp (Unix epoch)
}

/**
 * Authentication token response (from signup/login endpoints).
 */
export interface TokenResponse {
  access_token: string
  token_type: string
  username: string
}

/**
 * User profile response.
 */
export interface UserProfile {
  id: string
  email: string
  username: string
  created_at: string
}

/**
 * API error response structure.
 */
export interface ApiError {
  detail: string | ApiErrorDetail[]
}

/**
 * Detailed validation error (422 responses).
 */
export interface ApiErrorDetail {
  loc: string[]  // Error location (e.g., ["body", "email"])
  msg: string    // Error message
  type: string   // Error type (e.g., "value_error.email")
}

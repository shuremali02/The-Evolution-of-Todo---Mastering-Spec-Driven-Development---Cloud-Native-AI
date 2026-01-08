/**
 * Task: T011, T012
 * Spec: 002-authentication/spec.md - JWT Utilities
 */

import { decodeJwt } from 'jose';
import type { JWTPayload } from '@/types/auth';

export interface JwtPayloadExtended extends JWTPayload {
  username: string; // username for frontend display
}

/**
 * Decode JWT token and extract payload
 * @param token JWT token string
 * @returns Decoded payload with user information
 */
export const decodeToken = (token: string): JwtPayloadExtended => {
  try {
    const decoded = decodeJwt(token) as JwtPayloadExtended;
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Invalid token');
  }
};

/**
 * Get JWT token from sessionStorage
 * @returns Token string or null if not found
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('access_token');
  }
  return null;
};

/**
 * Set JWT token in sessionStorage
 * @param token JWT token string to store
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('access_token', token);
  }
};

/**
 * Clear JWT token from sessionStorage
 */
export const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('access_token');
  }
};

/**
 * Get current user ID from token
 * @returns User ID string or null if token is invalid/expired
 */
export const getCurrentUserId = (): Promise<string | null> => {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  try {
    const payload = decodeToken(token);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      // Token is expired
      clearToken();
      return Promise.resolve(null);
    }
    return Promise.resolve(payload.sub);
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    clearToken();
    return Promise.resolve(null);
  }
};

/**
 * Get current username from token
 * @returns Username string or null if token is invalid/expired
 */
export const getCurrentUsername = (): Promise<string | null> => {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  try {
    const payload = decodeToken(token);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      // Token is expired
      clearToken();
      return Promise.resolve(null);
    }
    return Promise.resolve(payload.username);
  } catch (error) {
    console.error('Error getting username from token:', error);
    clearToken();
    return Promise.resolve(null);
  }
};
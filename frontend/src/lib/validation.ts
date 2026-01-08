/**
 * Task: T021, T022, T023
 * Spec: 002-authentication/spec.md - Validation Utilities
 */

/**
 * Validate username format
 * - 3-20 characters
 * - Alphanumeric, underscore, hyphen only
 * - First character must be letter or number
 * @param username The username to validate
 * @returns true if valid, error message if invalid
 */
export const validateUsername = (username: string): boolean | string => {
  if (username.length < 3 || username.length > 20) {
    return 'Username must be between 3 and 20 characters';
  }

  // Check that it only contains allowed characters and starts with letter/number
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(username)) {
    return 'Username must start with a letter/number and contain only letters, numbers, underscores, and hyphens';
  }

  return true;
};

/**
 * Validate email format using basic regex
 * @param email The email to validate
 * @returns true if valid, error message if invalid
 */
export const validateEmail = (email: string): boolean | string => {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return true;
};

/**
 * Validate that two passwords match
 * @param password First password
 * @param confirmPassword Second password (confirmation)
 * @returns true if match, error message if they don't match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean | string => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return true;
};

/**
 * Validate password strength (minimum 8 characters)
 * @param password The password to validate
 * @returns true if valid, error message if invalid
 */
export const validatePassword = (password: string): boolean | string => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  return true;
};
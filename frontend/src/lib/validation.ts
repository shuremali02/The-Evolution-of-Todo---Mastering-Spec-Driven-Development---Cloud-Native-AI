/**
 * Task: T002
 * Spec: 005-task-management-ui - Validation Utilities
 */

// Validation constants
export const VALIDATION = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const

// Authentication validation constants
export const AUTH_VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_PATTERN: /^[a-zA-Z][a-zA-Z0-9._-]*$/, // Must start with letter, then alphanumeric and allowed special chars
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]+$/, // At least 1 letter, 1 number, 1 special char
} as const

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validate task title
 * - Required (min 1 character)
 * - Max 200 characters
 */
export function validateTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: 'Title is required' }
  }

  if (title.length < VALIDATION.TITLE_MIN_LENGTH) {
    return { isValid: false, error: `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} character(s)` }
  }

  if (title.length > VALIDATION.TITLE_MAX_LENGTH) {
    return { isValid: false, error: `Title must be ${VALIDATION.TITLE_MAX_LENGTH} characters or less` }
  }

  return { isValid: true }
}

/**
 * Validate task description
 * - Optional (can be null, undefined, or empty)
 * - Max 1000 characters if provided
 */
export function validateDescription(description: string | null | undefined): ValidationResult {
  if (description === null || description === undefined || description.trim().length === 0) {
    // Description is optional, so empty is valid
    return { isValid: true }
  }

  if (description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    return { isValid: false, error: `Description must be ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters or less` }
  }

  return { isValid: true }
}

/**
 * Validate task form data (title + description)
 */
export function validateTaskForm(title: string, description: string | null | undefined): {
  title: ValidationResult
  description: ValidationResult
  isValid: boolean
} {
  const titleResult = validateTitle(title)
  const descriptionResult = validateDescription(description)

  return {
    title: titleResult,
    description: descriptionResult,
    isValid: titleResult.isValid && descriptionResult.isValid,
  }
}

/**
 * Validate username
 * - Required (3-20 characters)
 * - Must start with a letter
 * - Can contain letters, numbers, dots, underscores, and hyphens
 */
export function validateUsername(username: string): ValidationResult | string {
  if (!username) {
    return 'Username is required';
  }

  if (username.length < AUTH_VALIDATION.USERNAME_MIN_LENGTH) {
    return `Username must be at least ${AUTH_VALIDATION.USERNAME_MIN_LENGTH} characters`;
  }

  if (username.length > AUTH_VALIDATION.USERNAME_MAX_LENGTH) {
    return `Username must be ${AUTH_VALIDATION.USERNAME_MAX_LENGTH} characters or less`;
  }

  if (!AUTH_VALIDATION.USERNAME_PATTERN.test(username)) {
    return 'Username must start with a letter and can only contain letters, numbers, dots, underscores, and hyphens';
  }

  return { isValid: true };
}

/**
 * Validate email
 * - Required
 * - Must match email pattern
 */
export function validateEmail(email: string): ValidationResult | string {
  if (!email) {
    return 'Email is required';
  }

  if (!AUTH_VALIDATION.EMAIL_PATTERN.test(email)) {
    return 'Please enter a valid email address';
  }

  return { isValid: true };
}

/**
 * Validate password
 * - Required (min 8 characters)
 * - Must contain at least 1 letter, 1 number, and 1 special character
 */
export function validatePassword(password: string): ValidationResult | string {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < AUTH_VALIDATION.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${AUTH_VALIDATION.PASSWORD_MIN_LENGTH} characters`;
  }

  if (!AUTH_VALIDATION.PASSWORD_PATTERN.test(password)) {
    return 'Password must contain at least 1 letter, 1 number, and 1 special character';
  }

  return { isValid: true };
}

/**
 * Validate password match
 * - Both passwords must be provided and match
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult | string {
  if (!password || !confirmPassword) {
    return 'Both passwords are required';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return { isValid: true };
}

/**
 * Sanitize title - trim whitespace
 */
export function sanitizeTitle(title: string): string {
  return title.trim()
}

/**
 * Sanitize description - trim whitespace, convert null/undefined to empty string
 */
export function sanitizeDescription(description: string | null | undefined): string {
  if (description === null || description === undefined) {
    return ''
  }
  return description.trim()
}

/**
 * Create task data ready for API submission
 */
export function prepareTaskData(title: string, description: string | null | undefined): {
  title: string
  description: string | null
} {
  return {
    title: sanitizeTitle(title),
    description: sanitizeDescription(description) || null,
  }
}
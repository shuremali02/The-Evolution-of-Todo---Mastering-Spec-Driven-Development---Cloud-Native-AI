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

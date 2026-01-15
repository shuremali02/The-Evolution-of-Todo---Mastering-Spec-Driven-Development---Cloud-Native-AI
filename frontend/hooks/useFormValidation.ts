import { useState, useEffect } from 'react';

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: any, values?: Record<string, any>) => string | null;
}

export const useFormValidation = (initialValues: Record<string, any>, validationRules: Record<string, ValidationRule>) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, ValidationError[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [valid, setValid] = useState<Record<string, boolean>>({});

  const validateField = (fieldName: string, value: any) => {
    if (!validationRules[fieldName]) return [];

    const rules = validationRules[fieldName];
    const fieldErrors: ValidationError[] = [];

    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push({
        field: fieldName,
        message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`,
        severity: 'error',
      });
    }

    // Min length validation
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      fieldErrors.push({
        field: fieldName,
        message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`,
        severity: 'error',
      });
    }

    // Max length validation
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      fieldErrors.push({
        field: fieldName,
        message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at most ${rules.maxLength} characters`,
        severity: 'error',
      });
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      fieldErrors.push({
        field: fieldName,
        message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} format is invalid`,
        severity: 'error',
      });
    }

    // Custom validation
    if (rules.validate) {
      const customError = rules.validate(value, values);
      if (customError) {
        fieldErrors.push({
          field: fieldName,
          message: customError,
          severity: 'error',
        });
      }
    }

    // Update validity status
    setValid(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length === 0
    }));

    return fieldErrors;
  };

  const validateAll = () => {
    const allErrors: Record<string, ValidationError[]> = {};
    const allValid: Record<string, boolean> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldErrors = validateField(field, values[field]);
      if (fieldErrors.length > 0) {
        allErrors[field] = fieldErrors;
        allValid[field] = false;
        isValid = false;
      } else {
        allValid[field] = true;
      }
    });

    setErrors(allErrors);
    setValid(allValid);
    return isValid;
  };

  const handleChange = (fieldName: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));

    // Always validate as user types to provide real-time feedback
    const fieldErrors = validateField(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));

    // Update the valid state based on whether there are errors
    setValid(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length === 0
    }));

    // If the changed field affects other fields' validation (like password affecting confirmPassword)
    // we should re-validate those fields too
    if (fieldName === 'password') {
      // Create updated values object to include the new password value
      const updatedValues: Record<string, any> = { ...values, [fieldName]: value };

      // Re-validate confirmPassword if it exists and has been touched
      if (validationRules['confirmPassword']) {
        const existingConfirmErrors = errors['confirmPassword'] || [];
        if (touched['confirmPassword'] || existingConfirmErrors.length > 0) {
          const confirmFieldErrors = validateField('confirmPassword', updatedValues['confirmPassword'] || '');
          setErrors(prev => ({
            ...prev,
            confirmPassword: confirmFieldErrors
          }));

          setValid(prev => ({
            ...prev,
            confirmPassword: confirmFieldErrors.length === 0
          }));
        }
      }
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    const fieldErrors = validateField(fieldName, values[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));

    // Update the valid state based on whether there are errors
    setValid(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length === 0
    }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setValid({});
  };

  return {
    values,
    errors,
    touched,
    valid,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues,
  };
};
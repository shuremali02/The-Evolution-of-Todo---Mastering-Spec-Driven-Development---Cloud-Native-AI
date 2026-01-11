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
  validate?: (value: any) => string | null;
}

export const useFormValidation = (initialValues: Record<string, any>, validationRules: Record<string, ValidationRule>) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, ValidationError[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      const customError = rules.validate(value);
      if (customError) {
        fieldErrors.push({
          field: fieldName,
          message: customError,
          severity: 'error',
        });
      }
    }

    return fieldErrors;
  };

  const validateAll = () => {
    const allErrors: Record<string, ValidationError[]> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldErrors = validateField(field, values[field]);
      if (fieldErrors.length > 0) {
        allErrors[field] = fieldErrors;
        isValid = false;
      }
    });

    setErrors(allErrors);
    return isValid;
  };

  const handleChange = (fieldName: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));

    // Validate as user types if the field has been touched
    if (touched[fieldName]) {
      const fieldErrors = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors
      }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    const fieldErrors = validateField(fieldName, values[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues,
  };
};
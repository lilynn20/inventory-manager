import { useState, useCallback } from 'react'

// Validation rules
export const validators = {
  required: (value, fieldName = 'This field') => {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`
    }
    if (typeof value === 'string' && value.trim() === '') {
      return `${fieldName} is required`
    }
    return null
  },

  email: (value) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return null
  },

  minLength: (min) => (value, fieldName = 'This field') => {
    if (!value) return null
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`
    }
    return null
  },

  maxLength: (max) => (value, fieldName = 'This field') => {
    if (!value) return null
    if (value.length > max) {
      return `${fieldName} must not exceed ${max} characters`
    }
    return null
  },

  min: (minValue) => (value, fieldName = 'This field') => {
    if (value === '' || value === null || value === undefined) return null
    if (Number(value) < minValue) {
      return `${fieldName} must be at least ${minValue}`
    }
    return null
  },

  max: (maxValue) => (value, fieldName = 'This field') => {
    if (value === '' || value === null || value === undefined) return null
    if (Number(value) > maxValue) {
      return `${fieldName} must not exceed ${maxValue}`
    }
    return null
  },

  positive: (value, fieldName = 'This field') => {
    if (value === '' || value === null || value === undefined) return null
    if (Number(value) <= 0) {
      return `${fieldName} must be a positive number`
    }
    return null
  },

  nonNegative: (value, fieldName = 'This field') => {
    if (value === '' || value === null || value === undefined) return null
    if (Number(value) < 0) {
      return `${fieldName} cannot be negative`
    }
    return null
  },

  phone: (value) => {
    if (!value) return null
    const phoneRegex = /^[\d\s\-+()]{7,20}$/
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number'
    }
    return null
  },

  password: (value) => {
    if (!value) return null
    if (value.length < 8) {
      return 'Password must be at least 8 characters'
    }
    return null
  },

  match: (matchField, matchFieldName) => (value, fieldName, formValues) => {
    if (!value) return null
    if (value !== formValues[matchField]) {
      return `${fieldName} must match ${matchFieldName}`
    }
    return null
  },
}

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} Form state and handlers
 */
export function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const fieldRules = validationRules[name]
    if (!fieldRules) return null

    for (const rule of fieldRules) {
      const error = typeof rule === 'function' 
        ? rule(value, name, values)
        : null
      if (error) return error
    }
    return null
  }, [validationRules, values])

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    return isValid
  }, [validationRules, values, validateField])

  // Handle field change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  // Handle field blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [values, validateField])

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  // Set values programmatically
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }))
  }, [])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setFormValues,
    isValid: Object.keys(errors).every(key => !errors[key]),
    isDirty: Object.keys(touched).some(key => touched[key]),
  }
}

/**
 * FormField component for consistent field rendering with validation
 */
export function FormField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  error, 
  touched, 
  onChange, 
  onBlur, 
  required,
  placeholder,
  children,
  ...props 
}) {
  const showError = touched && error

  return (
    <div className="form-group">
      {label && (
        <label>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {children || (
        <input
          type={type}
          name={name}
          className={`form-control ${showError ? 'form-control-error' : ''}`}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          placeholder={placeholder}
          {...props}
        />
      )}
      {showError && (
        <p className="form-error">{error}</p>
      )}
    </div>
  )
}

export default useFormValidation

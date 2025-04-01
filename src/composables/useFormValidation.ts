import { ref, computed } from 'vue';

interface ValidationRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  validator?: (value: any) => boolean;
  shouldValidate?: () => boolean;
}

export function useFormValidation<T extends Record<string, any>>() {
  const errors = ref<Record<keyof T, string>>({} as Record<keyof T, string>);
  const touched = ref<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const validateField = (
    field: keyof T,
    value: any,
    rules: ValidationRule[] | Record<string, ValidationRule>
  ) => {
    touched.value[field] = true;
    
    // Convert rules to array if it's not already
    const rulesArray = Array.isArray(rules) ? rules : Object.values(rules);
    
    for (const rule of rulesArray) {
      // Skip validation if shouldValidate is provided and returns false
      if (rule.shouldValidate && !rule.shouldValidate()) {
        continue;
      }

      // Check for required
      if (rule.required && (value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0))) {
        errors.value[field] = rule.message || `${String(field)} is required`;
        return false;
      }

      // Check for pattern
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.value[field] = rule.message || `${String(field)} format is invalid`;
        return false;
      }

      // Check for custom validator
      if (rule.validator && !rule.validator(value)) {
        errors.value[field] = rule.message || `${String(field)} is invalid`;
        return false;
      }
    }

    delete errors.value[field];
    return true;
  };

  const validateAll = (
    values: T,
    rulesMap: Record<keyof T, ValidationRule[]>
  ) => {
    let isValid = true;
    
    for (const [field, rules] of Object.entries(rulesMap) as [keyof T, ValidationRule[]][]) {
      const fieldIsValid = validateField(field, values[field], rules);
      if (!fieldIsValid) {
        isValid = false;
      }
    }
    
    return isValid;
  };

  const isValid = computed(() => Object.keys(errors.value).length === 0);

  return {
    errors,
    touched,
    validateField,
    validateAll,
    isValid
  };
}

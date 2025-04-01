import { ref, computed } from 'vue';

interface ValidationRule {
  required?: boolean | ((value: any) => boolean | string);
  message?: string;
  pattern?: RegExp;
  validator?: (value: any) => boolean | string;
  shouldValidate?: () => boolean;
  minLength?: (value: any) => boolean | string;
  range?: (value: any) => boolean | string;
  format?: (value: any) => boolean | string;
  greaterThanStart?: (value: any) => boolean | string;
  // Add a catch-all property for any other validation types
  [key: string]: any;
}

export function useFormValidation<T extends Record<string, any>>() {
  const errors = ref<Record<keyof T, string>>({} as Record<keyof T, string>);
  const touched = ref<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const validateField = (
    field: keyof T,
    value: any,
    rules: ValidationRule[] | Record<string, ValidationRule | ((value: any) => boolean | string)>
  ) => {
    touched.value[field] = true;
    
    // Handle different rule formats
    if (Array.isArray(rules)) {
      // Handle array of rules
      for (const rule of rules) {
        const result = processRule(rule, value, field);
        if (result !== true) {
          errors.value[field] = result;
          return false;
        }
      }
    } else {
      // Handle object format rules
      for (const [_, ruleConfig] of Object.entries(rules)) {
        // If the rule is a function (direct validator), execute it
        if (typeof ruleConfig === 'function') {
          const result = ruleConfig(value);
          if (result !== true) {
            errors.value[field] = typeof result === 'string' ? result : `${String(field)} is invalid`;
            return false;
          }
        } else if (typeof ruleConfig === 'object' && ruleConfig !== null) {
          // Process as rule object
          const result = processRule(ruleConfig as ValidationRule, value, field);
          if (result !== true) {
            errors.value[field] = result;
            return false;
          }
        }
      }
    }

    delete errors.value[field];
    return true;
  };

  // Process a rule object
  const processRule = (rule: ValidationRule, value: any, field: keyof T): true | string => {
    // Skip validation if shouldValidate is provided and returns false
    if (rule.shouldValidate && !rule.shouldValidate()) {
      return true;
    }

    // Check for required (boolean form)
    if (rule.required === true && (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0))) {
      return rule.message || `${String(field)} is required`;
    }

    // Check for required (function form)
    if (typeof rule.required === 'function') {
      const result = rule.required(value);
      if (result !== true) {
        return typeof result === 'string' ? result : `${String(field)} is required`;
      }
    }

    // Check for pattern
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message || `${String(field)} format is invalid`;
    }

    // Check for minLength
    if (typeof rule.minLength === 'function') {
      const result = rule.minLength(value);
      if (result !== true) {
        return typeof result === 'string' ? result : `${String(field)} does not meet minimum length`;
      }
    }

    // Check for range
    if (typeof rule.range === 'function') {
      const result = rule.range(value);
      if (result !== true) {
        return typeof result === 'string' ? result : `${String(field)} is out of range`;
      }
    }

    // Check for format
    if (typeof rule.format === 'function') {
      const result = rule.format(value);
      if (result !== true) {
        return typeof result === 'string' ? result : `${String(field)} format is invalid`;
      }
    }

    // Check for greaterThanStart
    if (typeof rule.greaterThanStart === 'function') {
      const result = rule.greaterThanStart(value);
      if (result !== true) {
        return typeof result === 'string' ? result : `${String(field)} is invalid`;
      }
    }

    // Check for custom validator
    if (rule.validator) {
      const result = rule.validator(value);
      if (result !== true) {
        return typeof result === 'string' ? result : `${String(field)} is invalid`;
      }
    }

    return true;
  };

  const validateAll = (
    values: T,
    rulesMap: Record<keyof T, ValidationRule[] | Record<string, ValidationRule | ((value: any) => boolean | string)>>
  ) => {
    let isValid = true;
    
    for (const field of Object.keys(rulesMap) as Array<keyof T>) {
      const fieldIsValid = validateField(field, values[field], rulesMap[field]);
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

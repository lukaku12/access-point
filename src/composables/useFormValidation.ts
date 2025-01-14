import { ref, computed } from 'vue'

export function useFormValidation() {
  const errors = ref<Record<string, string>>({})
  const touched = ref<Record<string, boolean>>({})

  const validateField = (field: string, value: any, rules: Record<string, (v: any) => boolean | string>) => {
    touched.value[field] = true
    
    for (const [, validateRule] of Object.entries(rules)) {
      const result = validateRule(value)
      if (result !== true) {
        errors.value[field] = typeof result === 'string' ? result : `${field} is invalid`
        return false
      }
    }
    
    delete errors.value[field]
    return true
  }

  const isValid = computed(() => Object.keys(errors.value).length === 0)

  return {
    errors,
    touched,
    validateField,
    isValid
  }
}

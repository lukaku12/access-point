<script setup lang="ts">
interface Props {
  modelValue: number;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  error?: string;
  loading?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  min: undefined,
  max: undefined,
  step: 1,
  disabled: false,
  required: false,
  helpText: '',
  error: '',
  loading: false,
  placeholder: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'blur', event: FocusEvent): void;
}>();

const increment = () => {
  if (props.disabled || props.loading) return;
  const newValue = props.modelValue + props.step;
  if (props.max !== undefined && newValue > props.max) return;
  emit('update:modelValue', newValue);
};

const decrement = () => {
  if (props.disabled || props.loading) return;
  const newValue = props.modelValue - props.step;
  if (props.min !== undefined && newValue < props.min) return;
  emit('update:modelValue', newValue);
};

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = parseInt(input.value);
  
  if (isNaN(value)) {
    value = props.min || 0;
  }
  
  if (props.max !== undefined && value > props.max) {
    value = props.max;
  }
  if (props.min !== undefined && value < props.min) {
    value = props.min;
  }
  
  emit('update:modelValue', value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    increment();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    decrement();
  }
};
</script>

<template>
  <div class="form-group">
    <label v-if="label" :for="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="label"
        type="number"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @keydown="handleKeyDown"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled || loading"
        :required="required"
        :placeholder="placeholder"
        class="block w-full rounded-lg border-2 px-4 py-2.5 pr-16 transition-all duration-200 focus:ring-2 focus:ring-offset-0"
        :class="{
          'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500/20': !error && !disabled,
          'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500/20': error,
          'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed': disabled || loading
        }"
      />
      
      <div class="absolute inset-y-0 right-0 flex items-center">
        <div class="flex flex-col h-full border-l-2 border-gray-200 dark:border-gray-600">
          <button
            type="button"
            @click="increment"
            :disabled="disabled || loading || (max !== undefined && modelValue >= max)"
            :title="'Increase value' + (max !== undefined ? ` (Max: ${max})` : '')"
            class="flex-1 px-2 flex items-center justify-center transition-all duration-200
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-900/40
                   border-b border-gray-200 dark:border-gray-600 rounded-tr-lg
                   focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20"
            :class="{
              'cursor-pointer': !disabled && !loading && !(max !== undefined && modelValue >= max),
              'opacity-50 cursor-not-allowed': disabled || loading || (max !== undefined && modelValue >= max)
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            @click="decrement"
            :disabled="disabled || loading || (min !== undefined && modelValue <= min)"
            :title="'Decrease value' + (min !== undefined ? ` (Min: ${min})` : '')"
            class="flex-1 px-2 flex items-center justify-center transition-all duration-200
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-900/40
                   rounded-br-lg
                   focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20"
            :class="{
              'cursor-pointer': !disabled && !loading && !(min !== undefined && modelValue <= min),
              'opacity-50 cursor-not-allowed': disabled || loading || (min !== undefined && modelValue <= min)
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="mt-1">
      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      <p v-else-if="helpText" class="text-sm text-gray-500 dark:text-gray-400">{{ helpText }}</p>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.form-group:focus-within label {
  color: rgb(59 130 246);
}

.form-group:focus-within.has-error label {
  color: rgb(239 68 68);
}

/* Smooth transition for button interactions */
button {
  transform: translateY(0);
  transition: transform 0.1s ease-in-out;
}

button:active:not(:disabled) {
  transform: translateY(1px);
}

/* Add subtle hover effect */
button:hover:not(:disabled)::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0.1;
  border-radius: inherit;
}
</style>

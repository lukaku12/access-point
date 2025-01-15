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
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  min: undefined,
  max: undefined,
  step: 1,
  disabled: false,
  required: false,
  helpText: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const increment = () => {
  if (props.disabled) return;
  const newValue = props.modelValue + props.step;
  if (props.max !== undefined && newValue > props.max) return;
  emit('update:modelValue', newValue);
};

const decrement = () => {
  if (props.disabled) return;
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
</script>

<template>
  <div class="form-group">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        type="number"
        :value="modelValue"
        @input="handleInput"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :required="required"
        class="block w-full rounded-lg border-2 px-4 py-3 pr-20 transition-colors duration-200"
        :class="{
          'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100': !disabled,
          'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed': disabled
        }"
      />
      
      <div class="absolute inset-y-0 right-0 flex">
        <button
          type="button"
          @click="decrement"
          :disabled="disabled || (min !== undefined && modelValue <= min)"
          class="px-3 border-l-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 
                 transition-colors duration-200 rounded-l"
          :class="{ 'opacity-50 cursor-not-allowed': disabled || (min !== undefined && modelValue <= min) }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          @click="increment"
          :disabled="disabled || (max !== undefined && modelValue >= max)"
          class="px-3 border-l-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 
                 transition-colors duration-200 rounded-r"
          :class="{ 'opacity-50 cursor-not-allowed': disabled || (max !== undefined && modelValue >= max) }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <p v-if="helpText" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ helpText }}
    </p>
  </div>
</template>

<style scoped>
/* Hide number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>

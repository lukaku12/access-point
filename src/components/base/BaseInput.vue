<script setup lang="ts">
interface Props {
  modelValue: string | number;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  helpText?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  pattern?: string;
  minlength?: string | number;
  min?: string | number;
  max?: string | number;
  autocomplete?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  autocomplete: undefined,
  name: undefined
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
  (e: 'focus'): void;
}>();

const inputId = props.id || `input-${Math.random().toString(36).slice(2)}`;

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="input-wrapper">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <!-- Prefix slot -->
      <div
        v-if="$slots.prefix"
        class="absolute left-0 inset-y-0 flex items-center pl-3"
      >
        <slot name="prefix" />
      </div>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :pattern="pattern"
        :minlength="minlength"
        :min="min"
        :max="max"
        :autocomplete="autocomplete"
        :name="name"
        :class="[
          'block w-full rounded-lg text-sm transition-all duration-200',
          'border-2 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
          'hover:border-gray-400 dark:hover:border-gray-500',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-400',
          $slots.prefix ? 'pl-10' : 'pl-4',
          $slots.suffix ? 'pr-10' : 'pr-4',
          className
        ]"
        class="py-3"
        @input="updateValue"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />

      <!-- Suffix slot -->
      <div
        v-if="$slots.suffix"
        class="absolute right-0 inset-y-0 flex items-center pr-3"
      >
        <slot name="suffix" />
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-2 text-sm text-red-600 flex items-center gap-1">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      {{ error }}
    </p>

    <!-- Help text -->
    <p v-else-if="helpText" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {{ helpText }}
    </p>
  </div>
</template>

<style scoped>
.input-wrapper {
  @apply relative;
}

input {
  @apply appearance-none;
  @apply focus:outline-none;
  @apply focus:ring-4;
  @apply placeholder:text-gray-400 dark:placeholder:text-gray-500;
}

input:disabled {
  @apply bg-gray-50 dark:bg-gray-800;
  @apply cursor-not-allowed;
  @apply border-gray-200 dark:border-gray-700;
  @apply text-gray-500 dark:text-gray-400;
}

/* Date input styles */
input[type='date'] {
  @apply cursor-pointer;
}

input[type='date']::-webkit-calendar-picker-indicator {
  @apply absolute inset-0;
  @apply appearance-none;
  @apply bg-transparent;
  @apply cursor-pointer;
  @apply opacity-0;
  @apply w-full;
  @apply h-full;
}

/* Custom focus styles */
input:focus {
  @apply ring-opacity-50;
}

/* Custom hover styles */
input:hover:not(:disabled) {
  @apply border-opacity-90;
}

/* Add a subtle background pattern for empty inputs */
input:placeholder-shown {
  background-image: linear-gradient(45deg, transparent 97%, #e5e7eb 3%);
  @apply dark:bg-none;
}
</style>

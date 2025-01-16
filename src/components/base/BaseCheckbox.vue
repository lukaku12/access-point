<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false,
  required: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <label
    class="flex items-center justify-between w-full"
    :class="{
      'opacity-75 cursor-not-allowed': disabled,
      'cursor-pointer': !disabled
    }"
  >
    <span
      v-if="label"
      class="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </span>
    <div class="relative">
      <input
        type="checkbox"
        class="sr-only"
        :checked="modelValue"
        :disabled="disabled"
        @change="emit('update:modelValue', !modelValue)"
      />
      <div
        class="checkbox-bg w-14 h-7 rounded-full border-2 transition-all duration-200 ease-in-out"
        :class="{
          'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 shadow-inner shadow-blue-700/25':
            modelValue && !disabled,
          'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600':
            !modelValue && !disabled,
          'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700':
            disabled
        }"
      ></div>
      <div
        class="dot absolute left-1 top-1 w-5 h-5 rounded-full transition-all duration-200 ease-in-out"
        :class="{
          'transform translate-x-7 bg-white dark:bg-gray-100 scale-95':
            modelValue && !disabled,
          'bg-gray-400 dark:bg-gray-500': !modelValue && !disabled,
          'bg-gray-300 dark:bg-gray-600': disabled,
          'scale-90': disabled
        }"
      ></div>
    </div>
  </label>
</template>

<style scoped>
.checkbox-bg {
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-bg:not(:disabled):hover {
  filter: brightness(95%);
}

.dot {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dot:not(:disabled):hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
}

/* Active state animation */
.checkbox-bg:active:not(:disabled) {
  transform: scale(0.98);
}

.dot:active:not(:disabled) {
  transform: scale(0.95);
}

/* Dark mode hover effect */
@media (prefers-color-scheme: dark) {
  .checkbox-bg:not(:disabled):hover {
    filter: brightness(110%);
  }
}
</style>

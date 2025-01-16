<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue: string;
  options: { value: string; label: string }[];
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false,
  required: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);
const selectRef = ref<HTMLDivElement | null>(null);

const closeDropdown = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

const handleSelect = (value: string) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

const getSelectedLabel = () => {
  return (
    props.options.find((option) => option.value === props.modelValue)?.label ||
    'Select option'
  );
};
</script>

<template>
  <div class="form-group" ref="selectRef">
    <label
      v-if="label"
      class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <button
        type="button"
        @click="isOpen = !isOpen"
        :disabled="disabled"
        class="w-full text-left rounded-lg border-2 px-4 py-3 bg-white dark:bg-gray-700 transition-colors duration-200"
        :class="{
          'border-blue-500 dark:border-blue-400': isOpen && !disabled,
          'border-gray-300 dark:border-gray-600': !isOpen && !disabled,
          'border-gray-200 dark:border-gray-700 opacity-75 cursor-not-allowed':
            disabled
        }"
      >
        <div class="flex items-center justify-between">
          <span
            :class="{
              'text-gray-900 dark:text-gray-100': modelValue,
              'text-gray-500': !modelValue
            }"
          >
            {{ getSelectedLabel() }}
          </span>
          <svg
            class="w-5 h-5 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </button>

      <div
        v-if="isOpen && !disabled"
        class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg"
      >
        <div class="py-1 max-h-60 overflow-auto">
          <button
            v-for="option in options"
            :key="option.value"
            type="button"
            @click="handleSelect(option.value)"
            class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
            :class="{
              'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300':
                modelValue === option.value,
              'text-gray-900 dark:text-gray-100': modelValue !== option.value
            }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

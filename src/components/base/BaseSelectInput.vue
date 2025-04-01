<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';

interface Props {
  modelValue: string | number | Array<string | number>;
  options: { value: string | number; label: string }[];
  label?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  error?: string;
  parentSelector?: string; // Reference to parent container (like modal) for positioning
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false,
  required: false,
  multiple: false,
  error: '',
  parentSelector: ''
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | Array<string | number>): void;
  (e: 'blur'): void;
}>();

const isOpen = ref(false);
const selectRef = ref<HTMLDivElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const shouldShowAbove = ref(false);
const maxDropdownHeight = ref('250px');

// Close dropdown when clicking outside
const closeDropdown = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false;
    emit('blur');
  }
};

// Calculate optimal position and size for dropdown
const calculateOptimalPosition = () => {
  if (!selectRef.value || !isOpen.value || typeof window === 'undefined') {
    return;
  }

  const rect = selectRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const spaceBelow = windowHeight - rect.bottom - 20; // 20px buffer
  const spaceAbove = rect.top - 20; // 20px buffer
  
  // Determine if dropdown should appear above or below
  shouldShowAbove.value = spaceBelow < 160 && spaceBelow < spaceAbove;

  // Calculate maximum height based on available space
  if (shouldShowAbove.value) {
    // Show above, limit by space above
    maxDropdownHeight.value = `${Math.min(250, spaceAbove)}px`;
  } else {
    // Show below, limit by space below
    maxDropdownHeight.value = `${Math.min(250, spaceBelow)}px`;
  }

  // If a parent selector is provided, ensure dropdown stays within it
  if (props.parentSelector && dropdownRef.value) {
    const parentElement = document.querySelector(props.parentSelector);
    if (parentElement) {
      // Get parent's scroll information
      const parentRect = parentElement.getBoundingClientRect();
      const parentTop = parentRect.top;
      const parentBottom = parentRect.bottom;
      
      // Adjust dropdown position if it would extend outside the parent
      if (shouldShowAbove.value) {
        // Check if dropdown would extend above parent
        if (rect.top - dropdownRef.value.offsetHeight < parentTop) {
          shouldShowAbove.value = false;
        }
      } else {
        // Check if dropdown would extend below parent
        if (rect.bottom + dropdownRef.value.offsetHeight > parentBottom) {
          shouldShowAbove.value = true;
        }
      }
    }
  }
};

// Handle window resize and scroll
const handleViewportChanges = () => {
  calculateOptimalPosition();
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
  window.addEventListener('scroll', handleViewportChanges, { passive: true });
  window.addEventListener('resize', handleViewportChanges, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  window.removeEventListener('scroll', handleViewportChanges);
  window.removeEventListener('resize', handleViewportChanges);
});

// When dropdown opens, calculate optimal position
watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick();
    calculateOptimalPosition();
  }
});

// Handle select option
const handleSelect = (value: string | number) => {
  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const valueIndex = currentValue.indexOf(value);
    
    if (valueIndex === -1) {
      currentValue.push(value);
    } else {
      currentValue.splice(valueIndex, 1);
    }
    
    emit('update:modelValue', currentValue);
  } else {
    emit('update:modelValue', props.options.find(opt => opt.value === value)?.value ?? value);
    isOpen.value = false;
  }
};

// Get selected options label for display
const getSelectedLabel = computed(() => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    if (props.modelValue.length === 0) return 'Select options';
    
    const modelValueArray = props.modelValue; // This creates a properly typed reference
    const selectedOptions = props.options
      .filter(opt => modelValueArray.includes(opt.value))
      .map(opt => opt.label);
    
    if (selectedOptions.length > 2) {
      return `${selectedOptions.length} items selected`;
    }
    
    return selectedOptions.join(', ');
  } else {
    return (
      props.options.find((option) => option.value === props.modelValue)?.label ||
      'Select option'
    );
  }
});

// Check if an option is selected
const isOptionSelected = (value: string | number) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    return props.modelValue.includes(value);
  }
  return props.modelValue === value;
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
          'border-gray-300 dark:border-gray-600': !isOpen && !disabled && !error,
          'border-red-300 dark:border-red-700': error,
          'border-gray-200 dark:border-gray-700 opacity-75 cursor-not-allowed':
            disabled
        }"
      >
        <div class="flex items-center justify-between">
          <span
            class="truncate max-w-[calc(100%-24px)]"
            :class="{
              'text-gray-900 dark:text-gray-100': modelValue && (Array.isArray(modelValue) ? modelValue.length > 0 : modelValue !== ''),
              'text-gray-500': !modelValue || (Array.isArray(modelValue) && modelValue.length === 0) || modelValue === ''
            }"
          >
            {{ getSelectedLabel }}
          </span>
          <svg
            class="w-5 h-5 transition-transform duration-200 shrink-0"
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
      
      <!-- Teleport dropdown to body to avoid modal scrolling issues -->
      <Teleport to="body">
        <div
          v-if="isOpen && !disabled && selectRef"
          ref="dropdownRef"
          class="fixed z-[1000] bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg transition-opacity duration-150"
          :class="{'opacity-100': isOpen, 'opacity-0': !isOpen}"
          :style="{
            width: selectRef ? `${selectRef.offsetWidth}px` : 'auto',
            left: selectRef ? `${selectRef.getBoundingClientRect().left}px` : '0',
            top: shouldShowAbove 
              ? `${selectRef.getBoundingClientRect().top - 4 - (dropdownRef?.offsetHeight || 0)}px`
              : `${selectRef.getBoundingClientRect().bottom + 4}px`
          }"
        >
          <div class="py-1 overflow-auto" :style="{ maxHeight: maxDropdownHeight }">
            <button
              v-for="option in options"
              :key="option.value"
              type="button"
              @click="handleSelect(option.value)"
              class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150 flex items-center"
              :class="{
                'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300':
                  isOptionSelected(option.value),
                'text-gray-900 dark:text-gray-100': !isOptionSelected(option.value)
              }"
            >
              <span v-if="multiple" class="mr-2 flex-shrink-0">
                <input 
                  type="checkbox" 
                  :checked="isOptionSelected(option.value)" 
                  @click.stop
                  class="form-checkbox h-4 w-4 text-blue-600"
                />
              </span>
              <span class="truncate">{{ option.label }}</span>
            </button>
          </div>
        </div>
      </Teleport>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-500">
      {{ error }}
    </p>
  </div>
</template>

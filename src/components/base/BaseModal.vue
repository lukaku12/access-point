<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';

const props = defineProps<{
  show: boolean;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

// Handle scroll locking
const setScrollLock = (lock: boolean) => {
  if (lock) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
    document.documentElement.style.removeProperty('--scrollbar-width');
  }
};

watch(() => props.show, (newValue) => {
  setScrollLock(newValue);
});

onBeforeUnmount(() => {
  setScrollLock(false);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/50 dark:bg-black/70" 
          @click="$emit('close')"
        ></div>

        <!-- Modal -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-show="show"
            class="relative min-h-screen flex items-center justify-center p-4"
          >
            <div
              class="relative w-full max-h-[85vh] max-w-[95vw] xs:max-w-[90vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col"
            >
              <div class="border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col flex-1 min-h-0">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ title }}</h3>
                <div class="flex-1 mb-6 text-gray-500 dark:text-gray-300 overflow-y-auto">
                  <slot></slot>
                </div>
                <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button @click="$emit('close')" class="btn-secondary w-full sm:w-auto">
                    {{ cancelText || 'Cancel' }}
                  </button>
                  <button
                    @click="$emit('confirm')"
                    class="btn-primary w-full sm:w-auto"
                    :disabled="disabled"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <svg
                        v-if="loading"
                        class="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{ loading ? 'Loading...' : (confirmText || 'Confirm') }}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors;
}

/* Add smooth scrolling for modal content */
.max-h-[60vh] {
  scrollbar-width: thin;
  scroll-behavior: smooth;
}
</style>

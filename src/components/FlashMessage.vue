<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

onMounted(() => {
  if (props.duration !== 0) {
    setTimeout(() => {
      emit('close');
    }, props.duration || 5000); // Show for 5 seconds by default
  }
});
</script>

<template>
  <div
    class="fixed top-4 right-4 z-[1000] p-4 rounded-lg shadow-lg max-w-md animate-slide-in"
    :class="{
      'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-100':
        type === 'success',
      'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-100':
        type === 'error',
      'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100':
        type === 'info'
    }"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <!-- Success Icon -->
        <svg
          v-if="type === 'success'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-green-400 dark:text-green-300 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>

        <!-- Error Icon -->
        <svg
          v-else-if="type === 'error'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-red-400 dark:text-red-300 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>

        <!-- Info Icon -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-blue-400 dark:text-blue-300 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>

        <p>{{ message }}</p>
      </div>

      <!-- Close Icon -->
      <button
        @click="onClose"
        class="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>

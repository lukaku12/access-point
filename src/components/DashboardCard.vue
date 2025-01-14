<script setup lang="ts">
defineProps<{
  title: string;
  isLoading?: boolean;
}>();
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/60 dark:border-gray-700"
  >
    <div class="p-4">
      <h3
        class="text-lg font-medium text-gray-900 dark:text-white mb-4"
      >
        {{ title }}
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </h3>
      <div :class="{ 'opacity-50': isLoading }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

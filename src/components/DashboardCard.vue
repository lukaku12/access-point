<script setup lang="ts">
defineProps<{
  title: string;
  isLoading?: boolean;
}>();
</script>

<template>
  <div
    class="bg-white rounded-xl border border-gray-200/60 shadow-lg shadow-gray-200/40 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/60"
  >
    <div class="p-6">
      <h3
        class="text-base font-semibold text-gray-900 flex items-center justify-between"
      >
        {{ title }}
        <div v-if="isLoading" class="animate-pulse">
          <div class="h-4 w-4 bg-gray-200 rounded-full"></div>
        </div>
      </h3>
      <div :class="{ 'opacity-50': isLoading }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

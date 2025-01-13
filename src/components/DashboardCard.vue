<script setup lang="ts">
defineProps<{
  title: string;
  isLoading?: boolean;
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-4">
      {{ title }}
    </h2>
    <div v-if="isLoading" class="space-y-3">
      <div v-for="n in 4" :key="n" class="animate-pulse flex justify-between items-center">
        <div class="h-4 bg-slate-200 rounded w-1/3"></div>
        <div class="h-4 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

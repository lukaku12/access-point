<template>
  <div
    class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <h1
        class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8"
      >
        Umbrella Access Control
      </h1>
      <LoginForm />
      <p class="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
        &copy; 2025 Umbrella LLC. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/forms/LoginForm.vue';
</script>

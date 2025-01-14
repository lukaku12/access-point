<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">ESP32 Access Control</h1>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/forms/LoginForm.vue'
</script>

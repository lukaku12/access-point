<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getConfig, updateConfig } from '@/api/config';
import type { ConfigPayload, Config } from '@/types/config';
import ConfigForm from '@/components/forms/ConfigForm.vue';
import FlashMessage from '@/components/FlashMessage.vue';

const config = ref<Config>({
  auth_key: '',
  door_lock_variant: 'SOLENOID',
  door_lock_duration: 5,
  run_program_without_time: false,
  active: true
});

const isLoading = ref(false);
const hasError = ref(false);
const flash = ref<{
  type: 'success' | 'error' | 'info';
  message: string;
} | null>(null);

const authKey = ref('');

const isInitialLoading = ref(true); // New ref for initial loading state
const isSubmitting = ref(false); // New ref for form submission state

const loadConfig = async () => {
  try {
    isLoading.value = true;
    const response = await getConfig();
    config.value = {
      ...response,
      // Door lock duration is already in milliseconds from the API
      door_lock_duration: response.door_lock_duration
    };
    authKey.value = response.auth_key;
    hasError.value = false;
  } catch (err: any) {
    hasError.value = true;
    flash.value = {
      type: 'error',
      message: err.message || 'Failed to load configuration'
    };
  } finally {
    isLoading.value = false;
    isInitialLoading.value = false; // Set initial loading to false after first load
  }
};

onMounted(() => {
  loadConfig();
});

const handleSubmit = async (data: { config: ConfigPayload }) => {
  try {
    isSubmitting.value = true; // Use submitting state instead of loading
    const response = await updateConfig(data);

    // Update local state with the response
    config.value = {
      auth_key: response.auth_key,
      door_lock_variant: response.door_lock_variant,
      door_lock_duration: response.door_lock_duration,
      run_program_without_time: response.run_program_without_time,
      active: response.active
    };
    authKey.value = response.auth_key;

    // Update auth_key in localStorage
    const connectionData = localStorage.getItem('connection');
    if (connectionData) {
      const connection = JSON.parse(connectionData);
      connection.auth_key = response.auth_key;
      localStorage.setItem('connection', JSON.stringify(connection));
    }

    flash.value = {
      type: 'success',
      message: 'Configuration saved successfully!'
    };
  } catch (err: any) {
    flash.value = {
      type: 'error',
      message: err.message || 'Failed to save configuration'
    };
  } finally {
    isSubmitting.value = false;
  }
};

const clearFlash = () => {
  flash.value = null;
};
</script>

<template>
  <div class=" h-full min-h-[calc(100vh-152px)] mx-auto py-8">
    <FlashMessage
      v-if="flash"
      :message="flash.message"
      :type="flash.type"
      @close="clearFlash"
    />

    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        System Configuration
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Manage system settings and parameters
      </p>
    </div>

    <div v-if="isInitialLoading" class="flex items-center justify-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div
      v-else-if="hasError"
      class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div class="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mx-auto text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Failed to Load Configuration
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          There was an error loading the system configuration. Please try again.
        </p>
        <button
          @click="loadConfig"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
          {{ isLoading ? 'Loading...' : 'Retry Loading' }}
        </button>
      </div>
    </div>

    <ConfigForm
      v-else
      :config="config"
      :current-auth-key="authKey"
      :is-loading="isSubmitting"
      :is-disabled="hasError"
      @submit="handleSubmit"
      @error="(msg: any) => (flash = { type: 'error', message: msg })"
    />
  </div>
</template>

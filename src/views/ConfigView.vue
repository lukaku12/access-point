<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getConfig, updateConfig } from '@/api/config';
import type { Config } from '@/types/config';
import ConfigForm from '@/components/forms/ConfigForm.vue';

const config = ref<Config>({
    auth_key: 'N/A',
    door_lock_variant: 'SOLENOID',
    door_lock_duration: 5, // 5 seconds
    run_program_without_time: false,
    active: true
});
const isLoading = ref(false);
const error = ref<string>('');
const success = ref<string>('');
const hasError = ref(false);

const authKey = 'N/A'; // Get this from your auth store

onMounted(async () => {
    try {
        isLoading.value = true;
        config.value = await getConfig();
        hasError.value = false;
    } catch (err) {
        error.value = 'Failed to load configuration';
        hasError.value = true;
        console.error(err);
    } finally {
        isLoading.value = false;
    }
});

const handleSubmit = async (data: { newAuthKey: string; config: Config }) => {
    try {
        isLoading.value = true;
        error.value = '';
        success.value = '';

        await updateConfig({
            auth_key: authKey,
            config: {
                ...data.config,
                auth_key: data.newAuthKey || data.config.auth_key
            }
        });
        
        success.value = 'Configuration saved successfully!';
        config.value = data.config;
    } catch (err) {
        error.value = 'An error occurred while saving the configuration';
        console.error(err);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="max-w-4xl mx-auto py-8 px-4">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Configuration</h1>
            <p class="text-gray-600 dark:text-gray-400">Manage system settings and parameters</p>
        </div>

        <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
            {{ error }}
        </div>

        <div v-if="success" class="mb-4 p-4 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 rounded-lg">
            {{ success }}
        </div>

        <ConfigForm 
            :config="config" 
            :current-auth-key="authKey" 
            :is-loading="isLoading"
            :is-disabled="hasError"
            @submit="handleSubmit" 
        />

        <div v-if="isLoading" class="text-center py-8 text-gray-600 dark:text-gray-400">
            Loading configuration...
        </div>
    </div>
</template>

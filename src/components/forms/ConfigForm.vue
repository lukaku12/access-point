<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '../base/BaseInput.vue';
import BaseCheckbox from '../base/BaseCheckbox.vue';
import type { Config, DoorLockVariant } from '@/types/config';

interface Props {
    config: Config;
    currentAuthKey: string;
    isLoading?: boolean;
    isDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
    isDisabled: false
});

const emit = defineEmits<{
    (e: 'submit', data: { newAuthKey: string; config: Config }): void;
}>();

const newAuthKey = ref('');
const formData = ref<Config>({ ...props.config });

const doorLockVariants: { value: DoorLockVariant; label: string }[] = [
    { value: 'SOLENOID', label: 'Solenoid' },
    { value: 'MAGNETIC', label: 'Magnetic' }
];

const handleSubmit = () => {
    emit('submit', {
        newAuthKey: newAuthKey.value,
        config: formData.value
    });
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-6 h-full">
        <div class="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900">
                Security Settings
            </h2>

            <div class="space-y-4">
                <BaseInput 
                    :model-value="currentAuthKey"
                    label="Current Authentication Key" 
                    :disabled="true"
                />

                <BaseInput v-model="newAuthKey" label="New Authentication Key" placeholder="Enter new auth key"
                    help-text="Only alphanumeric characters allowed, minimum 4 characters" pattern="[A-Za-z0-9]+"
                    minlength="4" :disabled="isDisabled" />
            </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900">
                Door Lock Settings
            </h2>

            <div class="space-y-4">
                <div class="form-group">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Door Lock Variant
                    </label>
                    <select v-model="formData.door_lock_variant"
                        :disabled="isDisabled"
                        class="block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 px-4 py-3 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <option v-for="variant in doorLockVariants" :key="variant.value" :value="variant.value">
                            {{ variant.label }}
                        </option>
                    </select>
                </div>

                <BaseInput v-model="formData.door_lock_duration" type="number" label="Door Lock Duration (seconds)"
                    :min="1" :max="30" required :disabled="isDisabled" />
            </div>
        </div>

        <div class="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 pb-2 border-b border-blue-100 dark:border-blue-900">
                System Settings
            </h2>

            <div class="space-y-4">
                <BaseCheckbox
                    v-model="formData.run_program_without_time"
                    label="Run Program Without Time Check"
                    :disabled="isDisabled"
                />

                <BaseCheckbox
                    v-model="formData.active"
                    label="System Is Active"
                    :disabled="isDisabled"
                />
            </div>
        </div>

        <button type="submit" :disabled="isLoading || isDisabled"
            class="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-lg 
                   hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors 
                   disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isLoading">Saving...</span>
            <span v-else>Save Configuration</span>
        </button>
    </form>
</template>

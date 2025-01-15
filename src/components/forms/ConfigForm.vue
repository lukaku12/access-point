<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseInput from '../base/BaseInput.vue';
import BaseCheckbox from '../base/BaseCheckbox.vue';
import BaseSelectInput from '../base/BaseSelectInput.vue';
import BaseNumberInput from '../base/BaseNumberInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import type { Config, ConfigPayload, DoorLockVariant, ConfigUpdatePayload } from '@/types/config';

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
    (e: 'submit', data: ConfigUpdatePayload): void;
    (e: 'error', message: string): void;
}>();

const { errors, validateField, isValid } = useFormValidation();

const msToSeconds = (ms: number) => Math.round(ms / 1000);
const secondsToMs = (seconds: number) => seconds * 1000;

const newAuthKey = ref('');
const formData = ref<Config>({
    ...props.config,
    door_lock_duration: msToSeconds(props.config.door_lock_duration)
});

// Watch for config changes from parent
watch(() => props.config, (newConfig) => {
    formData.value = {
        ...newConfig,
        door_lock_duration: msToSeconds(newConfig.door_lock_duration)
    };
}, { deep: true });

const doorLockVariants: { value: DoorLockVariant; label: string }[] = [
    { value: 'SOLENOID', label: 'Solenoid' },
    { value: 'MAGNETIC', label: 'Magnetic' }
];

// Validation rules
const validationRules = {
    door_lock_variant: {
        required: (v: string) => !!v || 'Door lock variant is required',
    },
    door_lock_duration: {
        required: (v: number) => v > 0 || 'Door lock duration is required',
        range: (v: number) => (v >= 1 && v <= 30) || 'Duration must be between 1 and 30 seconds'
    }
};

// Validate all fields
const validateForm = (): boolean => {
    let isFormValid = true;

    // Validate main fields
    isFormValid = validateField('door_lock_variant', formData.value.door_lock_variant, validationRules.door_lock_variant) && isFormValid;
    isFormValid = validateField('door_lock_duration', formData.value.door_lock_duration, validationRules.door_lock_duration) && isFormValid;

    // Validate new auth key if provided
    if (newAuthKey.value) {
        isFormValid = validateField('new_auth_key', newAuthKey.value, {
            format: (v: string) => /^[A-Za-z0-9]{4,}$/.test(v) || 'Authentication key must be at least 4 alphanumeric characters'
        }) && isFormValid;
    }

    return isFormValid;
};

const handleSubmit = () => {
    if (!validateForm()) return;
    
    const configPayload: ConfigPayload = {
        current_auth_key: props.currentAuthKey,
        auth_key: newAuthKey.value || props.currentAuthKey,
        door_lock_variant: formData.value.door_lock_variant,
        door_lock_duration: secondsToMs(formData.value.door_lock_duration),
        run_program_without_time: formData.value.run_program_without_time,
        active: formData.value.active
    };

    emit('submit', { config: configPayload });
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
                <BaseSelectInput
                    v-model="formData.door_lock_variant"
                    :options="doorLockVariants"
                    label="Door Lock Variant"
                    required
                    :error="errors.door_lock_variant"
                    :disabled="isDisabled"
                />

                <BaseNumberInput
                    v-model="formData.door_lock_duration"
                    label="Door Lock Duration"
                    help-text="Duration in seconds (1-30 seconds)"
                    :error="errors.door_lock_duration"
                    :min="1"
                    :max="30"
                    :step="1"
                    required
                    :disabled="isDisabled"
                />
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

        <button type="submit" 
            :disabled="isLoading || isDisabled || !isValid"
            class="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-lg 
                   hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors 
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
            </span>
            <span v-else>Save Configuration</span>
        </button>
    </form>
</template>

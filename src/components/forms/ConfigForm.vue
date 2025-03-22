<script setup lang="ts">
import { ref, watch } from 'vue';
import BaseInput from '../base/BaseInput.vue';
import BaseCheckbox from '../base/BaseCheckbox.vue';
import BaseSelectInput from '../base/BaseSelectInput.vue';
import BaseNumberInput from '../base/BaseNumberInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import type {
  Config,
  ConfigPayload,
  DoorLockVariant,
  ConfigUpdatePayload
} from '@/types/config';

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
  (e: 'restart'): void;
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
watch(
  () => props.config,
  (newConfig) => {
    formData.value = {
      ...newConfig,
      door_lock_duration: msToSeconds(newConfig.door_lock_duration)
    };
  },
  { deep: true }
);

const doorLockVariants: { value: DoorLockVariant; label: string }[] = [
  { value: 'SOLENOID', label: 'Solenoid' },
  { value: 'MAGNETIC', label: 'Magnetic' }
];

// Validation rules
const validationRules = {
  door_lock_variant: {
    required: (v: string) => !!v || 'Door lock variant is required'
  },
  door_lock_duration: {
    required: (v: number) => v > 0 || 'Door lock duration is required',
    range: (v: number) =>
      (v >= 1 && v <= 30) || 'Duration must be between 1 and 30 seconds'
  }
};

// Validate all fields
const validateForm = (): boolean => {
  let isFormValid = true;

  // Validate main fields
  isFormValid =
    validateField(
      'door_lock_variant',
      formData.value.door_lock_variant,
      validationRules.door_lock_variant
    ) && isFormValid;
  isFormValid =
    validateField(
      'door_lock_duration',
      formData.value.door_lock_duration,
      validationRules.door_lock_duration
    ) && isFormValid;

  // Validate new auth key if provided
  if (newAuthKey.value) {
    isFormValid =
      validateField('new_auth_key', newAuthKey.value, {
        format: (v: string) =>
          /^[A-Za-z0-9]{4,}$/.test(v) ||
          'Authentication key must be at least 4 alphanumeric characters'
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
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Security Settings Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
        <div class="flex items-center mb-4">
          <i class="fas fa-shield-alt text-blue-500 mr-2"></i>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Security Settings
          </h2>
        </div>
        <div class="space-y-3">
          <BaseInput :model-value="currentAuthKey" label="Current Authentication Key" :disabled="true" required
            class="mb-2" />
          <BaseInput v-model="newAuthKey" label="New Authentication Key" placeholder="Enter new auth key"
            help-text="Minimum 4 alphanumeric characters" pattern="[A-Za-z0-9]+" minlength="4" :disabled="isDisabled" />
        </div>
      </div>

      <!-- Door Lock Settings Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
        <div class="flex items-center mb-4">
          <i class="fas fa-door-closed text-blue-500 mr-2"></i>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Door Lock Settings
          </h2>
        </div>
        <div class="space-y-3">
          <BaseSelectInput v-model="formData.door_lock_variant" :options="doorLockVariants" label="Door Lock Variant"
            required :error="errors.door_lock_variant" :disabled="isDisabled" />
          <BaseNumberInput v-model="formData.door_lock_duration" label="Door Lock Duration" help-text="1-30 seconds"
            :error="errors.door_lock_duration" :min="1" :max="30" :step="1" required :disabled="isDisabled" />
        </div>
      </div>


        <!-- System Settings Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 lg:col-span-1">
          <!-- <div class="flex items-center mb-4">
          <i class="fas fa-cogs text-blue-500 mr-2"></i>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            System Settings
          </h2>
        </div> -->


          <BaseCheckbox v-model="formData.run_program_without_time" label="Run Program Without Time Check"
            :disabled="isDisabled" required />
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 lg:col-span-1">

          <BaseCheckbox v-model="formData.active" label="System Is Active" :disabled="isDisabled" required />
        </div>


    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
      <button
        type="button"
        @click="$emit('restart')"
        :disabled="isDisabled"
        class="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Restart Access Point
      </button>

      <button 
        type="submit" 
        :disabled="isLoading || isDisabled || !isValid"
        class="w-full sm:w-auto px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <template v-if="isLoading">
          <svg 
            class="w-5 h-5 animate-spin" 
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
            />
            <path 
              class="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Saving...</span>
        </template>
        <template v-else>
          <svg 
            class="w-5 h-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          <span>Save Configuration</span>
        </template>
      </button>
    </div>
  </form>
</template>

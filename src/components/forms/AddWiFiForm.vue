<script setup lang="ts">
import { ref } from 'vue';
import type { WiFiNetwork } from '@/types/wifi';
import BaseInput from '@/components/base/BaseInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';

const emit = defineEmits<{
  (e: 'submit', form: Partial<WiFiNetwork>): void;
}>();

const ssid = ref('');
const password = ref('');
const isSubmitting = ref(false);

const { errors, touched, validateField, isValid } = useFormValidation();

const validateForm = () => {
  validateField('ssid', ssid.value, {
    required: (v) => !!v || 'SSID is required',
    minLength: (v) => v.length >= 2 || 'SSID must be at least 2 characters'
  });

  validateField('password', password.value, {
    required: (v) => !!v || 'Password is required',
    minLength: (v) => v.length >= 5 || 'Password must be at least 5 characters'
  });

  return isValid.value;
};

const handleBlur = (field: string) => {
  if (field === 'ssid') {
    validateField('ssid', ssid.value, {
      required: (v) => !!v || 'SSID is required',
      minLength: (v) => v.length >= 2 || 'SSID must be at least 2 characters'
    });
  } else if (field === 'password') {
    validateField('password', password.value, {
      required: (v) => !!v || 'Password is required',
      minLength: (v) => v.length >= 5 || 'Password must be at least 5 characters'
    });
  }
};

const handleSubmit = () => {
  if (isSubmitting.value) return;
  
  if (validateForm()) {
    isSubmitting.value = true;
    emit('submit', {
      ssid: ssid.value,
      password: password.value
    });
  }
};

defineExpose({ handleSubmit, isSubmitting });
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="ssid"
      label="SSID"
      type="text"
      required
      placeholder="Enter network name"
      :error="touched?.ssid ? errors?.ssid : ''"
      @blur="() => handleBlur('ssid')"
    />
    
    <BaseInput
      v-model="password"
      label="Password"
      type="password"
      required
      placeholder="Enter network password"
      help-text="Password must be at least 5 characters long"
      :error="touched?.password ? errors?.password : ''"
      @blur="() => handleBlur('password')"
    />

    <div v-if="!isValid && Object.keys(touched).length > 0" class="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
      Please fix the validation errors before submitting.
    </div>
  </form>
</template>

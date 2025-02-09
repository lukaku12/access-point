<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Card } from '@/types/card';
import BaseInput from '@/components/base/BaseInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';

const props = defineProps<{
  card: Card;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: Partial<Card>): void;
}>();

const formData = ref({
  number: props.card.number,
  personal_id: props.card.personal_id || '',
  start_date: props.card.start_date,
  end_date: props.card.end_date || ''
});

const { errors, touched, validateField, isValid } = useFormValidation();

const validateForm = () => {
  validateField('cardNumber', formData.value.number, {
    required: (v) => !!v || 'Card number is required',
    minLength: (v) =>
      v.length >= 3 || 'Card number must be at least 3 characters'
  });

  validateField('startDate', formData.value.start_date, {
    required: (v) => !!v || 'Start date is required'
  });

  if (formData.value.end_date) {
    validateField('endDate', formData.value.end_date, {
      greaterThanStart: (v) =>
        new Date(v) > new Date(formData.value.start_date) ||
        'End date must be after start date'
    });
  }

  return isValid.value;
};

const handleBlur = (field: string) => {
  if (field === 'cardNumber') {
    validateField('cardNumber', formData.value.number, {
      required: (v) => !!v || 'Card number is required'
    });
  } else if (field === 'startDate') {
    validateField('startDate', formData.value.start_date, {
      required: (v) => !!v || 'Start date is required'
    });
  } else if (field === 'endDate' && formData.value.end_date) {
    validateField('endDate', formData.value.end_date, {
      greaterThanStart: (v) =>
        new Date(v) > new Date(formData.value.start_date) ||
        'End date must be after start date'
    });
  }
};

const isSubmitting = ref(false);

watch(
  () => props.isLoading,
  (newValue) => {
    isSubmitting.value = !!newValue;
  }
);

const handleSubmit = () => {
  if (validateForm()) {
    isSubmitting.value = true;
    emit('submit', {
      ...formData.value,
      id: props.card.id
    });
  }
};

defineExpose({
  handleSubmit,
  isSubmitting
});
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-4 sm:space-y-8 w-full max-w-2xl mx-auto px-4 sm:px-0"
  >
    <!-- Card Details Section -->
    <div
      class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/40 dark:shadow-gray-900/40"
    >
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
            Card Details
          </h4>
          <div
            v-if="isSubmitting"
            class="text-sm text-blue-600 dark:text-blue-400"
          >
            <span class="inline-block animate-spin mr-2">↻</span>
            Saving changes...
          </div>
        </div>

        <!-- Card Number Input -->
        <BaseInput
          v-model="formData.number"
          label="Card Number"
          :error="touched?.cardNumber ? errors?.cardNumber : ''"
          required
          @blur="() => handleBlur('cardNumber')"
        />

        <!-- Personal ID Input -->
        <BaseInput
          v-model="formData.personal_id"
          label="Personal ID"
          placeholder="Enter personal ID"
        />
      </div>
    </div>

    <!-- Validity Period Section -->
    <div
      class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/40 dark:shadow-gray-900/40"
    >
      <h4
        class="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6"
      >
        Validity Period
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <BaseInput
          v-model="formData.start_date"
          type="date"
          label="Start Date"
          required
          :error="touched?.startDate ? errors?.startDate : ''"
          @blur="() => handleBlur('startDate')"
        />
        <BaseInput
          v-model="formData.end_date"
          type="date"
          label="End Date"
          :error="touched?.endDate ? errors?.endDate : ''"
          @blur="() => handleBlur('endDate')"
        />
      </div>
    </div>

    <!-- Validation message -->
    <div
      v-if="!isValid && Object.keys(touched).length > 0"
      class="rounded-lg p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
    >
      <div class="text-sm">
        Please fix the validation errors before submitting.
      </div>
    </div>
  </form>
</template>

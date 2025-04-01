<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelectInput from '@/components/base/BaseSelectInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import type { RestartScheduleFormData } from '@/types/restartSchedules';

const emit = defineEmits<{
  (e: 'submit', data: RestartScheduleFormData): void;
}>();

const isSubmitting = ref(false);

const formData = reactive<RestartScheduleFormData>({
  schedule_type: 'daily',
  time: '03:00',
  days_of_week: [], // Mon, Wed, Fri
  days_of_month: [],
  restart_date: new Date().toISOString().split('T')[0] // Today in YYYY-MM-DD
});

// Computed property for restart_date to handle v-model binding
const restartDate = computed({
  get: () => formData.restart_date || '',
  set: (value: string) => {
    formData.restart_date = value;
  }
});

// Days of week options - with short names
const daysOfWeekOptions = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 7 }
];

// Generate days of month options (1-28) - using simpler format
const daysOfMonthOptions = Array.from({ length: 28 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1
}));

// Toggle day of week selection directly
const toggleDayOfWeek = (day: number) => {
  const index = formData.days_of_week?.indexOf(day);
  if (index !== undefined && index >= 0) {
    formData.days_of_week?.splice(index, 1);
  } else {
    if (!formData.days_of_week) {
      formData.days_of_week = [];
    }
    formData.days_of_week.push(day);
  }
};

// Toggle day of month selection directly
const toggleDayOfMonth = (day: number) => {
  const index = formData.days_of_month?.indexOf(day);
  if (index !== undefined && index >= 0) {
    formData.days_of_month?.splice(index, 1);
  } else {
    if (!formData.days_of_month) {
      formData.days_of_month = [];
    }
    formData.days_of_month.push(day);
  }
};

// Check if a day of week is selected
const isDayOfWeekSelected = (day: number) => {
  return formData.days_of_week?.includes(day);
};

// Check if a day of month is selected
const isDayOfMonthSelected = (day: number) => {
  return formData.days_of_month?.includes(day);
};

// Define the type for formData fields
interface FormFields {
  schedule_type: string;
  time: string;
  days_of_week: number[] | undefined;
  days_of_month: number[] | undefined;
  restart_date: string;
}

const { errors, validateField, validateAll } = useFormValidation<FormFields>();

const validationRules = {
  schedule_type: [
    { required: true, message: 'Schedule type is required' },
    {
      validator: (value: string) =>
        ['daily', 'weekly', 'monthly', 'once'].includes(value),
      message: 'Invalid schedule type'
    }
  ],
  time: [
    { required: true, message: 'Time is required' },
    {
      pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: 'Time must be in HH:MM format'
    }
  ],
  days_of_week: [
    {
      validator: (value: number[] | undefined) =>
        !value || value.length > 0,
      message: 'Select at least one day of week',
      shouldValidate: () => formData.schedule_type === 'weekly'
    }
  ],
  days_of_month: [
    {
      validator: (value: number[] | undefined) =>
        !value || value.length > 0,
      message: 'Select at least one day of month',
      shouldValidate: () => formData.schedule_type === 'monthly'
    }
  ],
  restart_date: [
    {
      required: true,
      message: 'Restart date is required',
      shouldValidate: () => formData.schedule_type === 'once'
    },
    {
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      message: 'Date must be in YYYY-MM-DD format',
      shouldValidate: () => formData.schedule_type === 'once'
    }
  ]
};

// Update form data based on schedule type
watch(
  () => formData.schedule_type,
  () => {
    // Reset field errors when changing schedule type
    (errors.value as any).days_of_week = '';
    (errors.value as any).days_of_month = '';
    (errors.value as any).restart_date = '';
  }
);

// Reset form data to initial state
const resetForm = () => {
  formData.schedule_type = 'daily';
  formData.time = '03:00';
  formData.days_of_week = [];
  formData.days_of_month = [];
  formData.restart_date = new Date().toISOString().split('T')[0];
  
  // Clear validation errors
  Object.keys(errors.value).forEach(key => {
    (errors.value as any)[key] = '';
  });
};

const handleSubmit = () => {
  const valid = validateAll(
    {
      schedule_type: formData.schedule_type,
      time: formData.time,
      days_of_week: formData.days_of_week,
      days_of_month: formData.days_of_month,
      restart_date: restartDate.value
    },
    validationRules as any
  );

  if (!valid) return;

  isSubmitting.value = true;
  
  const submitData: RestartScheduleFormData = {
    schedule_type: formData.schedule_type,
    time: formData.time
  };

  // Add type-specific fields
  if (formData.schedule_type === 'weekly') {
    submitData.days_of_week = formData.days_of_week;
  } else if (formData.schedule_type === 'monthly') {
    submitData.days_of_month = formData.days_of_month;
  } else if (formData.schedule_type === 'once') {
    submitData.restart_date = restartDate.value;
  }

  emit('submit', submitData);
  // We'll reset the form in the parent component after successful API call
};

defineExpose({ handleSubmit, isSubmitting, resetForm });
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <BaseSelectInput
      v-model="formData.schedule_type"
      label="Schedule Type"
      :options="[
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'once', label: 'One Time' }
      ]"
      :error="(errors as any).schedule_type"
      @blur="validateField('schedule_type', formData.schedule_type, validationRules.schedule_type)"
      required
    />

    <BaseInput
      v-model="formData.time"
      label="Time (24-hour format)"
      type="time"
      :error="(errors as any).time"
      @blur="validateField('time', formData.time, validationRules.time)"
      required
    />

    <!-- Days of week UI -->
    <div v-if="formData.schedule_type === 'weekly'">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Days of Week <span class="text-red-500">*</span>
      </label>
      <div class="days-of-week-selector flex flex-wrap gap-2">
        <button
          v-for="day in daysOfWeekOptions"
          :key="day.value"
          type="button"
          @click="toggleDayOfWeek(day.value)"
          class="day-btn w-12 h-12 flex items-center justify-center rounded-full text-sm font-medium transition-colors"
          :class="{
            'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-2 border-blue-500': isDayOfWeekSelected(day.value),
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': !isDayOfWeekSelected(day.value)
          }"
        >
          {{ day.label }}
        </button>
      </div>
      <p v-if="(errors as any).days_of_week" class="mt-1 text-sm text-red-600 dark:text-red-500">
        {{ (errors as any).days_of_week }}
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
        Select one or more days when the device should restart
      </p>
    </div>

    <!-- Days of month UI -->
    <div v-if="formData.schedule_type === 'monthly'">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Days of Month <span class="text-red-500">*</span>
      </label>
      <div class="days-of-month-selector grid grid-cols-7 gap-1">
        <button
          v-for="day in daysOfMonthOptions"
          :key="day.value"
          type="button"
          @click="toggleDayOfMonth(day.value)"
          class="day-btn w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors"
          :class="{
            'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-2 border-blue-500': isDayOfMonthSelected(day.value),
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': !isDayOfMonthSelected(day.value)
          }"
        >
          {{ day.label }}
        </button>
      </div>
      <p v-if="(errors as any).days_of_month" class="mt-1 text-sm text-red-600 dark:text-red-500">
        {{ (errors as any).days_of_month }}
      </p>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
        Select one or more days of the month when the device should restart
      </p>
    </div>

    <!-- Restart date input for once type -->
    <div v-if="formData.schedule_type === 'once'">
      <BaseInput
        v-model="restartDate"
        label="Date"
        type="date"
        :error="(errors as any).restart_date"
        @blur="validateField('restart_date', restartDate, validationRules.restart_date)"
        required
      />
    </div>
  </form>
</template>

<style scoped>
.days-of-week-selector .day-btn,
.days-of-month-selector .day-btn {
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.days-of-week-selector .day-btn:hover,
.days-of-month-selector .day-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.days-of-week-selector .day-btn:active,
.days-of-month-selector .day-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>

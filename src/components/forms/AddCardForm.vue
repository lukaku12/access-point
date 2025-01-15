<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { fetchUnregisteredCards } from '@/api/cards';
import type { Card } from '@/types/card';
import BaseInput from '@/components/base/BaseInput.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import type { UnregisteredCard } from '@/types/card';

const emit = defineEmits<{
  (e: 'submit', data: Partial<Card>): void;
}>();

const formData = ref({
  number: '', // This will store the actual card number
  personal_id: '',
  start_date: '',
  end_date: ''
});

const searchQuery = ref('');
const isOpen = ref(false);

const filteredCards = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return unregisteredCards.value.filter((card) =>
    card.card_number.toLowerCase().includes(query)
  );
});

// Update the watch to sync with formData.number
watch(searchQuery, (newValue) => {
  formData.value.number = newValue;
});

const unregisteredCards = ref<UnregisteredCard[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

const loadUnregisteredCards = async () => {
  isLoading.value = true;
  try {
    const { data } = await fetchUnregisteredCards();
    unregisteredCards.value = data.data.slice(0, 5); // Get max 5 cards
  } catch (error) {
    console.error('Error loading unregistered cards:', error);
  } finally {
    isLoading.value = false;
  }
};

const closeDropdown = () => {
  window.setTimeout(() => {
    isOpen.value = false;
  }, 200);
};

const { errors, touched, validateField, isValid } = useFormValidation();

const validateForm = () => {
  validateField('cardNumber', searchQuery.value, {
    required: (v) => !!v || 'Card number is required',
    minLength: (v) =>
      v.length >= 3 || 'Card number must be at least 3 characters'
  });

  validateField('startDate', formData.value.start_date, {
    required: (v) => !!v || 'Start date is required'
  });

  // Only validate end date if it has a value
  if (formData.value.end_date) {
    validateField('endDate', formData.value.end_date, {
      greaterThanStart: (v) =>
        new Date(v) > new Date(formData.value.start_date) ||
        'End date must be after start date'
    });
  }

  return isValid.value;
};

// Handle card selection
const handleCardSelect = (card: UnregisteredCard) => {
  searchQuery.value = card.card_number;
  formData.value.number = card.card_number;
  isOpen.value = false;
};

// Update the submit handler
const handleSubmit = () => {
  if (validateForm()) {
    isSubmitting.value = true;
    const submitData = {
      ...formData.value,
      number: searchQuery.value // Ensure we're sending the selected/typed card number
    };
    emit('submit', submitData);
  }
};

// Add validation on blur
const handleBlur = (field: string) => {
  if (field === 'cardNumber') {
    validateField('cardNumber', searchQuery.value, {
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

defineExpose({
  handleSubmit,
  isSubmitting
});

onMounted(loadUnregisteredCards);
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-8 w-full max-w-2xl mx-auto px-4 sm:px-0">
    <!-- Card Details Section -->
    <div
      class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/40 dark:shadow-gray-900/40 hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-gray-900/60 transition-all duration-200"
    >
      <div class="space-y-4 sm:space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Card Details</h4>
          <button
            type="button"
            @click="loadUnregisteredCards"
            class="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 gap-2"
            :disabled="isLoading"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              :class="{ 'animate-spin': isLoading }"
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
            {{ isLoading ? 'Loading cards...' : 'Refresh Cards' }}
          </button>
        </div>

        <!-- Card Number Input -->
        <div class="relative">
          <BaseInput
            v-model="searchQuery"
            label="Card Number"
            placeholder="Type or select card number"
            help-text="Start typing to search or select from available cards"
            :error="touched?.cardNumber ? errors?.cardNumber : ''"
            required
            @focus="isOpen = true"
            @blur="
              () => {
                closeDropdown();
                handleBlur('cardNumber');
              }
            "
          />

          <div
            v-if="isOpen && filteredCards.length > 0"
            class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-auto"
          >
            <div
              v-for="card in filteredCards"
              :key="card.card_number"
              @mousedown="handleCardSelect(card)"
              class="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm transition-colors duration-150"
            >
              <div class="font-medium dark:text-white">{{ card.card_number }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Last seen: {{ new Date(card.last_seen).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- Personal ID Input - removed required prop -->
        <BaseInput
          v-model="formData.personal_id"
          label="Personal ID"
          placeholder="Enter personal ID"
        />
      </div>
    </div>

    <!-- Validity Period Section -->
    <div
      class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/40 dark:shadow-gray-900/40 hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-gray-900/60 transition-all duration-200"
    >
      <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Validity Period</h4>
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

    <!-- Simplified validation message -->
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

<style scoped>
/* Remove default select appearance */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

/* Remove calendar icon from date inputs */
input[type='date']::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

.shadow-md {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom scrollbar for the dropdown */
.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

/* Replace the date input styles with these */
.date-input {
  position: relative;
  cursor: pointer;
}

.date-input::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  color: transparent;
  cursor: pointer;
  z-index: 1;
}

/* Remove the previous calendar icon styles */

/* Add these new styles */
.hover\:shadow-xl:hover {
  filter: brightness(1.02);
}

/* Add subtle gradient background */
.bg-white {
  background: linear-gradient(to bottom right, white, #fafafa);
}

.dark .bg-white {
  background: linear-gradient(to bottom right, #1f2937, #111827);
}

/* Update scrollbar colors for dark mode */
.dark .overflow-auto {
  scrollbar-color: #4b5563 #1f2937;
}

.dark .overflow-auto::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .overflow-auto::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

/* Update hover effect for dark mode */
.dark .hover\:shadow-xl:hover {
  filter: brightness(1.1);
}

/* Add responsive styles */
@media (max-width: 640px) {
  .overflow-auto::-webkit-scrollbar {
    width: 4px;
  }
  
  input[type='date'],
  input[type='text'],
  input[type='number'] {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardCard from '@/components/DashboardCard.vue';
import RestartSchedulesTable from '@/components/RestartSchedulesTable.vue';
import FlashMessage from '@/components/FlashMessage.vue';
import { useFlashMessage } from '@/composables/useFlashMessage';
import { usePagination } from '@/composables/usePagination';
import TablePagination from '@/components/TablePagination.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import AddRestartScheduleForm from '@/components/forms/AddRestartScheduleForm.vue';
import EditRestartScheduleForm from '@/components/forms/EditRestartScheduleForm.vue';
import {
  fetchRestartSchedules,
  createRestartSchedule,
  updateRestartSchedule,
  deleteRestartSchedule,
  deleteAllRestartSchedules
} from '@/api/restartSchedules';
import type { RestartSchedule, RestartScheduleFormData } from '@/types/restartSchedules';
import {
  isCreateRestartScheduleSuccess,
  isUpdateRestartScheduleSuccess,
  isDeleteRestartScheduleSuccess,
  isDeleteAllRestartSchedulesSuccess,
  isApiError
} from '@/types/restartSchedules';

// State variables
const schedules = ref<RestartSchedule[]>([]);
const loading = ref(true);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDeleteAllModal = ref(false);
const selectedSchedule = ref<RestartSchedule | null>(null);

// Form refs
interface AddScheduleFormExposed {
  handleSubmit: () => void;
  isSubmitting: boolean;
  resetForm: () => void;
}

interface EditScheduleFormExposed {
  handleSubmit: () => void;
  isSubmitting: boolean;
  resetForm: () => void;
}

const addScheduleForm = ref<AddScheduleFormExposed | null>(null);
const editScheduleForm = ref<EditScheduleFormExposed | null>(null);

// Action loading states
const isDeleteLoading = ref(false);
const isDeleteAllLoading = ref(false);
const isEditLoading = ref(false);

// Flash message
const { currentMessage, showMessage, clearMessage } = useFlashMessage();

// Pagination - get the actual pagination state object for direct access
const { pagination: paginationRef, getVisiblePages, updatePagination } = usePagination();
// Create our own local refs for direct access
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const perPage = ref(10);

// Extract the actual pagination object from the ref
const paginationValue = paginationRef as unknown as { 
  currentPage: number; 
  totalPages: number; 
  totalItems: number; 
  perPage: number; 
};

// Keep pagination state in sync
const syncPagination = () => {
  currentPage.value = paginationValue.currentPage;
  totalPages.value = paginationValue.totalPages;
  totalItems.value = paginationValue.totalItems;
  perPage.value = paginationValue.perPage;
};

// Initial sync
syncPagination();

const refreshSchedules = async () => {
  loading.value = true;
  try {
    const { data } = await fetchRestartSchedules(
      currentPage.value,
      perPage.value
    );
    if (data.status === 'success') {
      schedules.value = data.data;
      
      // Update pagination state based on API response
      updatePagination({
        totalItems: data.pagination.total,
        totalPages: data.pagination.total_pages,
        currentPage: data.pagination.page,
        perPage: data.pagination.per_page
      });
      
      // Explicitly update the local refs for direct template access
      currentPage.value = data.pagination.page;
      totalPages.value = data.pagination.total_pages;
      totalItems.value = data.pagination.total;
      perPage.value = data.pagination.per_page;
      
      console.log('Pagination updated:', {
        currentPage: currentPage.value,
        totalPages: totalPages.value,
        totalItems: totalItems.value,
        perPage: perPage.value
      });
    }
  } catch (error: any) {
    console.error('Error fetching restart schedules:', error);
    showMessage(
      error.message || 'Failed to fetch restart schedules',
      'error'
    );
  } finally {
    loading.value = false;
  }
};

const handlePageChange = async (page: number) => {
  // Update the current page value immediately for UI feedback
  currentPage.value = page;
  
  // Update the pagination state
  updatePagination({ currentPage: page });
  
  // Fetch the updated data for the new page
  await refreshSchedules();
};

const addNewSchedule = () => {
  showAddModal.value = true;
};

const editSchedule = (schedule: RestartSchedule) => {
  selectedSchedule.value = schedule;
  showEditModal.value = true;
};

const deleteSchedulePrompt = (schedule: RestartSchedule) => {
  selectedSchedule.value = schedule;
  showDeleteModal.value = true;
};

const deleteAllSchedulesPrompt = () => {
  showDeleteAllModal.value = true;
};

// Helper function to safely get message from API error
const getErrorMessage = (data: any): string => {
  if (isApiError(data)) {
    return data.message;
  } else if (typeof data === 'object' && data && 'message' in data) {
    return String(data.message);
  } else {
    return 'Unknown error';
  }
};

// Handle add schedule form submission
const handleAddSchedule = async (formData: RestartScheduleFormData) => {
  console.log('Adding schedule with data:', formData);
  try {
    const { data } = await createRestartSchedule(formData);
    console.log('Add schedule response:', data);
    console.log('Is success?', isCreateRestartScheduleSuccess(data));
    
    if (typeof data === 'object' && data && 'status' in data && 'code' in data) {
      console.log('Response status:', data.status);
      console.log('Response code:', data.code);
    }
    
    if (isCreateRestartScheduleSuccess(data)) {
      console.log('Add schedule success, showing message');
      showMessage('Restart schedule added successfully', 'success');
      console.log('Refreshing schedules');
      await refreshSchedules();
      console.log('Closing add modal');
    } else if (isApiError(data)) {
      console.log('Add schedule API error:', getErrorMessage(data));
      showMessage(getErrorMessage(data) || 'Failed to add restart schedule', 'error');
    } else {
      console.log('Unexpected response format:', data);
      showMessage('Unexpected server response', 'error');
    }
    
    // Always refresh and close the modal if we got a response
    if (typeof data === 'object' && data && 'status' in data && data.status === 'success') {
      showAddModal.value = false;
      // Reset the form for next use
      console.log('Resetting form data');
      if (addScheduleForm.value && addScheduleForm.value.resetForm) {
        addScheduleForm.value.resetForm();
      }
    }
  } catch (error: any) {
    console.error('Error adding restart schedule:', error);
    showMessage(
      error.message || 'An unexpected error occurred while adding restart schedule',
      'error'
    );
  } finally {
    console.log('Resetting add form submitting state');
    if (addScheduleForm.value) {
      addScheduleForm.value.isSubmitting = false;
    }
  }
};

// Handle edit schedule form submission
const handleEditSchedule = async (formData: RestartScheduleFormData) => {
  isEditLoading.value = true;
  try {
    if (!selectedSchedule.value) {
      throw new Error('No schedule selected for editing');
    }
    
    const { data } = await updateRestartSchedule({
      ...formData,
      id: selectedSchedule.value.id
    });
    
    if (isUpdateRestartScheduleSuccess(data)) {
      console.log('Edit schedule success, showing message');
      showMessage('Restart schedule updated successfully', 'success');
      console.log('Refreshing schedules');
      await refreshSchedules();
      console.log('Closing edit modal');
      showEditModal.value = false;
      
      // Reset the form for next use
      console.log('Resetting edit form data');
      if (editScheduleForm.value && editScheduleForm.value.resetForm) {
        editScheduleForm.value.resetForm();
      }
    } else if (isApiError(data)) {
      showMessage(getErrorMessage(data) || 'Failed to update restart schedule', 'error');
    }
  } catch (error: any) {
    console.error('Error updating restart schedule:', error);
    showMessage(
      error.message || 'An unexpected error occurred while updating restart schedule',
      'error'
    );
  } finally {
    isEditLoading.value = false;
    if (editScheduleForm.value) {
      editScheduleForm.value.isSubmitting = false;
    }
  }
};

// Handle delete confirmation
const handleDeleteConfirm = async () => {
  if (!selectedSchedule.value) return;
  
  isDeleteLoading.value = true;
  try {
    const { data } = await deleteRestartSchedule(selectedSchedule.value.id);
    
    if (isDeleteRestartScheduleSuccess(data)) {
      showMessage('Restart schedule deleted successfully', 'success');
      await refreshSchedules();
    } else if (isApiError(data)) {
      showMessage(getErrorMessage(data) || 'Failed to delete restart schedule', 'error');
    }
  } catch (error: any) {
    console.error('Error deleting restart schedule:', error);
    showMessage(
      error.message || 'An unexpected error occurred while deleting restart schedule',
      'error'
    );
  } finally {
    isDeleteLoading.value = false;
    showDeleteModal.value = false;
  }
};

// Handle delete all confirmation
const handleDeleteAllConfirm = async () => {
  console.log('Deleting all schedules');
  isDeleteAllLoading.value = true;
  try {
    const { data } = await deleteAllRestartSchedules();
    console.log('Delete all schedules response:', data);
    console.log('Is success?', isDeleteAllRestartSchedulesSuccess(data));
    
    if (typeof data === 'object' && data && 'status' in data && 'code' in data) {
      console.log('Response status:', data.status);
      console.log('Response code:', data.code);
    }
    
    if (isDeleteAllRestartSchedulesSuccess(data)) {
      console.log('Delete all schedules success, showing message');
      showMessage('All restart schedules deleted successfully', 'success');
      console.log('Refreshing schedules');
      await refreshSchedules();
      console.log('Closing delete all modal');
      showDeleteAllModal.value = false;
    } else if (isApiError(data)) {
      console.log('Delete all schedules API error:', getErrorMessage(data));
      showMessage(getErrorMessage(data) || 'Failed to delete all restart schedules', 'error');
    } else {
      // Added fallback for unexpected response format
      console.log('Unexpected response format:', data);
      
      // Still attempt to refresh data and show success message if status is success
      if (typeof data === 'object' && data !== null && 'status' in data && (data as any).status === 'success') {
        showMessage('All restart schedules deleted successfully', 'success');
        await refreshSchedules();
        showDeleteAllModal.value = false;
      } else {
        showMessage('Unexpected server response', 'error');
      }
    }
  } catch (error: any) {
    console.error('Error deleting all restart schedules:', error);
    showMessage(
      error.message || 'An unexpected error occurred while deleting all restart schedules',
      'error'
    );
  } finally {
    console.log('Resetting delete all loading state and closing modal');
    isDeleteAllLoading.value = false;
    showDeleteAllModal.value = false; // Always close the modal when done
  }
};

onMounted(refreshSchedules);
</script>

<template>
  <div class="space-y-6 h-full min-h-[calc(100vh-152px)] flex flex-col">
    <!-- Flash message and buttons section -->
    <div class="flex-none">
      <FlashMessage
        v-if="currentMessage"
        :message="currentMessage.message"
        :type="currentMessage.type"
        :onClose="clearMessage"
      />
      <!-- Changed flex to flex-col on mobile, row on larger screens -->
      <div
        class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center"
      >
        <div></div>
        <!-- Changed space-x to space-y on mobile, space-x on larger screens -->
        <div
          class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <button @click="addNewSchedule" class="btn-success w-full sm:w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Schedule
          </button>
          <button @click="refreshSchedules" class="btn-primary w-full sm:w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 inline"
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
            Refresh
          </button>
          <button 
            @click="deleteAllSchedulesPrompt" 
            class="btn-danger w-full sm:w-auto"
            :disabled="loading || schedules.length === 0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete All
          </button>
        </div>
      </div>
    </div>

    <!-- Stats cards section -->
    <div class="flex-none grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashboardCard title="Total Schedules" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">
          {{ totalItems || 0 }}
        </div>
      </DashboardCard>
      <DashboardCard title="Current Page" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">
          {{ totalPages === 0 ? 0 : currentPage || 0 }}/{{ totalPages || 0 }}
        </div>
      </DashboardCard>
      <DashboardCard title="Per Page" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">
          {{ perPage || 10 }}
        </div>
      </DashboardCard>
    </div>

    <!-- Table section with pagination -->
    <DashboardCard title="" :isLoading="loading" class="flex flex-col min-h-0">
      <div class="flex flex-col h-full">
        <div class="flex-none mb-4 flex items-center justify-end">
          <TablePagination
            :current-page="currentPage || 1"
            :total-pages="totalPages || 1"
            :visible-pages="getVisiblePages || []"
            @page-change="handlePageChange"
          />
        </div>
        <div class="overflow-auto min-h-0">
          <RestartSchedulesTable
            :schedules="schedules"
            :onEdit="editSchedule"
            :onDelete="deleteSchedulePrompt"
            :loading="loading"
          />
        </div>
        <!-- Pagination controls -->
        <div class="flex-none mt-4 flex items-center justify-end">
          <TablePagination
            :current-page="currentPage || 1"
            :total-pages="totalPages || 1"
            :visible-pages="getVisiblePages || []"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </DashboardCard>

    <!-- Add Schedule Modal -->
    <BaseModal
      :show="showAddModal"
      title="Add New Schedule"
      @close="showAddModal = false"
      @confirm="addScheduleForm?.handleSubmit()"
      :disabled="addScheduleForm?.isSubmitting"
      :loading="addScheduleForm?.isSubmitting"
    >
      <AddRestartScheduleForm ref="addScheduleForm" @submit="handleAddSchedule" />
    </BaseModal>

    <!-- Edit Schedule Modal -->
    <BaseModal
      :show="showEditModal"
      title="Edit Schedule"
      @close="showEditModal = false"
      @confirm="editScheduleForm?.handleSubmit()"
      :disabled="isEditLoading"
      :loading="isEditLoading"
    >
      <EditRestartScheduleForm
        v-if="selectedSchedule"
        ref="editScheduleForm"
        :schedule="selectedSchedule"
        :is-loading="isEditLoading"
        @submit="handleEditSchedule"
      />
    </BaseModal>

    <!-- Delete Schedule Modal -->
    <BaseModal
      :show="showDeleteModal"
      title="Delete Schedule"
      @close="showDeleteModal = false"
      @confirm="handleDeleteConfirm"
      :disabled="isDeleteLoading"
      :loading="isDeleteLoading"
    >
      <p class="dark:text-gray-300">
        Are you sure you want to delete this schedule?
      </p>
      <p
        v-if="selectedSchedule"
        class="text-sm text-gray-500 dark:text-gray-400 mt-2"
      >
        Type: {{ selectedSchedule.schedule_type.charAt(0).toUpperCase() + selectedSchedule.schedule_type.slice(1) }}
        <br />
        Time: {{ selectedSchedule.time }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        This action cannot be undone.
      </p>
    </BaseModal>

    <!-- Delete All Schedules Modal -->
    <BaseModal
      :show="showDeleteAllModal"
      title="Delete All Schedules"
      @close="showDeleteAllModal = false"
      @confirm="handleDeleteAllConfirm"
      :disabled="isDeleteAllLoading"
      :loading="isDeleteAllLoading"
    >
      <p class="dark:text-gray-300">
        Are you sure you want to delete all restart schedules?
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        This action cannot be undone.
      </p>
    </BaseModal>
  </div>
</template>

<style scoped>
.btn-primary,
.btn-danger,
.btn-success {
  @apply inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-sm;
  @apply transform transition-all duration-200 ease-in-out;
  @apply shadow-md hover:shadow-lg active:shadow-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-opacity-50;
}

.btn-primary {
  @apply bg-blue-600 text-white;
  @apply hover:bg-blue-700 active:bg-blue-800;
  @apply focus:ring-blue-500;
  @apply dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700;
}

.btn-danger {
  @apply bg-red-600 text-white;
  @apply hover:bg-red-700 active:bg-red-800;
  @apply focus:ring-red-500;
  @apply dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700;
}

.btn-success {
  @apply bg-green-600 text-white;
  @apply hover:bg-green-700 active:bg-green-800;
  @apply focus:ring-green-500;
  @apply dark:bg-green-500 dark:hover:bg-green-600 dark:active:bg-green-700;
}

/* Add disabled state styles */
.btn-primary:disabled,
.btn-danger:disabled,
.btn-success:disabled {
  @apply opacity-50 cursor-not-allowed;
  @apply hover:shadow-md active:shadow-md;
}

/* Add loading state animation */
.btn-primary.loading,
.btn-danger.loading,
.btn-success.loading {
  @apply relative overflow-hidden;
}

.btn-primary.loading::after,
.btn-danger.loading::after,
.btn-success.loading::after {
  content: '';
  @apply absolute inset-0 bg-white/20;
  animation: button-loading 1s infinite;
}

@keyframes button-loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.btn-pagination {
  @apply px-3 py-1 border rounded-md text-sm;
  @apply hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.pagination-arrow-btn {
  @apply relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300;
  @apply hover:bg-gray-50 focus:z-20 focus:outline-offset-0;
}

.pagination-arrow-btn:first-child {
  @apply rounded-l-md;
}

.pagination-arrow-btn:last-child {
  @apply rounded-r-md;
}

.pagination-number-btn {
  @apply relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300;
  @apply focus:z-20 focus:outline-offset-0 transition-colors duration-200;
}

.pagination-active {
  @apply z-10 bg-blue-600 text-white ring-blue-600;
  @apply focus:outline-none hover:bg-blue-700;
}

.pagination-inactive {
  @apply text-gray-900 hover:bg-gray-50;
}

.pagination-ellipsis {
  @apply relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300;
}
</style>
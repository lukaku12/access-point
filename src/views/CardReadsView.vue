<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardCard from '@/components/DashboardCard.vue';
import type { CardRead } from '@/types/cardReads';
import { fetchCardReads, removeAllCardReads } from '@/api/cardReads';
import BaseModal from '@/components/base/BaseModal.vue';
import FlashMessage from '@/components/FlashMessage.vue';
import { useFlashMessage } from '@/composables/useFlashMessage';
import { usePagination } from '@/composables/usePagination';
import TablePagination from '@/components/TablePagination.vue';
import GenericTable from '@/components/GenericTable.vue';
import { isDeleteAllCardReadsSuccess, isAuthError, isOperationError } from '@/types/cardReads';

const cardReads = ref<CardRead[]>([]);
const loading = ref(true);
const showDeleteAllModal = ref(false);
const isDeleteAllLoading = ref(false);

const { currentMessage, showMessage, clearMessage } = useFlashMessage();
const { pagination, getVisiblePages, updatePagination } = usePagination();

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'card_number', label: 'Card Number' },
  {
    key: 'timestamp',
    label: 'Timestamp',
    format: (value: string) => new Date(value).toLocaleString()
  },
  { key: 'type', label: 'Type' }
];

const refreshCardReads = async () => {
  loading.value = true;
  try {
    const { data } = await fetchCardReads(
      pagination.value.currentPage,
      pagination.value.perPage
    );
    if (data.status === 'success') {
      cardReads.value = data.data;
      updatePagination({
        totalItems: data.pagination.total,
        currentPage: data.pagination.page,
        totalPages: data.pagination.total_pages,
        perPage: data.pagination.per_page
      });
    } else {
      throw new Error('Failed to fetch card reads');
    }
  } catch (error) {
    console.error('Error fetching card reads:', error);
    showMessage('Failed to fetch card reads', 'error');
  } finally {
    loading.value = false;
  }
};

const handlePageChange = async (page: number) => {
  updatePagination({ currentPage: page });
  await refreshCardReads();
};

const deleteAllCardReads = () => {
  showDeleteAllModal.value = true;
};

const handleDeleteAllConfirm = async () => {
  isDeleteAllLoading.value = true;
  try {
    const { data } = await removeAllCardReads();

    if (isDeleteAllCardReadsSuccess(data)) {
      await refreshCardReads();
      showMessage(`Successfully removed ${data.data.reads_removed} card reads`, 'success');
    } else if (isAuthError(data)) {
      showMessage('Authentication error. Please log in again.', 'error');
      // Optionally redirect to login page or handle auth error
    } else if (isOperationError(data)) {
      showMessage(`Operation failed: ${data.error}`, 'error');
    }
  } catch (error) {
    console.error('Error deleting all card reads:', error);
    showMessage('An unexpected error occurred while deleting card reads', 'error');
  } finally {
    isDeleteAllLoading.value = false;
    showDeleteAllModal.value = false;
  }
};

onMounted(refreshCardReads);
</script>

<template>
  <div class="space-y-6 h-screen max-h-screen overflow-hidden flex flex-col bg-white dark:bg-gray-900">
    <!-- Flash message and buttons section -->
    <div class="flex-none">
      <FlashMessage
        v-if="currentMessage"
        :message="currentMessage.message"
        :type="currentMessage.type"
        :onClose="clearMessage"
      />
      <div class="flex justify-between items-center">
        <div></div>
        <div class="space-x-4">
          <button @click="refreshCardReads" class="btn-primary">
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
            @click="deleteAllCardReads"
            class="btn-danger"
            :disabled="isDeleteAllLoading"
          >
            <template v-if="!isDeleteAllLoading">
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
            </template>
            <template v-else>
              <svg
                class="animate-spin h-5 w-5 mr-2 inline"
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
              Deleting...
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats cards section -->
    <div class="flex-none grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashboardCard title="Total Card Reads" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">{{ pagination.totalItems }}</div>
      </DashboardCard>
      <DashboardCard title="Current Page" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">
          {{ pagination.totalPages === 0 ? 0 : pagination.currentPage }}/{{
            pagination.totalPages
          }}
        </div>
      </DashboardCard>
      <DashboardCard title="Per Page" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">{{ pagination.perPage }}</div>
      </DashboardCard>
    </div>

    <!-- Table section with pagination -->
    <DashboardCard
      title=""
      :isLoading="loading"
      class="flex-1 flex flex-col min-h-0"
    >
      <div class="flex flex-col h-full">
        <div class="flex-none mb-4 flex items-center justify-end">
          <TablePagination
            :current-page="pagination.currentPage"
            :total-pages="pagination.totalPages"
            :visible-pages="getVisiblePages"
            @page-change="handlePageChange"
          />
        </div>
        <div class="flex-1 overflow-auto min-h-0">
          <GenericTable
            :columns="tableColumns"
            :data="cardReads"
            :mobile-display-keys="['number', 'timestamp']"
            empty-message="No card reads available"
          />
        </div>
        <div class="flex-none mt-4 flex items-center justify-end">
          <TablePagination
            :current-page="pagination.currentPage"
            :total-pages="pagination.totalPages"
            :visible-pages="getVisiblePages"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </DashboardCard>

    <!-- Delete All Card Reads Modal -->
    <BaseModal
      :show="showDeleteAllModal"
      title="Delete All Card Reads"
      @close="showDeleteAllModal = false"
      @confirm="handleDeleteAllConfirm"
      :disabled="isDeleteAllLoading"
      :loading="isDeleteAllLoading"
      confirm-text="Delete All"
      cancel-text="Cancel"
    >
      <p>Are you sure you want to delete all card reads?</p>
      <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
      <p v-if="isDeleteAllLoading" class="text-sm text-blue-500 mt-2">
        Deleting all card reads...
      </p>
    </BaseModal>
  </div>
</template>

<style scoped>
.btn-primary,
.btn-danger {
  @apply inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-sm;
  @apply transform transition-all duration-200 ease-in-out;
  @apply shadow-md hover:shadow-lg active:shadow-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-opacity-50;
}

.btn-primary {
  @apply bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100;
  @apply hover:bg-blue-700 active:bg-blue-800;
  @apply dark:hover:bg-blue-600 dark:active:bg-blue-700;
  @apply focus:ring-blue-500 dark:focus:ring-blue-400;
}

.btn-danger {
  @apply bg-red-600 text-white dark:bg-red-500 dark:text-gray-100;
  @apply hover:bg-red-700 active:bg-red-800;
  @apply dark:hover:bg-red-600 dark:active:bg-red-700;
  @apply focus:ring-red-500 dark:focus:ring-red-400;
}

.btn-danger:disabled {
  @apply opacity-50 cursor-not-allowed;
  @apply hover:bg-red-600 active:bg-red-600;
  @apply dark:hover:bg-red-500 dark:active:bg-red-500;
}
</style>

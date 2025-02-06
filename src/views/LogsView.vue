<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardCard from '@/components/DashboardCard.vue';
import type { Log } from '@/types/logs';
import { fetchLogs, clearLogs } from '@/api/logs';
import { removeLog } from '@/api/logs'; // Rename import to avoid conflict
import BaseModal from '@/components/base/BaseModal.vue';
import FlashMessage from '@/components/FlashMessage.vue';
import { useFlashMessage } from '@/composables/useFlashMessage';
import { usePagination } from '@/composables/usePagination';
import TablePagination from '@/components/TablePagination.vue';
import GenericTable from '@/components/GenericTable.vue';

const logs = ref<Log[]>([]);
const loading = ref(true);
const showClearAllModal = ref(false);
const isClearAllLoading = ref(false);
const showDeleteModal = ref(false);
const selectedLog = ref<Log | null>(null);
const isDeleteLoading = ref(false);

const { currentMessage, showMessage, clearMessage } = useFlashMessage();
const { pagination, getVisiblePages, updatePagination } = usePagination();

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'message', label: 'Message' },
  {
    key: 'timestamp',
    label: 'Timestamp',
    format: (value: string) => new Date(value).toLocaleString()
  },
];

const refreshLogs = async () => {
  loading.value = true;
  try {
    const { data } = await fetchLogs(
      pagination.value.currentPage,
      pagination.value.perPage
    );
    if (data.status === 'success') {
      logs.value = data.data;
      updatePagination({
        totalItems: data.pagination.total,
        currentPage: data.pagination.page,
        totalPages: data.pagination.total_pages,
        perPage: data.pagination.per_page
      });
    } else {
      throw new Error('Failed to fetch logs');
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    showMessage('Failed to fetch logs', 'error');
  } finally {
    loading.value = false;
  }
};

const handlePageChange = async (page: number) => {
  updatePagination({ currentPage: page });
  await refreshLogs();
};

const handleClearAll = async () => {
  isClearAllLoading.value = true;
  try {
    const { data } = await clearLogs();
    if (data.status === 'success') {
      await refreshLogs();
      showMessage('Successfully cleared all logs', 'success');
    } else {
      throw new Error('Failed to clear logs');
    }
  } catch (error) {
    console.error('Error clearing logs:', error);
    showMessage('Failed to clear logs', 'error');
  } finally {
    isClearAllLoading.value = false;
    showClearAllModal.value = false;
  }
};

const openDeleteModal = (log: Log) => {
  selectedLog.value = log;
  showDeleteModal.value = true;
};

const handleDeleteConfirm = async () => {
  if (!selectedLog.value) return;

  isDeleteLoading.value = true;
  try {
    const response = await removeLog(selectedLog.value.id);
    if (response.data.status === 'success') {
      showMessage('Log entry deleted successfully', 'success');
      await refreshLogs();
    } else {
      throw new Error('Failed to delete log');
    }
  } catch (error) {
    console.error('Error deleting log:', error);
    showMessage('Failed to delete log entry', 'error');
  } finally {
    isDeleteLoading.value = false;
    showDeleteModal.value = false;
  }
};

const actions = [
  {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    onClick: openDeleteModal,
    color: 'red-600',
    hoverColor: 'red-800'
  }
];


onMounted(refreshLogs);
</script>

<template>
  <div class="space-y-6 h-full flex flex-col min-h-[calc(100vh-152px)]">
    <!-- Flash message and buttons section -->
    <div class="flex-none">
      <FlashMessage
        v-if="currentMessage"
        :message="currentMessage.message"
        :type="currentMessage.type"
        :onClose="clearMessage"
      />
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div></div>
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <button @click="refreshLogs" class="btn-primary w-full sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            @click="showClearAllModal = true"
            class="btn-danger w-full sm:w-auto"
            :disabled="isClearAllLoading"
          >
            <template v-if="!isClearAllLoading">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </template>
            <template v-else>
              <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Clearing...
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats cards section -->
    <div class="flex-none grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashboardCard title="Total Logs" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">
          {{ pagination.totalItems }}
        </div>
      </DashboardCard>
      <DashboardCard title="Current Page" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">
          {{ pagination.totalPages === 0 ? 0 : pagination.currentPage }}/{{ pagination.totalPages }}
        </div>
      </DashboardCard>
      <DashboardCard title="Per Page" :isLoading="loading">
        <div class="text-2xl font-bold dark:text-white">
          {{ pagination.perPage }}
        </div>
      </DashboardCard>
    </div>

    <!-- Table section with pagination -->
    <DashboardCard title="" :isLoading="loading" class="flex flex-col min-h-0">
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
            :data="logs"
            :mobile-display-keys="['message', 'timestamp']"
            :loading="loading"
            :actions="actions"
            empty-message="No logs available"
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

    <!-- Clear All Logs Modal -->
    <BaseModal
      :show="showClearAllModal"
      title="Clear All Logs"
      @close="showClearAllModal = false"
      @confirm="handleClearAll"
      :disabled="isClearAllLoading"
      :loading="isClearAllLoading"
      confirm-text="Clear All"
      cancel-text="Cancel"
    >
      <p>Are you sure you want to clear all logs?</p>
      <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
      <p v-if="isClearAllLoading" class="text-sm text-blue-500 mt-2">
        Clearing all logs...
      </p>
    </BaseModal>

    <!-- Delete Log Modal -->
    <BaseModal
      :show="showDeleteModal"
      title="Delete Log Entry"
      @close="showDeleteModal = false"
      @confirm="handleDeleteConfirm"
      :disabled="isDeleteLoading"
      :loading="isDeleteLoading"
      confirm-text="Delete"
      cancel-text="Cancel"
    >
      <p class="dark:text-gray-300">
        Are you sure you want to delete this log entry?
      </p>
      <p
        v-if="selectedLog"
        class="text-sm text-gray-500 dark:text-gray-400 mt-2"
      >
        Message: {{ selectedLog.message }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
        This action cannot be undone.
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

.btn-danger-small {
  @apply px-3 py-1 rounded text-sm text-white bg-red-600;
  @apply hover:bg-red-700 transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50;
}

.btn-danger:disabled,
.btn-danger-small:disabled {
  @apply opacity-50 cursor-not-allowed;
  @apply hover:bg-red-600 active:bg-red-600;
  @apply dark:hover:bg-red-500 dark:active:bg-red-500;
}
</style>

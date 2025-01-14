<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardCard from '@/components/DashboardCard.vue';
import type { WiFiNetwork } from '@/types/wifi';
import {
  fetchWiFiNetworks,
  removeWiFiNetwork,
  removeAllWiFiNetworks,
  createWiFiNetwork,
  updateWiFiNetwork
} from '@/api/wifi';
import BaseModal from '@/components/base/BaseModal.vue';
import FlashMessage from '@/components/FlashMessage.vue';
import { useFlashMessage } from '@/composables/useFlashMessage';
import WifiTable from '@/components/WifiTable.vue';
import { usePagination } from '@/composables/usePagination';
import TablePagination from '@/components/TablePagination.vue';
import {
  isDeleteWiFiSuccess,
  isDeleteWiFiError,
  isDeleteAllWiFiSuccess,
  isDeleteAllWiFiError,
  isCreateWiFiSuccess,
  isCreateWiFiError,
  isUpdateWiFiSuccess,
  isUpdateWiFiError
} from '@/types/wifi';
import AddWiFiForm from '@/components/forms/AddWiFiForm.vue';
import EditWiFiForm from '@/components/forms/EditWiFiForm.vue';

interface ApiError {
  message: string;
  code?: number;
}

const networks = ref<WiFiNetwork[]>([]);
const loading = ref(true);
const { currentMessage, showMessage, clearMessage } = useFlashMessage();
const { pagination, getVisiblePages, updatePagination } = usePagination();

const showDeleteModal = ref(false);
const showDeleteAllModal = ref(false);
const selectedNetwork = ref<WiFiNetwork | null>(null);
const isDeleteLoading = ref(false);
const isDeleteAllLoading = ref(false);

const showAddModal = ref(false);
const showEditModal = ref(false);

interface AddWiFiFormExposed {
  handleSubmit: () => void;
  isSubmitting: boolean;
}

interface EditWiFiFormExposed {
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const addWiFiForm = ref<AddWiFiFormExposed | null>(null);
const editWiFiForm = ref<EditWiFiFormExposed | null>(null);

const refreshNetworks = async () => {
  loading.value = true;
  try {
    const { data } = await fetchWiFiNetworks(
      pagination.value.currentPage,
      pagination.value.perPage
    );
    if (data.status === 'success') {
      networks.value = data.data;
      updatePagination({
        totalItems: data.pagination.total,
        currentPage: data.pagination.page,
        totalPages: data.pagination.total_pages,
        perPage: data.pagination.per_page
      });
    }
  } catch (error) {
    console.error('Error fetching networks:', error);
    showMessage('Failed to fetch WiFi networks', 'error');
  } finally {
    loading.value = false;
  }
};

const handlePageChange = async (page: number) => {
  updatePagination({ currentPage: page });
  await refreshNetworks();
};

const deleteNetwork = (network: WiFiNetwork) => {
  selectedNetwork.value = network;
  showDeleteModal.value = true;
};

const deleteAllNetworks = () => {
  showDeleteAllModal.value = true;
};

const handleDeleteConfirm = async () => {
  if (!selectedNetwork.value) return;

  isDeleteLoading.value = true;
  try {
    const { data } = await removeWiFiNetwork(selectedNetwork.value.id);

    if (isDeleteWiFiSuccess(data)) {
      await refreshNetworks();
      showMessage('WiFi network deleted successfully', 'success');
    } else if (isDeleteWiFiError(data)) {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    console.error('Error deleting network:', error);
    showMessage('An unexpected error occurred', 'error');
  } finally {
    isDeleteLoading.value = false;
    showDeleteModal.value = false;
  }
};

const handleDeleteAllConfirm = async () => {
  isDeleteAllLoading.value = true;
  try {
    const { data } = await removeAllWiFiNetworks();

    if (isDeleteAllWiFiSuccess(data)) {
      await refreshNetworks();
      showMessage(
        `${data.data.networks_removed} networks deleted successfully`,
        'success'
      );
    } else if (isDeleteAllWiFiError(data)) {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    console.error('Error deleting all networks:', error);
    showMessage('An unexpected error occurred', 'error');
  } finally {
    isDeleteAllLoading.value = false;
    showDeleteAllModal.value = false;
  }
};

const addNewNetwork = () => {
  showAddModal.value = true;
};

const editNetwork = (network: WiFiNetwork) => {
  selectedNetwork.value = network;
  showEditModal.value = true;
};

const handleAddNetwork = async (formData: Partial<WiFiNetwork>) => {
  try {
    const { data } = await createWiFiNetwork(formData);
    if (isCreateWiFiSuccess(data)) {
      await refreshNetworks();
      showMessage('WiFi network added successfully', 'success');
      showAddModal.value = false;
    } else if (isCreateWiFiError(data)) {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    console.error('Error adding network:', error);
    const apiError = error as ApiError;
    showMessage(apiError?.message || 'Failed to add WiFi network', 'error');
  } finally {
    if (addWiFiForm.value) {
      addWiFiForm.value.isSubmitting = false;
    }
  }
};

const handleEditNetwork = async (formData: Partial<WiFiNetwork>) => {
  if (!selectedNetwork.value) return;

  try {
    const { data } = await updateWiFiNetwork(
      selectedNetwork.value.id,
      formData
    );
    if (isUpdateWiFiSuccess(data)) {
      await refreshNetworks();
      showMessage('WiFi network updated successfully', 'success');
      showEditModal.value = false;
    } else if (isUpdateWiFiError(data)) {
      showMessage(data.message, 'error');
    }
  } catch (error) {
    console.error('Error updating network:', error);
    const apiError = error as ApiError;
    showMessage(apiError?.message || 'Failed to update WiFi network', 'error');
  } finally {
    if (editWiFiForm.value) {
      editWiFiForm.value.isSubmitting = false;
    }
  }
};

onMounted(refreshNetworks);
</script>

<template>
  <div class="space-y-6 h-screen max-h-screen overflow-hidden flex flex-col">
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
          <button @click="addNewNetwork" class="btn-success">
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
            Add Network
          </button>
          <button @click="refreshNetworks" class="btn-primary">
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
          <button @click="deleteAllNetworks" class="btn-danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 inline"
              fill="none"
              viewBox="0 24 24"
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
      <DashboardCard title="Total Networks" :isLoading="loading">
        <div class="text-2xl font-bold">{{ pagination.totalItems }}</div>
      </DashboardCard>
      <DashboardCard title="Current Page" :isLoading="loading">
        <div class="text-2xl font-bold">
          {{ pagination.totalPages === 0 ? 0 : pagination.currentPage }}/{{
            pagination.totalPages
          }}
        </div>
      </DashboardCard>
      <DashboardCard title="Per Page" :isLoading="loading">
        <div class="text-2xl font-bold">{{ pagination.perPage }}</div>
      </DashboardCard>
    </div>

    <!-- Table section -->
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
          <WifiTable
            :networks="networks"
            :onEdit="editNetwork"
            :onDelete="deleteNetwork"
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

    <!-- Modals -->
    <BaseModal
      :show="showAddModal"
      title="Add New Network"
      @close="showAddModal = false"
      @confirm="addWiFiForm?.handleSubmit()"
      :disabled="addWiFiForm?.isSubmitting"
      :loading="addWiFiForm?.isSubmitting"
    >
      <AddWiFiForm ref="addWiFiForm" @submit="handleAddNetwork" />
    </BaseModal>

    <BaseModal
      :show="showEditModal"
      title="Edit Network"
      @close="showEditModal = false"
      @confirm="editWiFiForm?.handleSubmit()"
      :disabled="editWiFiForm?.isSubmitting"
      :loading="editWiFiForm?.isSubmitting"
    >
      <EditWiFiForm
        v-if="selectedNetwork"
        ref="editWiFiForm"
        :network="selectedNetwork"
        @submit="handleEditNetwork"
      />
    </BaseModal>

    <!-- Delete modals -->
    <BaseModal
      :show="showDeleteModal"
      title="Delete Network"
      @close="showDeleteModal = false"
      @confirm="handleDeleteConfirm"
      :disabled="isDeleteLoading"
      :loading="isDeleteLoading"
    >
      <p>Are you sure you want to delete this network?</p>
      <p v-if="selectedNetwork" class="text-sm text-gray-500 mt-2">
        SSID: {{ selectedNetwork.ssid }}
      </p>
    </BaseModal>

    <BaseModal
      :show="showDeleteAllModal"
      title="Delete All Networks"
      @close="showDeleteAllModal = false"
      @confirm="handleDeleteAllConfirm"
      :disabled="isDeleteAllLoading"
      :loading="isDeleteAllLoading"
    >
      <p>Are you sure you want to delete all networks?</p>
      <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
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
}

.btn-danger {
  @apply bg-red-600 text-white;
  @apply hover:bg-red-700 active:bg-red-800;
  @apply focus:ring-red-500;
}

.btn-success {
  @apply bg-green-600 text-white;
  @apply hover:bg-green-700 active:bg-green-800;
  @apply focus:ring-green-500;
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

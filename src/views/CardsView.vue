<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardCard from '@/components/DashboardCard.vue';
import type { Card } from '@/types/card';
import { fetchCards, removeCard, removeAllCards, createCard } from '@/api/cards';
import Modal from '@/components/Modal.vue';
import FlashMessage from '@/components/FlashMessage.vue';
import { useFlashMessage } from '@/composables/useFlashMessage';
import AddCardForm from '@/components/forms/AddCardForm.vue';
import { isCreateCardSuccess, isCreateCardError } from '@/types/card';
import CardsTable from '@/components/CardsTable.vue';
import { usePagination } from '@/composables/usePagination';
import TablePagination from '@/components/TablePagination.vue'; // Updated import name
import { isDeleteAllCardsSuccess, isDeleteAllCardsError, isDeleteCardSuccess, isDeleteCardError } from '@/types/card';

interface AddCardFormExposed {
  handleSubmit: () => void;
  isSubmitting: boolean;
}

const cards = ref<Card[]>([]);
const loading = ref(true);

const { currentMessage, showMessage, clearMessage } = useFlashMessage();
const { pagination, getVisiblePages, updatePagination } = usePagination();

const refreshCards = async () => {
  loading.value = true;
  try {
    const { data } = await fetchCards(
      pagination.value.currentPage,
      pagination.value.perPage
    );
    if (data.status === 'success') {
      cards.value = data.data;
      updatePagination({
        totalItems: data.pagination.total,
        currentPage: data.pagination.page,
        totalPages: data.pagination.total_pages,
        perPage: data.pagination.per_page
      });
    } else {
      throw new Error('Failed to fetch cards');
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
    showMessage('Failed to fetch cards', 'error');
  } finally {
    loading.value = false;
  }
};

const handlePageChange = async (page: number) => {
  updatePagination({ currentPage: page });
  await refreshCards();
};

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showDeleteAllModal = ref(false);
const selectedCard = ref<Card | null>(null);

const addCardForm = ref<AddCardFormExposed | null>(null);

const addNewCard = () => {
  showAddModal.value = true;
};

const editCard = (card: Card) => {
  selectedCard.value = card;
  showEditModal.value = true;
};

const deleteCard = (card: Card) => {
  selectedCard.value = card;
  showDeleteModal.value = true;
};

const deleteAllCards = () => {
  showDeleteAllModal.value = true;
};

const isDeleteLoading = ref(false);

const handleDeleteConfirm = async () => {
  if (!selectedCard.value) return;
  
  isDeleteLoading.value = true;
  try {
    const { data } = await removeCard(selectedCard.value.id);

    if (isDeleteCardSuccess(data)) {
      await refreshCards();
      showMessage('Card deleted successfully', 'success');
    } else if (isDeleteCardError(data)) {
      if (data.code === 401) {
        showMessage('Authentication error. Please log in again.', 'error');
      } else if (data.code === 400) {
        showMessage(data.error || data.message, 'error');
      } else {
        showMessage('Failed to delete card', 'error');
      }
    }
  } catch (error) {
    console.error('Error deleting card:', error);
    showMessage('An unexpected error occurred while deleting the card', 'error');
  } finally {
    isDeleteLoading.value = false;
    showDeleteModal.value = false;
  }
};

const isDeleteAllLoading = ref(false);

const handleDeleteAllConfirm = async () => {
  isDeleteAllLoading.value = true;
  try {
    const { data } = await removeAllCards();

    if (isDeleteAllCardsSuccess(data)) {
      await refreshCards();
      showMessage(`${data.data.cards_removed} cards deleted successfully`, 'success');
    } else if (isDeleteAllCardsError(data)) {
      if (data.code === 401) {
        showMessage('Authentication error. Please log in again.', 'error');
      } else {
        showMessage(data.message || 'Failed to delete all cards', 'error');
      }
    }
  } catch (error) {
    console.error('Error deleting cards:', error);
    showMessage('An unexpected error occurred while deleting cards', 'error');
  } finally {
    isDeleteAllLoading.value = false;
    showDeleteAllModal.value = false;
  }
};

const handleAddCard = async (formData: Partial<Card>) => {
  try {
    const { data } = await createCard(formData);

    if (isCreateCardSuccess(data)) {
      await refreshCards();
      showMessage('Card added successfully', 'success');
      showAddModal.value = false;
    } else if (isCreateCardError(data)) {
      showMessage(data.message, 'error');
    } else {
      throw new Error('Unexpected response from server');
    }
  } catch (error: any) {
    console.error('Error adding card:', error);
    // Handle error from axios interceptor
    if (error && typeof error === 'object' && 'message' in error) {
      showMessage(error.message as string, 'error');
    } else {
      showMessage('An unexpected error occurred while adding the card', 'error');
    }
  } finally {
    if (addCardForm.value) {
      addCardForm.value.isSubmitting = false;
    }
  }
};

onMounted(refreshCards);
</script>

<template>
  <div class="space-y-6 h-screen max-h-screen overflow-hidden flex flex-col">
    <!-- Flash message and buttons section -->
    <div class="flex-none">
      <FlashMessage v-if="currentMessage" :message="currentMessage.message" :type="currentMessage.type"
        :onClose="clearMessage" />
      <div class="flex justify-between items-center">
        <div></div>
        <div class="space-x-4">
          <button @click="addNewCard" class="btn-success">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Card
          </button>
          <button @click="refreshCards" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button @click="deleteAllCards" class="btn-danger">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete All
          </button>
        </div>
      </div>
    </div>

    <!-- Stats cards section -->
    <div class="flex-none grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashboardCard title="Total Cards" :isLoading="loading">
        <div class="text-2xl font-bold">{{ pagination.totalItems }}</div>
      </DashboardCard>
      <DashboardCard title="Current Page" :isLoading="loading">
        <div class="text-2xl font-bold">{{ pagination.totalPages === 0 ? 0 : pagination.currentPage }}/{{
          pagination.totalPages }}</div>
      </DashboardCard>
      <DashboardCard title="Per Page" :isLoading="loading">
        <div class="text-2xl font-bold">{{ pagination.perPage }}</div>
      </DashboardCard>
    </div>

    <!-- Table section with pagination -->
    <DashboardCard title="" :isLoading="loading" class="flex-1 flex flex-col min-h-0">
      <div class="flex flex-col h-full">
        <div class="flex-none mb-4 flex items-center justify-end">
          <TablePagination :current-page="pagination.currentPage" :total-pages="pagination.totalPages"
            :visible-pages="getVisiblePages" @page-change="handlePageChange" />
        </div>
        <div class="flex-1 overflow-auto min-h-0">
          <CardsTable :cards="cards" :onEdit="editCard" :onDelete="deleteCard" />
        </div>
        <!-- Pagination controls -->
        <div class="flex-none mt-4 flex items-center justify-end ">
          <TablePagination :current-page="pagination.currentPage" :total-pages="pagination.totalPages"
            :visible-pages="getVisiblePages" @page-change="handlePageChange" />
        </div>
      </div>
    </DashboardCard>

    <!-- Add Card Modal -->
    <Modal :show="showAddModal" title="Add New Card" @close="showAddModal = false"
      @confirm="addCardForm?.handleSubmit()" :disabled="addCardForm?.isSubmitting" :loading="addCardForm?.isSubmitting">
      <AddCardForm ref="addCardForm" @submit="handleAddCard" />
    </Modal>

    <!-- Edit Card Modal -->
    <Modal :show="showEditModal" title="Edit Card" @close="showEditModal = false"
      @confirm="() => { /* TODO: Implement edit */ showEditModal = false }">
      <p>Edit card form will go here</p>
    </Modal>

    <!-- Delete Card Modal -->
    <Modal 
      :show="showDeleteModal" 
      title="Delete Card" 
      @close="showDeleteModal = false" 
      @confirm="handleDeleteConfirm"
      :disabled="isDeleteLoading"
      :loading="isDeleteLoading"
    >
      <p>Are you sure you want to delete this card?</p>
      <p v-if="selectedCard" class="text-sm text-gray-500 mt-2">
        Card Number: {{ selectedCard.number }}
      </p>
      <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
    </Modal>

    <!-- Delete All Cards Modal -->
    <Modal :show="showDeleteAllModal" title="Delete All Cards" @close="showDeleteAllModal = false"
      @confirm="handleDeleteAllConfirm" :disabled="isDeleteAllLoading" :loading="isDeleteAllLoading">
      <p>Are you sure you want to delete all cards?</p>
      <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
    </Modal>
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
  content: "";
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
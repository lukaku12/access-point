<script setup lang="ts">
defineProps<{
    currentPage: number;
    totalPages: number;
    visiblePages: (number | string)[];
}>();

const emit = defineEmits<{
    (e: 'page-change', page: number): void;
}>();

const isNumber = (value: number | string): value is number => {
    return typeof value === 'number';
};
</script>

<template>
    <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <button @click="emit('page-change', currentPage - 1)" :disabled="currentPage === 1" class="pagination-arrow-btn"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
            </svg>
        </button>

        <template v-for="(page, index) in visiblePages" :key="index">
            <button v-if="isNumber(page)" @click="emit('page-change', page)" :class="[
                'pagination-number-btn',
                currentPage === page ? 'pagination-active' : 'pagination-inactive'
            ]">
                {{ page }}
            </button>
            <span v-else class="pagination-ellipsis">
                ...
            </span>
        </template>

        <button @click="emit('page-change', currentPage + 1)" :disabled="totalPages === 0 || totalPages === 1 || currentPage === totalPages"
            class="pagination-arrow-btn" :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages || totalPages === 0 || totalPages === 1 }">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
            </svg>
        </button>
    </nav>
</template>

<style scoped>
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

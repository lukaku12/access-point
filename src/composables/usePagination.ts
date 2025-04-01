import { ref, computed } from 'vue';

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

export function usePagination(initialState: Partial<PaginationState> = {}) {
  const state = ref<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
    ...initialState
  });

  const getVisiblePages = computed(() => {
    const delta = 2;
    const range: (number | string)[] = [];
    const totalPages = state.value.totalPages;
    const currentPage = state.value.currentPage;

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    if (totalPages > 1) {
      range.unshift(1);
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }

    return range;
  });

  const updatePagination = (newState: Partial<PaginationState>) => {
    state.value = { ...state.value, ...newState };
  };

  return {
    pagination: state,
    getVisiblePages,
    updatePagination
  };
}

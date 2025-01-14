<script setup lang="ts">
defineProps<{
    show: boolean;
    title: string;
    disabled?: boolean;
    loading?: boolean;
}>();

defineOptions({
    name: 'BaseModal'
});

defineEmits<{
    (e: 'close'): void;
    (e: 'confirm'): void;
}>();
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="fixed inset-0 z-50">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

            <!-- Modal -->
            <div
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl">
                <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">{{ title }}</h3>
                    <div class="mb-6">
                        <slot></slot>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button @click="$emit('close')" class="btn-secondary">
                            Cancel
                        </button>
                        <button 
                            @click="$emit('confirm')" 
                            class="btn-primary" 
                            :disabled="disabled"
                        >
                            <div class="flex items-center gap-2">
                                <svg
                                    v-if="loading"
                                    class="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {{ loading ? 'Adding...' : 'Confirm' }}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { uploadFirmware } from '@/api/firmwareUpdate';
import type { UploadState } from '@/types/firmwareUpdate';
import BaseModal from '@/components/base/BaseModal.vue';

const state = ref<UploadState>({
  isDragging: false,
  file: null,
  progress: 0,
  isUploading: false,
  error: null
});

const showConfirmModal = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const dragEvents = {
  dragenter: (e: DragEvent) => {
    e.preventDefault();
    state.value.isDragging = true;
  },
  dragleave: (e: DragEvent) => {
    e.preventDefault();
    state.value.isDragging = false;
  },
  dragover: (e: DragEvent) => {
    e.preventDefault();
  },
  drop: (e: DragEvent) => {
    e.preventDefault();
    state.value.isDragging = false;
    const files = e.dataTransfer?.files;
    if (files?.length) handleFileSelect(files[0]);
  }
};

const handleFileSelect = (file: File) => {
  if (!file.name.endsWith('.bin')) {
    state.value.error = 'Please select a valid firmware file (.bin)';
    return;
  }
  state.value.file = file;
  state.value.error = null;
};

const handleFileInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    handleFileSelect(input.files[0]);
  }
};

const uploadProgress = computed(() => {
  return `${state.value.progress.toFixed(1)}%`;
});

const startUpload = async () => {
  if (!state.value.file) return;
  showConfirmModal.value = false;

  try {
    state.value.isUploading = true;
    state.value.error = null;
    state.value.progress = 0;

    const progressInterval = setInterval(() => {
      if (state.value.progress < 90) {
        // More controlled progress increments
        state.value.progress += 0.5;
      }
    }, 200);

    await uploadFirmware(state.value.file);
    
    clearInterval(progressInterval);
    state.value.progress = 100;
    
    // Reset after successful upload
    setTimeout(() => {
      state.value = {
        isDragging: false,
        file: null,
        progress: 0,
        isUploading: false,
        error: null
      };
    }, 2000);

  } catch (error: any) {
    state.value.error = error.message || 'Upload failed';
  } finally {
    state.value.isUploading = false;
  }
};

const confirmUpload = () => {
  showConfirmModal.value = true;
};
</script>

<template>
  <div class="max-w-xl mx-auto p-4 min-h-[calc(100vh-152px)]">
    <!-- Warning Banner -->
    <div class="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Important Notice</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>Do not turn off or disconnect the device during the firmware update. Interrupting the process may cause permanent damage.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div
      class="relative bg-white dark:bg-gray-800 shadow-sm rounded-lg"
      @dragenter="dragEvents.dragenter"
      @dragleave="dragEvents.dragleave"
      @dragover="dragEvents.dragover"
      @drop="dragEvents.drop"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept=".bin"
        class="hidden"
        @change="handleFileInput"
      />
      
      <div
        :class="[
          'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
          state.isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 dark:border-gray-600',
          state.isUploading ? 'pointer-events-none opacity-50' : 'hover:border-blue-500'
        ]"
        @click="fileInputRef?.click()"
      >
        <!-- Upload Icon and Text -->
        <div class="space-y-4">
          <div class="text-5xl text-gray-400 dark:text-gray-500 flex justify-center">
            <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div class="text-gray-600 dark:text-gray-300">
            <span class="font-medium">Click to upload</span> or drag and drop
            <br />
            <span class="text-sm text-gray-500 dark:text-gray-400">Firmware file (.bin)</span>
          </div>
          <div v-if="state.file" class="text-sm bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
            <span class="font-medium text-blue-700 dark:text-blue-400">Selected file:</span>
            <span class="text-blue-600 dark:text-blue-300">{{ state.file.name }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Section -->
      <div v-if="state.isUploading" class="mt-6 px-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Progress</span>
          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">{{ uploadProgress }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            class="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            :style="{ width: uploadProgress }"
          ></div>
        </div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Please do not close this window</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="state.error"
        class="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700 dark:text-red-300">{{ state.error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex gap-4">
      <button
        class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg font-medium 
               hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 
               focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors duration-200"
        :disabled="state.isUploading"
        @click="state.file = null"
        v-if="state.file"
      >
        Cancel
      </button>
      <button
        class="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-lg font-medium 
               hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors duration-200"
        :disabled="!state.file || state.isUploading"
        @click="confirmUpload"
      >
        <span v-if="!state.isUploading">Update Firmware</span>
        <span v-else>Updating...</span>
      </button>
    </div>

    <!-- Replace custom modal with BaseModal -->
    <BaseModal
      v-model:show="showConfirmModal"
      title="Confirm Firmware Update"
      confirm-text="Proceed"
      :disabled="state.isUploading"
      @close="showConfirmModal = false"
      @confirm="startUpload"
    >
      <p class="text-sm text-gray-500">
        Are you sure you want to update the firmware? The device will restart after the update is complete.
      </p>
    </BaseModal>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

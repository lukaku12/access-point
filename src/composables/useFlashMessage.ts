import { ref } from 'vue';

interface FlashMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

const currentMessage = ref<FlashMessage | null>(null);
let timeout: number | null = null;

export function useFlashMessage() {
  const showMessage = (message: string, type: FlashMessage['type'] = 'info') => {
    if (timeout) {
      clearTimeout(timeout);
    }
    currentMessage.value = { message, type };
    timeout = window.setTimeout(() => {
      currentMessage.value = null;
    }, 3000);
  };

  const clearMessage = () => {
    currentMessage.value = null;
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return {
    currentMessage,
    showMessage,
    clearMessage
  };
}

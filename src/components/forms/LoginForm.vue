<template>
  <div>
    <FlashMessage
      v-if="flashMessage"
      :message="flashMessage.text"
      :type="flashMessage.type"
      :duration="5000"
      @close="flashMessage = null"
    />
    
    <form @submit.prevent="handleSubmit" class="space-y-4" autocomplete="on">
      <BaseInput
        v-model="formData.ip"
        :error="errors.ip"
        label="IP Address"
        placeholder="192.168.1.1"
        autocomplete="username"
        name="ip"
        @blur="validateField('ip', formData.ip, validationRules.ip)"
        required
      />
      <BaseNumberInput
        v-model="formData.port"
        label="Port"
        :min="1"
        :max="65535"
        :error="errors.port"
        required
        @blur="validateField('port', formData.port, validationRules.port)"
      />
      <BaseInput
        v-model="formData.authKey"
        :error="errors.authKey"
        label="Auth Key"
        type="password"
        autocomplete="current-password"
        name="password"
        @blur="validateField('authKey', formData.authKey, validationRules.authKey)"
        required
      />
      <button
        type="submit"
        :disabled="isSubmitting || !isValid"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ isSubmitting ? 'Connecting...' : 'Connect' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseNumberInput from '@/components/base/BaseNumberInput.vue'
import FlashMessage from '@/components/FlashMessage.vue'
import { useFormValidation } from '@/composables/useFormValidation'

interface FlashMessageType {
  text: string;
  type: 'success' | 'error' | 'info';
}

const router = useRouter()
const isSubmitting = ref(false)
const flashMessage = ref<FlashMessageType | null>(null)

const { errors, validateField, isValid } = useFormValidation()

const formData = reactive({
  ip: '',
  port: 80, // Changed to number with default value
  authKey: ''
})

const validationRules = {
  ip: {
    required: (v: string) => !!v || 'IP address is required',
    format: (v: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(v) || 'Invalid IP address format'
  },
  port: {
    required: (v: string) => !!v || 'Port is required',
    range: (v: string) => {
      const port = Number(v)
      return (port >= 1 && port <= 65535) || 'Port must be between 1 and 65535'
    }
  },
  authKey: {
    required: (v: string) => !!v || 'Auth key is required',
    minLength: (v: string) => v.length >= 6 || 'Auth key must be at least 6 characters'
  }
}

const handleSubmit = async () => {
  try {
    // Validate all fields
    const isIpValid = validateField('ip', formData.ip, validationRules.ip)
    const isPortValid = validateField('port', formData.port, validationRules.port)
    const isAuthValid = validateField('authKey', formData.authKey, validationRules.authKey)

    if (!isIpValid || !isPortValid || !isAuthValid) {
      return
    }

    isSubmitting.value = true
    const success = await login(
      formData.ip,
      formData.port, // No need to convert to Number anymore
      formData.authKey
    )
    
    if (success) {
      
      flashMessage.value = {
        text: 'Successfully connected!',
        type: 'success'
      }
      setTimeout(() => {
        router.push({ name: 'dashboard' })
      }, 1000)
    } else {
      flashMessage.value = {
        text: 'Invalid credentials',
        type: 'error'
      }
    }
  } catch (error: any) {
    flashMessage.value = {
      text: error.message || 'Connection failed',
      type: 'error'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

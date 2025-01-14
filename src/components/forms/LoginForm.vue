<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="formData.ip"
      :error="errors.ip"
      label="IP Address"
      placeholder="192.168.1.1"
      required
    />
    <BaseInput
      v-model="formData.port"
      :error="errors.port"
      label="Port"
      placeholder="80"
      type="number"
      required
    />
    <BaseInput
      v-model="formData.authKey"
      :error="errors.authKey"
      label="Auth Key"
      type="password"
      required
    />
    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {{ isSubmitting ? 'Connecting...' : 'Connect' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login'
import BaseInput from '@/components/base/BaseInput.vue'

const router = useRouter()
const isSubmitting = ref(false)

const formData = reactive({
  ip: '',
  port: '',
  authKey: ''
})

const errors = reactive({
  ip: '',
  port: '',
  authKey: ''
})

const clearErrors = () => {
  errors.ip = ''
  errors.port = ''
  errors.authKey = ''
}

const validateForm = () => {
  let isValid = true
  clearErrors()

  // IP validation
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipRegex.test(formData.ip)) {
    errors.ip = 'Invalid IP address'
    isValid = false
  }

  // Port validation
  const port = Number(formData.port)
  if (!port || port < 1 || port > 65535) {
    errors.port = 'Port must be between 1 and 65535'
    isValid = false
  }

  // Auth key validation
  if (formData.authKey.length < 6) {
    errors.authKey = 'Auth key must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  try {
    if (!validateForm()) {
      return
    }

    isSubmitting.value = true
    const success = await login(
      formData.ip,
      Number(formData.port),
      formData.authKey
    )
    
    if (success) {
      router.push({ name: 'dashboard' })
    } else {
      errors.authKey = 'Invalid credentials'
    }
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <label class="flex items-center justify-between w-full cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': disabled }">
    <span v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</span>
    <div class="relative">
      <input
        type="checkbox"
        class="sr-only"
        :checked="modelValue"
        :disabled="disabled"
        @change="emit('update:modelValue', !modelValue)"
      />
      <div
        class="checkbox-bg w-14 h-7 bg-gray-200 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
        :class="{ 'bg-blue-600': modelValue }"
      ></div>
      <div
        class="dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out"
        :class="{ 'transform translate-x-7': modelValue }"
      ></div>
    </div>
  </label>
</template>

<style scoped>
.checkbox-bg {
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-bg:hover {
  filter: brightness(95%);
}

.dot {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dot:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
}
</style>

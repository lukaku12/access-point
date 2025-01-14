<script setup lang="ts">
import GenericTable from './GenericTable.vue';
import type { WiFiNetwork } from '@/types/wifi';

const props = defineProps<{
  networks: WiFiNetwork[];
  onEdit: (network: WiFiNetwork) => void;
  onDelete: (network: WiFiNetwork) => void;
}>();

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'ssid', label: 'SSID' },
  { key: 'password', label: 'Password' }
];

const actions = [
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    onClick: (network: WiFiNetwork) => props.onEdit(network),
    color: 'blue-600',
    hoverColor: 'blue-700',
    darkColor: 'blue-500',
    darkHoverColor: 'blue-600'
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    onClick: (network: WiFiNetwork) => props.onDelete(network),
    color: 'red-600',
    hoverColor: 'red-700',
    darkColor: 'red-500',
    darkHoverColor: 'red-600'
  }
];
</script>

<template>
  <GenericTable
    :columns="columns"
    :data="networks"
    :actions="actions"
    :mobile-display-keys="['ssid', 'password']"
    empty-message="No WiFi networks found"
    class="text-gray-900 dark:text-gray-100"
  />
</template>

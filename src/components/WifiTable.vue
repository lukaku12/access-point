<script setup lang="ts">
import GenericTable from './GenericTable.vue';
import type { WiFiNetwork } from '@/types/wifi';

const props = defineProps<{
  networks: WiFiNetwork[];
  onEdit: (network: WiFiNetwork) => void;
  onDelete: (network: WiFiNetwork) => void;
  loading: boolean;
}>();

const isDefaultNetwork = (network: WiFiNetwork) => network.id === 1;

const columns = [
  {
    key: 'id',
    label: 'ID',
    cellClass: (item: WiFiNetwork) =>
      isDefaultNetwork(item)
        ? 'font-extrabold text-2xl text-yellow-500 dark:text-yellow-400'
        : ''
  },
  {
    key: 'ssid',
    label: 'SSID',
    cellClass: (item: WiFiNetwork) =>
      isDefaultNetwork(item)
        ? 'font-extrabold text-2xl text-yellow-500 dark:text-yellow-400'
        : ''
  },
  {
    key: 'password',
    label: 'Password',
    cellClass: (item: WiFiNetwork) =>
      isDefaultNetwork(item)
        ? 'font-extrabold text-2xl text-yellow-500 dark:text-yellow-400'
        : ''
  }
];

const actions = [
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    onClick: (network: WiFiNetwork) => props.onEdit(network),
    color: 'blue-600',
    hoverColor: 'blue-700',
    darkColor: 'blue-500',
    darkHoverColor: 'blue-600',
    show: (network: WiFiNetwork) => !isDefaultNetwork(network)
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    onClick: (network: WiFiNetwork) => props.onDelete(network),
    color: 'red-600',
    hoverColor: 'red-700',
    darkColor: 'red-500',
    darkHoverColor: 'red-600',
    show: (network: WiFiNetwork) => !isDefaultNetwork(network)
  }
];

const getRowClass = (item: WiFiNetwork) => {
  return isDefaultNetwork(item)
    ? 'bg-yellow-50 dark:bg-yellow-900/20 cursor-not-allowed border-l-4 border-yellow-500'
    : '';
};
</script>

<template>
  <GenericTable
    :columns="columns"
    :data="networks"
    :actions="actions"
    :mobile-display-keys="['ssid', 'password']"
    :loading="loading"
    empty-message="No WiFi networks found"
    class="text-gray-900 dark:text-gray-100"
    :row-class="getRowClass"
  />
</template>

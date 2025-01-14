<script setup lang="ts">
import type { Card } from '@/types/card';
import GenericTable from '@/components/GenericTable.vue';

const props = defineProps<{
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}>();

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'number', label: 'Number' },
  { 
    key: 'personal_id', 
    label: 'Personal ID',
    format: (value: string | null) => value || 'N/A'
  },
  { key: 'start_date', label: 'Start Date' },
  { 
    key: 'end_date', 
    label: 'End Date',
    format: (value: string | null) => value || 'N/A'
  }
];

const actions = [
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    onClick: props.onEdit,
    color: 'blue-600',
    hoverColor: 'blue-800'
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    onClick: props.onDelete,
    color: 'red-600',
    hoverColor: 'red-800'
  }
];

const mobileDisplayKeys = ['number'];
</script>

<template>
  <GenericTable
    :columns="columns"
    :data="cards"
    :actions="actions"
    :mobile-display-keys="mobileDisplayKeys"
  />
</template>

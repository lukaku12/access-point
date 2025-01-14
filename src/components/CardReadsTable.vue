<script setup lang="ts">
import type { CardRead } from '@/types/cardReads';

defineProps<{
  cardReads: CardRead[];
}>();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th class="table-header">ID</th>
          <th class="table-header">Card Number</th>
          <th class="table-header">Timestamp</th>
          <th class="table-header">Type</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="read in cardReads" :key="read.id" class="hover:bg-gray-50">
          <td class="table-cell">{{ read.id }}</td>
          <td class="table-cell">{{ read.card_number }}</td>
          <td class="table-cell">{{ new Date(read.timestamp).toLocaleString() }}</td>
          <td class="table-cell">{{ read.type }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-header {
  @apply px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-50;
}

.table-cell {
  @apply px-3 py-4 text-sm text-gray-500 whitespace-nowrap;
}
</style>

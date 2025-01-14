<script setup lang="ts">
interface Column {
  key: string;
  label: string;
  format?: (value: any) => string;
}

interface Action {
  label: string;
  icon: string;
  onClick: (item: any) => void;
  color: string;
  hoverColor: string;
}

defineProps<{
  columns: Column[];
  data: any[];
  actions?: Action[];
  mobileDisplayKeys?: string[]; // Keys to show prominently on mobile
}>();
</script>

<template>
  <div class="overflow-x-auto">
    <!-- Desktop view -->
    <table class="min-w-full divide-y divide-gray-200 hidden md:table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ column.label }}
          </th>
          <th v-if="actions?.length"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in data" :key="item.id">
          <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
            {{ column.format ? column.format(item[column.key]) : item[column.key] }}
          </td>
          <td v-if="actions?.length" class="px-6 py-4 whitespace-nowrap">
            <div class="flex space-x-2">
              <button v-for="action in actions" :key="action.label" @click="action.onClick(item)"
                :class="[`text-${action.color} hover:text-${action.hoverColor}`]">
                <div :class="[action.icon, 'w-5 h-5']" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile view -->
    <div class="md:hidden space-y-4">
      <div v-for="item in data" :key="item.id" class="bg-white rounded-lg shadow p-4 space-y-3">
        <!-- Primary display for mobile -->
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <template v-if="mobileDisplayKeys">
              <div v-for="key in mobileDisplayKeys" :key="key">
                <div class="text-sm text-gray-500">{{ columns.find(col => col.key === key)?.label }}</div>
                <div class="font-medium">
                  {{ columns.find(col => col.key === key)?.format
                    ? columns.find(col => col.key === key)?.format!(item[key])
                    : item[key] }}
                </div>
              </div>
            </template>
          </div>
          <div v-if="actions?.length" class="flex space-x-2">
            <button v-for="action in actions" :key="action.label" @click="action.onClick(item)"
              :class="[`text-${action.color} hover:text-${action.hoverColor}`]">
              <div :class="[action.icon, 'w-5 h-5']" />
            </button>
          </div>
        </div>

        <!-- Rest of the data -->
        <div class="grid grid-cols-2 gap-3 text-sm">
          <template v-for="column in columns" :key="column.key">
            <div v-if="!mobileDisplayKeys?.includes(column.key)">
              <div class="text-gray-500">{{ column.label }}</div>
              <div>
                {{ column.format ? column.format(item[column.key]) : item[column.key] }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

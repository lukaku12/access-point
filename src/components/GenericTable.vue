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
  <div class="overflow-x-auto rounded-lg border border-gray-200/60 shadow-sm">
    <!-- Desktop view -->
    <table class="min-w-full divide-y divide-gray-200/60 hidden md:table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key"
            class="px-6 py-4 bg-gray-50/50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider first:rounded-tl-lg last:rounded-tr-lg">
            {{ column.label }}
          </th>
          <th v-if="actions?.length"
            class="px-6 py-4 bg-gray-50/50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200/60">
        <tr v-for="item in data" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
          <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
            {{ column.format ? column.format(item[column.key]) : item[column.key] }}
          </td>
          <td v-if="actions?.length" class="px-6 py-4 whitespace-nowrap">
            <div class="flex space-x-3">
              <button v-for="action in actions" :key="action.label" @click="action.onClick(item)"
                :class="[`text-${action.color} hover:text-${action.hoverColor} transition-colors`]">
                <div :class="[action.icon, 'w-5 h-5']" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile view -->
    <div class="md:hidden divide-y divide-gray-200/60">
      <div v-for="item in data" :key="item.id" 
           class="bg-white p-4 space-y-3 hover:bg-gray-50/50 transition-colors">
        <!-- Primary display for mobile -->
        <div class="flex justify-between items-start">
          <div class="space-y-2">
            <template v-if="mobileDisplayKeys">
              <div v-for="key in mobileDisplayKeys" :key="key" class="space-y-1">
                <div class="text-sm text-gray-500">{{ columns.find(col => col.key === key)?.label }}</div>
                <div class="font-medium">
                  {{ columns.find(col => col.key === key)?.format
                    ? columns.find(col => col.key === key)?.format!(item[key])
                    : item[key] }}
                </div>
              </div>
            </template>
          </div>
          <div v-if="actions?.length" class="flex space-x-3">
            <button v-for="action in actions" :key="action.label" @click="action.onClick(item)"
              :class="[`text-${action.color} hover:text-${action.hoverColor} transition-colors`]">
              <div :class="[action.icon, 'w-5 h-5']" />
            </button>
          </div>
        </div>

        <!-- Rest of the data -->
        <div class="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-100">
          <template v-for="column in columns" :key="column.key">
            <div v-if="!mobileDisplayKeys?.includes(column.key)" class="space-y-1">
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

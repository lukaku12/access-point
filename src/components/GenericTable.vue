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
  emptyMessage?: string; // Optional custom empty state message
}>();
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200/60 shadow-sm">
    <!-- Desktop view -->
    <table class="min-w-full divide-y divide-gray-200/60 hidden md:table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 bg-gray-50/50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider first:rounded-tl-lg last:rounded-tr-lg"
          >
            {{ column.label }}
          </th>
          <th
            v-if="actions?.length"
            class="px-6 py-4 bg-gray-50/50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200/60">
        <template v-if="data.length">
          <tr
            v-for="item in data"
            :key="item.id"
            class="hover:bg-gray-50/50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
            >
              {{
                column.format
                  ? column.format(item[column.key])
                  : item[column.key]
              }}
            </td>
            <td v-if="actions?.length" class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-3">
                <button
                  v-for="action in actions"
                  :key="action.label"
                  @click="action.onClick(item)"
                  :class="[
                    `text-${action.color} hover:text-${action.hoverColor} transition-colors`
                  ]"
                >
                  <div :class="[action.icon, 'w-5 h-5']" />
                </button>
              </div>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td
            :colspan="actions?.length ? columns.length + 1 : columns.length"
            class="px-6 py-12 text-center"
          >
            <div class="flex flex-col items-center justify-center">
              <div class="text-gray-400">
                <svg
                  class="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <p class="mt-4 text-gray-500">
                {{ emptyMessage || 'No data available' }}
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile view -->
    <div class="md:hidden">
      <div class="bg-gray-50/50 p-4">
        <template v-if="mobileDisplayKeys">
          <div
            class="text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{
              columns.find((col) => col.key === mobileDisplayKeys?.[0])?.label
            }}
          </div>
        </template>
      </div>
      <div class="divide-y divide-gray-200/60">
        <template v-if="data.length">
          <div
            v-for="item in data"
            :key="item.id"
            class="bg-white p-4 space-y-3 hover:bg-gray-50/50 transition-colors"
          >
            <!-- Primary display for mobile -->
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <template v-if="mobileDisplayKeys">
                  <div
                    v-for="key in mobileDisplayKeys"
                    :key="key"
                    class="space-y-1"
                  >
                    <div class="text-sm text-gray-500">
                      {{ columns.find((col) => col.key === key)?.label }}
                    </div>
                    <div class="font-medium">
                      {{
                        columns.find((col) => col.key === key)?.format
                          ? columns.find((col) => col.key === key)?.format!(
                              item[key]
                            )
                          : item[key]
                      }}
                    </div>
                  </div>
                </template>
              </div>
              <div v-if="actions?.length" class="flex space-x-3">
                <button
                  v-for="action in actions"
                  :key="action.label"
                  @click="action.onClick(item)"
                  :class="[
                    `text-${action.color} hover:text-${action.hoverColor} transition-colors`
                  ]"
                >
                  <div :class="[action.icon, 'w-5 h-5']" />
                </button>
              </div>
            </div>

            <!-- Rest of the data -->
            <div
              class="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-100"
            >
              <template v-for="column in columns" :key="column.key">
                <div
                  v-if="!mobileDisplayKeys?.includes(column.key)"
                  class="space-y-1"
                >
                  <div class="text-gray-500">{{ column.label }}</div>
                  <div>
                    {{
                      column.format
                        ? column.format(item[column.key])
                        : item[column.key]
                    }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 bg-white"
        >
          <div class="text-gray-400">
            <svg
              class="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <p class="mt-4 text-gray-500">
            {{ emptyMessage || 'No data available' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

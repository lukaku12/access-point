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
  loading?: boolean; // Add this prop
}>();
</script>

<template>
  <div
    class="overflow-x-auto rounded-lg border border-gray-200/60 dark:border-gray-700/60 shadow-sm"
  >
    <!-- Desktop view -->
    <table
      class="min-w-full divide-y divide-gray-200/60 dark:divide-gray-700/60 hidden md:table"
    >
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider first:rounded-tl-lg last:rounded-tr-lg"
          >
            {{ column.label }}
          </th>
          <th
            v-if="actions?.length"
            class="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-tr-lg"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-900 divide-y divide-gray-200/60 dark:divide-gray-700/60"
      >
        <template v-if="loading">
          <tr>
            <td
              :colspan="actions?.length ? columns.length + 1 : columns.length"
              class="px-6 py-12"
            >
              <div class="flex flex-col items-center justify-center h-[200px]">
                <div class="text-gray-400 dark:text-gray-500 animate-spin">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <p class="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
              </div>
            </td>
          </tr>
        </template>
        <template v-else>
          <Transition name="fade-slide" mode="out-in">
            <div v-if="data.length" :key="'data'" class="contents">
              <tr
                v-for="item in data"
                :key="item.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td
                  v-for="column in columns"
                  :key="column.key"
                  class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100"
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
            </div>
            <tr v-else>
              <td
                :colspan="actions?.length ? columns.length + 1 : columns.length"
                class="px-6 py-12"
              >
                <div
                  class="flex flex-col items-center justify-center h-[200px]"
                >
                  <div class="text-gray-400 dark:text-gray-500">
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
                  <p class="mt-4 text-gray-500 dark:text-gray-400">
                    {{ emptyMessage || 'No data available' }}
                  </p>
                </div>
              </td>
            </tr>
          </Transition>
        </template>
      </tbody>
    </table>

    <!-- Mobile view -->
    <div class="md:hidden">
      <div class="bg-gray-50/50 dark:bg-gray-800/50 p-4">
        <template v-if="mobileDisplayKeys">
          <div
            class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{
              columns.find((col: any) => col.key === mobileDisplayKeys?.[0])
                ?.label
            }}
          </div>
        </template>
      </div>
      <div class="divide-y divide-gray-200/60 dark:divide-gray-700/60">
        <template v-if="loading">
          <div
            class="flex flex-col items-center justify-center h-[200px] bg-white dark:bg-gray-900"
          >
            <div class="text-gray-400 dark:text-gray-500 animate-spin">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </template>
        <template v-else>
          <Transition name="fade-slide" mode="out-in">
            <div
              v-if="data.length"
              :key="'data'"
              class="divide-y divide-gray-200/60 dark:divide-gray-700/60"
            >
              <div
                v-for="item in data"
                :key="item.id"
                class="bg-white dark:bg-gray-900 p-4 space-y-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
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
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{
                            columns.find((col: any) => col.key === key)?.label
                          }}
                        </div>
                        <div
                          class="font-medium text-gray-900 dark:text-gray-100"
                        >
                          {{
                            columns.find((col: any) => col.key === key)?.format
                              ? columns.find((col: any) => col.key === key)
                                  ?.format!(item[key])
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
                  class="grid grid-cols-2 gap-4 text-sm pt-3 border-t border-gray-100 dark:border-gray-800"
                >
                  <template v-for="column in columns" :key="column.key">
                    <div
                      v-if="!mobileDisplayKeys?.includes(column.key)"
                      class="space-y-1"
                    >
                      <div class="text-gray-500 dark:text-gray-400">
                        {{ column.label }}
                      </div>
                      <div class="text-gray-900 dark:text-gray-100">
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
            </div>
            <div
              v-else
              :key="loading ? 'loading' : 'empty'"
              class="flex flex-col items-center justify-center h-[200px] bg-white dark:bg-gray-900 transition-all duration-500"
            >
              <Transition name="fade" mode="out-in">
                <div
                  v-if="loading"
                  :key="'loading'"
                  class="text-gray-400 dark:text-gray-500 animate-spin"
                >
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div
                  v-else
                  :key="'empty'"
                  class="text-gray-400 dark:text-gray-500"
                >
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
              </Transition>
              <p class="mt-4 text-gray-500 dark:text-gray-400">
                {{
                  loading ? 'Loading...' : emptyMessage || 'No data available'
                }}
              </p>
            </div>
          </Transition>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  max-height: 0;
}

.fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Table animations */
tbody tr {
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Empty state container animation */
td > div {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.contents {
  display: contents;
}

/* Mobile view animations */
.md\:hidden > div > div {
  transition:
    max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
</style>

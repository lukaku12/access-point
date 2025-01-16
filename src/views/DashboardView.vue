<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getDashboardStats } from '@/api/dashboard';
import type { DashboardApiResponse } from '@/types/dashboard';
import DashboardCard from '@/components/DashboardCard.vue';

const stats = ref<DashboardApiResponse>({
  api_version: '',
  status: '',
  wifi: {
    rssi: 0,
    strength: 0,
    ssid: 'N/A',
    ip: 'N/A',
    mac: 'N/A'
  },
  system: {
    cpu_freq: 0,
    uptime: 'N/A',
    timestamp: 0
  },
  heap: {
    free: '',
    total: '',
    minimum: '',
    usage_percent: 0
  },
  storage: {
    flash: {
      size: 'N/A',
      speed: 'N/A'
    },
    filesystem: {
      total: '',
      used: '',
      free: '',
      usage_percent: 0
    }
  },
  database: {
    cards: {
      total: 0,
      active: 0,
      inactive: 0,
      active_percent: 0
    },
    reads: {
      today: 0,
      total: 0
    }
  },
  time: {
    datetime: 'N/A',
    is_valid: false,
    time_source: 'N/A',
    timezone: 'N/A',
    timestamp: 0
  }
});

const lastUpdate = ref('Just now');
const isLoading = ref(false);
const initialLoading = ref(true); // Add this new ref
const error = ref<string | null>(null);
const isVisible = ref(true);

let statsInterval: number | NodeJS.Timeout;

const updateStats = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const { data } = await getDashboardStats();
    stats.value = data;
    lastUpdate.value = new Date().toLocaleTimeString();
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch stats';
  } finally {
    isLoading.value = false;
    initialLoading.value = false; // Set initial loading to false after first load
  }
};

onMounted(() => {
  updateStats();
  statsInterval = setInterval(updateStats, 5000);
});

onUnmounted(() => {
  if (statsInterval) {
    clearInterval(statsInterval);
  }
});
</script>

<template>
  <div class="max-w-7xl mx-auto min-h-[calc(100vh-152px)] my-auto">
    <div
      :class="{ ' opacity-1 ': error, ' opacity-0 ': !error }"
      class="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 mb-6"
    >
      <p class="text-red-700 dark:text-red-200">
        {{ error + ' | Retrying...' || 'haha' }}
      </p>
    </div>

    <transition name="fade">
      <div
        v-show="isVisible"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <!-- Network Information -->
        <DashboardCard title="Network Information" :isLoading="initialLoading">
          <hr class="border-gray-200 dark:border-gray-700 my-2" />
          <div class="space-y-2">
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">SSID:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.wifi.ssid
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">IP Address:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.wifi.ip
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">MAC Address:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.wifi.mac
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300"
                >Signal Strength:</span
              >
              <span class="stat-value dark:text-gray-100"
                >{{ stats.wifi.rssi }}dBm</span
              >
            </div>
          </div>
        </DashboardCard>

        <!-- System Information -->
        <DashboardCard title="System Information" :isLoading="initialLoading">
          <hr class="border-gray-200 dark:border-gray-700 my-2" />
          <div class="space-y-2">
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">CPU Frequency:</span>
              <span class="stat-value dark:text-gray-100"
                >{{ stats.system.cpu_freq }} MHz</span
              >
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Uptime:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.system.uptime
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Flash Size:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.storage.flash.size
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Flash Speed:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.storage.flash.speed
              }}</span>
            </div>
          </div>
        </DashboardCard>

        <!-- Memory & Storage -->
        <DashboardCard title="Memory & Storage" :isLoading="initialLoading">
          <hr class="border-gray-200 dark:border-gray-700 my-2" />
          <div class="space-y-4">
            <div>
              <div class="stat-row mb-2">
                <span class="stat-label dark:text-gray-300">Heap Usage:</span>
                <span class="stat-value dark:text-gray-100"
                  >{{ stats.heap.usage_percent.toFixed(2) }}%</span
                >
              </div>
              <div
                class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1"
              >
                <div
                  class="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                  :style="{ width: `${stats.heap.usage_percent}%` }"
                ></div>
              </div>
              <div class="storage-info dark:text-gray-400">
                <span class="storage-label dark:text-gray-300">Free:</span>
                <span class="storage-value dark:text-gray-200">{{
                  stats.heap.free
                }}</span>
                <span class="storage-separator dark:text-gray-500">/</span>
                <span class="storage-label dark:text-gray-300">Total:</span>
                <span class="storage-value dark:text-gray-200">{{
                  stats.heap.total
                }}</span>
              </div>
            </div>
            <div>
              <div class="stat-row mb-2">
                <span class="stat-label dark:text-gray-300"
                  >Storage Usage:</span
                >
                <span class="stat-value dark:text-gray-100"
                  >{{
                    stats.storage.filesystem.usage_percent.toFixed(2)
                  }}%</span
                >
              </div>
              <div
                class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1"
              >
                <div
                  class="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                  :style="{
                    width: `${stats.storage.filesystem.usage_percent}%`
                  }"
                ></div>
              </div>
              <div class="storage-info dark:text-gray-400">
                <span class="storage-label dark:text-gray-300">Used:</span>
                <span class="storage-value dark:text-gray-200">{{
                  stats.storage.filesystem.used
                }}</span>
                <span class="storage-separator dark:text-gray-500">/</span>
                <span class="storage-label dark:text-gray-300">Total:</span>
                <span class="storage-value dark:text-gray-200">{{
                  stats.storage.filesystem.total
                }}</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <!-- Database Statistics -->
        <DashboardCard title="Database Statistics" :isLoading="initialLoading">
          <hr class="border-gray-200 dark:border-gray-700 my-2" />
          <div class="space-y-2">
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Total Cards:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.database.cards.total
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Active Cards:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.database.cards.active
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Inactive Cards:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.database.cards.inactive
              }}</span>
            </div>
            <hr class="border-gray-200 dark:border-gray-700" />
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Reads Today:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.database.reads.today
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Total Reads:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.database.reads.total
              }}</span>
            </div>
          </div>
        </DashboardCard>

        <!-- Time Information -->
        <DashboardCard title="Time Information" :isLoading="initialLoading">
          <hr class="border-gray-200 dark:border-gray-700 my-2" />
          <div class="space-y-2">
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Date & Time:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.time.datetime
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Time Stamp:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.time.timestamp
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Time Source:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.time.time_source
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Timezone:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.time.timezone
              }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label dark:text-gray-300">Status:</span>
              <span class="stat-value dark:text-gray-100">{{
                stats.time.is_valid ? 'Valid' : 'Invalid'
              }}</span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </transition>

    <div class="text-right text-gray-500 dark:text-gray-400 text-sm mt-4">
      Last updated: {{ lastUpdate }}
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.stat-label {
  color: #374151;
  font-weight: 500;
}

.stat-value {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
  min-width: 6.5rem; /* Increased min-width to accommodate fixed decimals */
  text-align: right;
  transition: all 0.3s ease;
}

/* Progress bar colors */
.bg-blue-600 {
  transition: width 0.3s ease;
}

.storage-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.storage-label {
  font-weight: 500;
}

.storage-value {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-width: 4.5rem;
  display: inline-block;
  text-align: right;
}

.storage-separator {
  color: #9ca3af;
  padding: 0 0.25rem;
}

.stat-label {
  @apply text-gray-700 dark:text-gray-300 font-medium;
}

.stat-value {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  @apply text-gray-900 dark:text-gray-100;
  min-width: 6.5rem;
  text-align: right;
  transition: all 0.3s ease;
}

.storage-info {
  @apply flex justify-center items-center gap-2 text-sm text-gray-600 dark:text-gray-400;
}

.storage-label {
  @apply font-medium text-gray-700 dark:text-gray-300;
}

.storage-value {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  @apply text-gray-900 dark:text-gray-100;
  min-width: 4.5rem;
  display: inline-block;
  text-align: right;
}

.storage-separator {
  @apply text-gray-400 dark:text-gray-600;
  padding: 0 0.25rem;
}
</style>

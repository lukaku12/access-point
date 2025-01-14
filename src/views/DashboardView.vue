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
  <div class="max-w-7xl mx-auto">
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <transition name="fade">
      <div
        v-show="isVisible"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <!-- Network Information -->
        <DashboardCard title="Network Information" :isLoading="initialLoading">
          <div class="space-y-2">
            <div class="stat-row">
              <span class="stat-label">SSID:</span>
              <span class="stat-value">{{ stats.wifi.ssid }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">IP Address:</span>
              <span class="stat-value">{{ stats.wifi.ip }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">MAC Address:</span>
              <span class="stat-value">{{ stats.wifi.mac }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Signal Strength:</span>
              <span class="stat-value">{{ stats.wifi.rssi }}dBm</span>
            </div>
          </div>
        </DashboardCard>

        <!-- System Information -->
        <DashboardCard title="System Information" :isLoading="initialLoading">
          <div class="space-y-2">
            <div class="stat-row">
              <span class="stat-label">CPU Frequency:</span>
              <span class="stat-value">{{ stats.system.cpu_freq }} MHz</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Uptime:</span>
              <span class="stat-value">{{ stats.system.uptime }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Flash Size:</span>
              <span class="stat-value">{{ stats.storage.flash.size }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Flash Speed:</span>
              <span class="stat-value">{{ stats.storage.flash.speed }}</span>
            </div>
          </div>
        </DashboardCard>

        <!-- Memory & Storage -->
        <DashboardCard title="Memory & Storage" :isLoading="initialLoading">
          <div class="space-y-4">
            <div>
              <div class="stat-row mb-2">
                <span class="stat-label">Heap Usage:</span>
                <span class="stat-value"
                  >{{ stats.heap.usage_percent.toFixed(2) }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  class="bg-blue-600 h-2.5 rounded-full"
                  :style="{ width: `${stats.heap.usage_percent}%` }"
                ></div>
              </div>
              <div class="storage-info">
                <span class="storage-label">Free:</span>
                <span class="storage-value">{{ stats.heap.free }}</span>
                <span class="storage-separator">/</span>
                <span class="storage-label">Total:</span>
                <span class="storage-value">{{ stats.heap.total }}</span>
              </div>
            </div>
            <div>
              <div class="stat-row mb-2">
                <span class="stat-label">Storage Usage:</span>
                <span class="stat-value"
                  >{{
                    stats.storage.filesystem.usage_percent.toFixed(2)
                  }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div
                  class="bg-blue-600 h-2.5 rounded-full"
                  :style="{
                    width: `${stats.storage.filesystem.usage_percent}%`
                  }"
                ></div>
              </div>
              <div class="storage-info">
                <span class="storage-label">Used:</span>
                <span class="storage-value">{{
                  stats.storage.filesystem.used
                }}</span>
                <span class="storage-separator">/</span>
                <span class="storage-label">Total:</span>
                <span class="storage-value">{{
                  stats.storage.filesystem.total
                }}</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <!-- Database Statistics -->
        <DashboardCard title="Database Statistics" :isLoading="initialLoading">
          <div class="space-y-2">
            <div class="stat-row">
              <span class="stat-label">Total Cards:</span>
              <span class="stat-value">{{ stats.database.cards.total }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Active Cards:</span>
              <span class="stat-value">{{ stats.database.cards.active }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Inactive Cards:</span>
              <span class="stat-value">{{
                stats.database.cards.inactive
              }}</span>
            </div>
            <hr />
            <div class="stat-row">
              <span class="stat-label">Reads Today:</span>
              <span class="stat-value">{{ stats.database.reads.today }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Total Reads:</span>
              <span class="stat-value">{{ stats.database.reads.total }}</span>
            </div>
            <hr />
          </div>
        </DashboardCard>
      </div>
    </transition>

    <div class="text-right text-gray-500 text-sm mt-4">
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
</style>

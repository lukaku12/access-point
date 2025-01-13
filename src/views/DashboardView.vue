<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getDashboardStats } from '@/api/dashboard';
import type { DashboardStats, SystemInfo } from '@/types/dashboard';
import NavBar from '@/components/NavBar.vue';

const stats = ref<DashboardStats>({
  wifi_rssi: 0,
  uptime: 0,
  free_heap: '0',
  heap_used_percentage: 0,
  littlefs_used: '0',
  storage_percentage: 0,
  total_cards: 0,
  card_reads_today: 0,
  total_card_reads: 0,
  current_datetime: '',
  time_source: '',
  timezone: '',
  using_fallback_time: false,
  has_valid_time: false,
  total_wifi_credentials: 0
});

const lastUpdate = ref('Just now');
const systemInfo = ref<SystemInfo>({
  chipId: 'ESP32-XXXXX',
  wifiIp: '192.168.1.100',
  firmwareVersion: '1.0.0',
  totalHeap: '512KB',
  minFreeHeap: '128KB',
  flashSize: '4MB',
  flashSpeed: 80,
  littlefsTotal: '2MB'
});

const isLoading = ref(false);
const error = ref<string | null>(null);

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
    <NavBar>
      <template #header>
        <h1 class="text-3xl font-bold">ESP32 Dashboard</h1>
        <p class="text-blue-100">System Monitor and Statistics</p>
      </template>
    </NavBar>

    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <template v-if="isLoading">
        <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md p-6 animate-pulse-slow">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div v-for="i in 4" :key="i" class="h-4 bg-gray-100 rounded my-2"></div>
        </div>
      </template>
      
      <template v-else>
        <!-- Time Information Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-4">
            Time Information
          </h2>
          <div class="space-y-2">
            <p><span class="font-medium">Current Time:</span> {{ stats.current_datetime }}</p>
            <p><span class="font-medium">Time Source:</span> {{ stats.time_source }}</p>
            <p><span class="font-medium">Timezone:</span> {{ stats.timezone }}</p>
            <p><span class="font-medium">Time Status:</span>
              <span :class="stats.has_valid_time ? 'text-green-600' : 'text-red-600'">
                {{ stats.has_valid_time ? 'Valid' : 'Invalid' }}
              </span>
            </p>
          </div>
        </div>

        <!-- System Information Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-4">
            System Information
          </h2>
          <div class="space-y-2">
            <p><span class="font-medium">Chip ID:</span> {{ systemInfo.chipId }}</p>
            <p><span class="font-medium">IP Address:</span> {{ systemInfo.wifiIp }}</p>
            <p><span class="font-medium">Firmware:</span> {{ systemInfo.firmwareVersion }}</p>
            <p><span class="font-medium">WiFi Signal:</span> {{ stats.wifi_rssi }}dBm</p>
            <p><span class="font-medium">Uptime:</span> {{ stats.uptime }} seconds</p>
          </div>
        </div>

        <!-- Memory & Storage Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-4">
            Memory & Storage
          </h2>
          <div class="space-y-2">
            <div>
              <p class="mb-1"><span class="font-medium">Heap Usage:</span></p>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" 
                     :style="{ width: `${stats.heap_used_percentage}%` }"></div>
              </div>
              <p class="text-sm text-gray-600">Free: {{ stats.free_heap }}</p>
            </div>
            <div>
              <p class="mb-1"><span class="font-medium">Storage Usage:</span></p>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" 
                     :style="{ width: `${stats.storage_percentage}%` }"></div>
              </div>
              <p class="text-sm text-gray-600">Used: {{ stats.littlefs_used }}</p>
            </div>
          </div>
        </div>

        <!-- Card Statistics -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-blue-600 border-b border-blue-100 pb-2 mb-4">
            Card Statistics
          </h2>
          <div class="space-y-2">
            <p><span class="font-medium">Total Cards:</span> {{ stats.total_cards }}</p>
            <p><span class="font-medium">Reads Today:</span> {{ stats.card_reads_today }}</p>
            <p><span class="font-medium">Total Reads:</span> {{ stats.total_card_reads }}</p>
            <p><span class="font-medium">WiFi Credentials:</span> {{ stats.total_wifi_credentials }}</p>
          </div>
        </div>
      </template>
    </div>

    <div class="text-right text-gray-500 text-sm mt-4">
      Last updated: {{ lastUpdate }}
    </div>
  </div>
</template>

export interface DashboardStats {
  wifi_rssi: number;
  uptime: number;
  free_heap: string;
  heap_used_percentage: number;
  littlefs_used: string;
  storage_percentage: number;
  total_cards: number;
  card_reads_today: number;
  total_card_reads: number;
  current_datetime: string;
  time_source: string;
  timezone: string;
  using_fallback_time: boolean;
  has_valid_time: boolean;
  total_wifi_credentials: number;
}

export interface SystemInfo {
  chipId: string;
  wifiIp: string;
  firmwareVersion: string;
  totalHeap: string;
  minFreeHeap: string;
  flashSize: string;
  flashSpeed: number;
  littlefsTotal: string;
}

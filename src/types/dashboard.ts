export interface DashboardApiResponse {
  api_version: string;
  status: string;
  wifi: WifiInfo;
  system: SystemInfo;
  heap: HeapInfo;
  storage: StorageInfo;
  database: DatabaseInfo;
  time: TimeInfo;
}

export interface WifiInfo {
  rssi: number;
  strength: number;
  ssid: string;
  ip: string;
  mac: string;
}

export interface SystemInfo {
  cpu_freq: number;
  uptime: string;
  timestamp: number;
}

export interface HeapInfo {
  free: string;
  total: string;
  minimum: string;
  usage_percent: number;
}

export interface StorageInfo {
  flash: {
    size: string;
    speed: string;
  };
  filesystem: {
    total: string;
    used: string;
    free: string;
    usage_percent: number;
  };
}

export interface DatabaseInfo {
  cards: {
    total: number;
    active: number;
    inactive: number;
    active_percent: number;
  };
  reads: {
    today: number;
    total: number;
  };
}

export interface TimeInfo {
  datetime: string;
  is_valid: boolean;
  time_source: string;
  timezone: string;
  timestamp: number;
}

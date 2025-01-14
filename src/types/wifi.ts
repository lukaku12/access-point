export interface WiFiNetwork {
  id: number;
  ssid: string;
  password: string;
}

interface ApiResponse {
  status: string;
  code: number;
  message: string;
}

interface PaginationData {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface GetWiFiNetworksResponse extends ApiResponse {
  data: WiFiNetwork[];
  pagination: PaginationData;
}

export interface CreateWiFiResponse extends ApiResponse {
  data: WiFiNetwork;
}

export interface UpdateWiFiResponse extends ApiResponse {
  data: WiFiNetwork;
}

export interface DeleteWiFiResponse extends ApiResponse {
  data: { deleted: boolean };
}

export interface DeleteAllWiFiResponse extends ApiResponse {
  data: { networks_removed: number };
}

export const isCreateWiFiSuccess = (data: any): data is CreateWiFiResponse => {
  return data.status === 'success' && data.data?.id;
};

export const isCreateWiFiError = (data: any): data is ApiResponse => {
  return data.status === 'error';
};

export const isUpdateWiFiSuccess = (data: any): data is UpdateWiFiResponse => {
  return data.status === 'success' && data.data?.id;
};

export const isUpdateWiFiError = (data: any): data is ApiResponse => {
  return data.status === 'error';
};

export const isDeleteWiFiSuccess = (data: any): data is DeleteWiFiResponse => {
  return data.status === 'success' && data.data?.deleted === true;
};

export const isDeleteWiFiError = (data: any): data is ApiResponse => {
  return data.status === 'error';
};

export const isDeleteAllWiFiSuccess = (
  data: any
): data is DeleteAllWiFiResponse => {
  return (
    data.status === 'success' && typeof data.data?.networks_removed === 'number'
  );
};

export const isDeleteAllWiFiError = (data: any): data is ApiResponse => {
  return data.status === 'error';
};

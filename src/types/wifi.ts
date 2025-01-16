export interface WiFiNetwork {
  id: number;
  ssid: string;
  password: string;
}

// Base interface for API responses
interface ApiResponseBase {
  code: number;
  message: string;
}

// Success and Error response interfaces
export interface ApiSuccessResponse extends ApiResponseBase {
  status: 'success';
}

export interface ApiErrorResponse extends ApiResponseBase {
  status: 'error';
}

// Remove unused ApiResponse type

export interface WiFiCredentials {
  ssid: string;
  password: string;
}

export interface CurrentConnection {
  ssid: string;
  ip: string;
  mac: string;
}

export interface GetWiFiNetworksResponse extends ApiSuccessResponse {
  data: WiFiNetwork[];
  timestamp: number;
  current_connection: CurrentConnection;
}

export interface CreateWiFiResponse extends ApiSuccessResponse {
  timestamp: number;
  data: WiFiCredentials;
}

export interface UpdateWiFiResponse extends ApiSuccessResponse {
  data: WiFiNetwork;
}

export interface DeleteWiFiResponse extends ApiSuccessResponse {
  data: { deleted: boolean };
}

export interface DeleteAllWiFiResponse extends ApiSuccessResponse {
  timestamp: number;
  data: {
    cleared_count: number;
    default_credentials_preserved: boolean;
  };
}

// Type guards with proper typing
export const isCreateWiFiSuccess = (
  data: unknown
): data is CreateWiFiResponse => {
  const response = data as Partial<CreateWiFiResponse>;
  return response?.status === 'success';
};

export const isCreateWiFiError = (data: unknown): data is ApiErrorResponse => {
  const response = data as Partial<ApiErrorResponse>;
  return response?.status === 'error' && !!response?.message;
};

export const isUpdateWiFiSuccess = (
  data: unknown
): data is UpdateWiFiResponse => {
  const response = data as Partial<UpdateWiFiResponse>;
  return response?.status === 'success';
};

export const isUpdateWiFiError = (data: unknown): data is ApiErrorResponse => {
  const response = data as Partial<ApiErrorResponse>;
  return response?.status === 'error' && !!response?.message;
};

export const isDeleteWiFiSuccess = (
  data: unknown
): data is DeleteWiFiResponse => {
  const response = data as Partial<DeleteWiFiResponse>;
  return response?.status === 'success';
};

export const isDeleteWiFiError = (data: unknown): data is ApiErrorResponse => {
  const response = data as Partial<ApiErrorResponse>;
  return response?.status === 'error' && !!response?.message;
};

export const isDeleteAllWiFiSuccess = (
  data: unknown
): data is DeleteAllWiFiResponse => {
  const response = data as Partial<DeleteAllWiFiResponse>;
  return response?.status === 'success';
};

export const isDeleteAllWiFiError = (
  data: unknown
): data is ApiErrorResponse => {
  const response = data as Partial<ApiErrorResponse>;
  return response?.status === 'error' && !!response?.message;
};

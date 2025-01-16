import api from '@/api/axios';
import type { Config, ConfigUpdatePayload } from '@/types/config';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  code: number;
  timestamp: number;
  data: T;
}

export const getConfig = async (): Promise<Config> => {
  try {
    const response = await api.get<ApiResponse<Config>>('/config');
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error('Invalid response from server');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch configuration');
  }
};

export const updateConfig = async (
  payload: ConfigUpdatePayload
): Promise<Config> => {
  try {
    const response = await api.put<ApiResponse<Config>>('/config', payload);
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error('Invalid response from server');
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Failed to update configuration';
    throw new Error(errorMessage);
  }
};

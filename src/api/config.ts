import api from '@/api/axios';
import type { Config, ConfigUpdatePayload } from '@/types/config';

export const getConfig = async (): Promise<Config> => {
  return await api.get('/config');
};

export const updateConfig = async (
  payload: ConfigUpdatePayload
): Promise<void> => {
  return await api.put('/config', payload);
};

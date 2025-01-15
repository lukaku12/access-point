import api from '@/api/axios';
import type { DashboardApiResponse } from '@/types/dashboard';

export const getDashboardStats = async () => {
  return api.get<DashboardApiResponse>('/stats');
};

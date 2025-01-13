import api from './axios';
import type { DashboardApiResponse } from '@/types/dashboard';

export const getDashboardStats = () => {
  return api.post<DashboardApiResponse>('/stats');
};

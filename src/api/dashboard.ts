import api from './axios';
import type { DashboardStats } from '@/types/dashboard';

export const getDashboardStats = () => {
  return api.get<DashboardStats>('/api/stats');
};

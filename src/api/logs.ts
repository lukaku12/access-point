import api from '@/api/axios';
import type {
  LogsResponse,
  DeleteLogResponse,
  ClearLogsResponse,
} from '@/types/logs';

export const fetchLogs = (page = 1, perPage = 100) => {
  return api.get<LogsResponse>('/logs', {
    params: {
      page,
      per_page: perPage
    }
  });
};

// Rename function to avoid conflict
export const removeLog = async (id: string) => {
  return api.delete<DeleteLogResponse>('/logs', {
    params: { id }
  });
};

export const clearLogs = async () => {
  return api.post<ClearLogsResponse>('/clear-logs');
};

export interface RestartScheduleBase {
  id: number;
  schedule_type: 'daily' | 'weekly' | 'monthly' | 'once';
  time: string;
  created_at: number; // Changed from string to number as API returns Unix timestamp
  updated_at: number; // Changed from string to number as API returns Unix timestamp
}

export interface DailySchedule extends RestartScheduleBase {
  schedule_type: 'daily';
}

export interface WeeklySchedule extends RestartScheduleBase {
  schedule_type: 'weekly';
  days_of_week: number[];
}

export interface MonthlySchedule extends RestartScheduleBase {
  schedule_type: 'monthly';
  days_of_month: number[];
}

export interface OneTimeSchedule extends RestartScheduleBase {
  schedule_type: 'once';
  restart_date: string;
}

export type RestartSchedule = DailySchedule | WeeklySchedule | MonthlySchedule | OneTimeSchedule;

export interface PaginationInfo {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  status: string;
  timestamp: number;
  code?: number;
  message?: string;
  data: T;
}

export type RestartSchedulesResponse = ApiResponse<RestartSchedule[]> & {
  pagination: PaginationInfo;
};

export type CreateRestartScheduleResponse = ApiResponse<RestartSchedule>;
export type UpdateRestartScheduleResponse = ApiResponse<RestartSchedule>;
export type DeleteRestartScheduleResponse = ApiResponse<{ schedule_id: number; timestamp: number }>;
export type DeleteAllRestartSchedulesResponse = ApiResponse<{ count: number; timestamp: number }>;

export interface RestartScheduleFormData {
  schedule_type: 'daily' | 'weekly' | 'monthly' | 'once';
  time: string;
  days_of_week?: number[];
  days_of_month?: number[];
  restart_date?: string;
}

// Type guard functions
export function isApiError(response: any): response is { status: 'error'; code: number; message: string } {
  return response?.status === 'error' && typeof response?.code === 'number' && typeof response?.message === 'string';
}

export function isCreateRestartScheduleSuccess(response: any): response is CreateRestartScheduleResponse {
  return response?.status === 'success' && (response?.code === 200 || response?.code === 201) && response?.data !== undefined;
}

export function isUpdateRestartScheduleSuccess(response: any): response is UpdateRestartScheduleResponse {
  return response?.status === 'success' && response?.code === 200 && response?.data?.id !== undefined;
}

export function isDeleteRestartScheduleSuccess(response: any): response is DeleteRestartScheduleResponse {
  return response?.status === 'success' && response?.code === 200 && response?.data?.schedule_id !== undefined;
}

export function isDeleteAllRestartSchedulesSuccess(response: any): response is DeleteAllRestartSchedulesResponse {
  return response?.status === 'success' && response?.code === 200 && (response?.data?.count !== undefined || response?.data?.cleared_count !== undefined);
}

import axios from '@/api/axios';
import type {
  RestartSchedulesResponse,
  CreateRestartScheduleResponse,
  UpdateRestartScheduleResponse,
  DeleteRestartScheduleResponse,
  DeleteAllRestartSchedulesResponse
} from '@/types/restartSchedules';

export const fetchRestartSchedules = async (page = 1, perPage = 10) => {
  try {
    return await axios.get<RestartSchedulesResponse>(
      `/restart-schedules?page=${page}&per_page=${perPage}`
    );
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch restart schedules');
  }
};

export const createRestartSchedule = async (scheduleData: any) => {
  try {
    return await axios.post<CreateRestartScheduleResponse>(
      '/restart-schedules',
      scheduleData
    );
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create restart schedule');
  }
};

export const updateRestartSchedule = async (scheduleData: any) => {
  try {
    return await axios.put<UpdateRestartScheduleResponse>(
      '/restart-schedules',
      scheduleData
    );
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update restart schedule');
  }
};

export const deleteRestartSchedule = async (scheduleId: number) => {
  try {
    return await axios.delete<DeleteRestartScheduleResponse>(
      `/restart-schedules?schedule_id=${scheduleId}`
    );
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete restart schedule');
  }
};

export const deleteAllRestartSchedules = async () => {
  try {
    return await axios.post<DeleteAllRestartSchedulesResponse>(
      '/clear-restart-schedules'
    );
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete all restart schedules');
  }
};

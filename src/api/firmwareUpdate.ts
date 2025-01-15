import api from '@/api/axios';
import type { FirmwareUpdateResponse } from '@/types/firmwareUpdate';

const MAX_FIRMWARE_SIZE = 2 * 1024 * 1024; // 2MB max size

export const uploadFirmware = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<FirmwareUpdateResponse> => {
  console.debug('[Firmware Update] Starting upload:', {
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    fileType: file.type
  });

  if (file.size > MAX_FIRMWARE_SIZE) {
    const error = `Firmware file size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (2MB)`;
    console.error('[Firmware Update] Size validation failed:', error);
    throw new Error(error);
  }

  const formData = new FormData();
  formData.append('firmware', file);

  try {
    const { data } = await api.post<FirmwareUpdateResponse>(
      '/firmware-update',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 1800000, // 30 minutes timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          onProgress?.(percentCompleted);
          console.debug('[Firmware Update] Upload progress:', `${percentCompleted}%`);
        }
      }
    );

    console.debug('[Firmware Update] Upload completed successfully');
    return data;
  } catch (error) {
    console.error('[Firmware Update] Upload failed:', error);
    throw error;
  }
};

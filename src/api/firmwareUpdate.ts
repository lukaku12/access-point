import axios from 'axios';
import type { FirmwareUpdateResponse } from '@/types/firmwareUpdate';

export const uploadFirmware = async (file: File): Promise<FirmwareUpdateResponse> => {
  const formData = new FormData();
  formData.append('firmware', file);

  const { data } = await axios.post<FirmwareUpdateResponse>('/api/firmware/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return data;
};

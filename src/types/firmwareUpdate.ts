export interface FirmwareUpdateResponse {
  success: boolean;
  message: string;
  progress?: number;
}

export interface UploadState {
  isDragging: boolean;
  file: File | null;
  progress: number;
  isUploading: boolean;
  error: string | null;
}

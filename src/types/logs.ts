export interface Log {
  id: string;
  message: string;
  timestamp: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface LogsResponse {
  status: 'success';
  pagination: PaginationInfo;
  data: Log[];
}

export interface BaseResponse {
  status: 'success';
  message: string;
}

export type DeleteLogResponse = BaseResponse;
export type ClearLogsResponse = BaseResponse;
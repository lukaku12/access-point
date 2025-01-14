export interface CardRead {
  id: number;
  card_number: string;
  timestamp: string;
  type: string;
}

interface PaginationData {
  total: number;
  page: number;
  total_pages: number;
  per_page: number;
}

export interface FetchCardReadsSuccess {
  status: 'success';
  data: CardRead[];
  pagination: PaginationData;
}

export interface DeleteAllCardReadsSuccess {
  status: 'success';
  code: 200;
  message: string;
  data: {
    reads_removed: number;
    timestamp: number;
  };
}

export interface AuthError {
  status: 'error';
  code: 401;
  message: string;
}

export interface OperationError {
  status: 'error';
  code: 500;
  message: string;
  error: string;
}

export type ApiError = AuthError | OperationError;

export function isDeleteAllCardReadsSuccess(
  data: any
): data is DeleteAllCardReadsSuccess {
  return data.status === 'success' && data.code === 200;
}

export function isAuthError(data: any): data is AuthError {
  return data.status === 'error' && data.code === 401;
}

export function isOperationError(data: any): data is OperationError {
  return data.status === 'error' && data.code === 500;
}

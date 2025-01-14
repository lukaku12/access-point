import api from '@/api/axios';
import type {
  FetchCardReadsSuccess,
  DeleteAllCardReadsSuccess,
  ApiError
} from '@/types/cardReads';

export const fetchCardReads = (page: number, perPage: number) => {
  return api.get<FetchCardReadsSuccess | ApiError>(
    `/card-reads?page=${page}&per_page=${perPage}`
  );
};

export const removeAllCardReads = () => {
  return api.delete<DeleteAllCardReadsSuccess | ApiError>('/card-reads');
};

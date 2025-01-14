export interface Card {
  id: number;
  number: string;
  personal_id: string | null;
  start_date: string;
  end_date?: string;
}

export interface CardsResponse {
  status: string;
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  data: Card[];
}

export interface ApiResponse {
  status: string;
  message?: string;
  data?: any;
}

export interface UnregisteredCard {
  card_number: string;
  last_seen: string;
}

export interface UnregisteredCardsResponse {
  status: string;
  timestamp: number;
  count: number;
  data: UnregisteredCard[];
}

export interface CreateCardSuccessResponse {
  status: 'success';
  code: 201;
  message: string;
  data: {
    number: string;
    personal_id: string | null;
    start_date: string;
    end_date?: string;
  };
}

export interface CreateCardErrorResponse {
  status: 'error';
  code: 409;
  message: string;
  data: {
    card_number: string;
  };
}

export type CreateCardResponse = CreateCardSuccessResponse | CreateCardErrorResponse;

// Type guard functions
export const isCreateCardSuccess = (
  response: CreateCardResponse
): response is CreateCardSuccessResponse => {
  return response.status === 'success' && response.code === 201;
};

export const isCreateCardError = (
  response: CreateCardResponse
): response is CreateCardErrorResponse => {
  return response.status === 'error' && response.code === 409;
};

export interface DeleteAllCardsSuccessResponse {
  status: 'success';
  code: 200;
  message: string;
  data: {
    cards_removed: number;
    timestamp: number;
  };
}

export interface DeleteAllCardsErrorResponse {
  status: 'error';
  code: 401 | 500;
  message: string;
  error?: string;
}

export type DeleteAllCardsResponse = DeleteAllCardsSuccessResponse | DeleteAllCardsErrorResponse;

// Type guard functions
export const isDeleteAllCardsSuccess = (
  response: DeleteAllCardsResponse
): response is DeleteAllCardsSuccessResponse => {
  return response.status === 'success' && response.code === 200;
};

export const isDeleteAllCardsError = (
  response: DeleteAllCardsResponse
): response is DeleteAllCardsErrorResponse => {
  return response.status === 'error';
};

export interface DeleteCardSuccessResponse {
  status: 'success';
  code: 200;
  message: string;
  data: {
    card_id: number;
    timestamp: number;
  };
}

export interface DeleteCardErrorResponse {
  status: 'error';
  code: 400 | 401 | 500;
  message: string;
  error?: string;
  data?: {
    card_id: number;
  };
}

export type DeleteCardResponse = DeleteCardSuccessResponse | DeleteCardErrorResponse;

export const isDeleteCardSuccess = (
  response: DeleteCardResponse
): response is DeleteCardSuccessResponse => {
  return response.status === 'success' && response.code === 200;
};

export const isDeleteCardError = (
  response: DeleteCardResponse
): response is DeleteCardErrorResponse => {
  return response.status === 'error';
};
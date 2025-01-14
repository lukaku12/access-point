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
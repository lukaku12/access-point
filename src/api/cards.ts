import api from '@/api/axios';
import type { CardsResponse, ApiResponse, Card, UnregisteredCardsResponse, CreateCardResponse } from '@/types/card';

export const fetchCards = (page = 1, perPage = 10) => {
  return api.get<CardsResponse>('/cards', {
    params: {
      page,
      per_page: perPage
    }
  });
};

export const removeCard = async (id: number) => {
  return api.delete<ApiResponse>(`/cards/${id}`);
};

export const removeAllCards = async () => {
  return api.delete<ApiResponse>('/cards/clear');
};

export const createCard = async (cardData: Partial<Card>) => {
  return api.post<CreateCardResponse>('/cards', cardData);
};

export const updateCard = async (id: number, cardData: Partial<Card>) => {
  return api.put<ApiResponse>(`/cards/${id}`, cardData);
};

export const fetchUnregisteredCards = async () => {
  return api.get<UnregisteredCardsResponse>('/latest-card-reads');
};

import api from '@/api/axios';
import type {
  CardsResponse,
  Card,
  UnregisteredCardsResponse,
  CreateCardResponse,
  DeleteAllCardsResponse,
  DeleteCardResponse,
  UpdateCardResponse
} from '@/types/card';

export const fetchCards = (page = 1, perPage = 10) => {
  return api.get<CardsResponse>('/cards', {
    params: {
      page,
      per_page: perPage
    }
  });
};

export const removeCard = async (id: number) => {
  return api.delete<DeleteCardResponse>(`/cards?card_id=${id}`);
};

export const removeAllCards = async () => {
  return api.post<DeleteAllCardsResponse>('/clear-cards');
};

export const createCard = async (cardData: Partial<Card>) => {
  return api.post<CreateCardResponse>('/cards', cardData);
};

export const updateCard = async (cardId: number, cardData: Partial<Card>) => {
  return api.put<UpdateCardResponse>('/cards', {
    id: cardId,
    ...cardData
  });
};

export const fetchUnregisteredCards = async () => {
  return api.get<UnregisteredCardsResponse>('/latest-card-reads');
};

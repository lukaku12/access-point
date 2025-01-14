import api from '@/api/axios'; // Update this import to match your axios setup
import type {
  WiFiNetwork,
  GetWiFiNetworksResponse,
  CreateWiFiResponse,
  UpdateWiFiResponse,
  DeleteWiFiResponse,
  DeleteAllWiFiResponse
} from '@/types/wifi';

export const fetchWiFiNetworks = (page: number, perPage: number) => {
  return api.get<GetWiFiNetworksResponse>('/wifi', {
    params: { page, per_page: perPage }
  });
};

export const createWiFiNetwork = (network: Partial<WiFiNetwork>) => {
  return api.post<CreateWiFiResponse>('/wifi', network);
};

export const updateWiFiNetwork = (
  id: number,
  network: Partial<WiFiNetwork>
) => {
  return api.put<UpdateWiFiResponse>(`/wifi/${id}`, network);
};

export const removeWiFiNetwork = (id: number) => {
  return api.delete<DeleteWiFiResponse>(`/wifi/${id}`);
};

export const removeAllWiFiNetworks = () => {
  return api.delete<DeleteAllWiFiResponse>('/wifi');
};

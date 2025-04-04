import api from '@/api/axios'; // Update this import to match your axios setup
import type {
  WiFiNetwork,
  WiFiCredentials,
  GetWiFiNetworksResponse,
  CreateWiFiResponse,
  UpdateWiFiResponse,
  DeleteWiFiResponse,
  DeleteAllWiFiResponse
} from '@/types/wifi';

export const fetchWiFiNetworks = () => {
  return api.get<GetWiFiNetworksResponse>('/wifi-credentials');
};

export const createWiFiNetwork = (network: WiFiCredentials) => {
  return api.post<CreateWiFiResponse>('/wifi-credentials', {
    credentials: network
  });
};

export const updateWiFiNetwork = (
  id: number,
  network: Partial<WiFiNetwork>
) => {
  return api.put<UpdateWiFiResponse>('/wifi-credentials', {
    id,
    ...network
  });
};

export const removeWiFiNetwork = (id: number) => {
  return api.delete<DeleteWiFiResponse>(
    `/wifi-credentials?credential_id=${id}`
  );
};

export const removeAllWiFiNetworks = () => {
  return api.post<DeleteAllWiFiResponse>('/clear-wifi-credentials');
};

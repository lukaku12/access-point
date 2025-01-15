import api from '@/api/axios';
import type { AuthResponse, ConnectionDetails } from '@/types/login';

export const login = async (
  ip: string,
  port: number,
  authKey: string
): Promise<boolean> => {
  try {
    // Set connection details first
    const connectionDetails: ConnectionDetails = {
      ip,
      port,
      auth_key: authKey
    };
    localStorage.setItem('connection', JSON.stringify(connectionDetails));
    
    // Force axios to use new base URL
    api.defaults.baseURL = `http://${ip}:${port}`;
    
    // Try to authenticate
    const response = await api.post<AuthResponse>('/auth-key');
    if (response.data.success) {
      localStorage.setItem('isAuthorized', 'true');
      return true;
    }
    
    // If we get here, authentication failed
    logout();
    return false;
  } catch (error: any) {
    // Clear credentials on error
    logout();
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error('Invalid request parameters');
        case 500:
          throw new Error('Server error occurred');
        default:
          throw new Error('Authentication failed');
      }
    }
    throw new Error('Network error occurred');
  }
};

export const isAuthorized = (): boolean => {
  return localStorage.getItem('isAuthorized') === 'true';
};

export const logout = (): void => {
  localStorage.removeItem('isAuthorized');
  localStorage.removeItem('connection');
};

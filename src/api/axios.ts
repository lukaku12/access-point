import axios, { type AxiosError } from 'axios';
import type { ConnectionDetails } from '@/types/login';

const getBaseUrl = () => {
  const connection = localStorage.getItem('connection');
  if (!connection) return '';
  const { ip, port } = JSON.parse(connection) as ConnectionDetails;
  return `http://${ip}:${port}`;
};

const getAuthKey = () => {
  const connection = localStorage.getItem('connection');
  if (!connection) return '';
  const { auth_key } = JSON.parse(connection) as ConnectionDetails;
  return auth_key;
};

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  },
  withCredentials: false
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['X-Auth-Key'] = getAuthKey();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const errorMessage =
      error.response?.data?.message || 'An unexpected error occurred';
    const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR';

    console.error(`API Error (${errorCode}):`, errorMessage);
    return Promise.reject({ message: errorMessage, code: errorCode });
  }
);

interface ApiError {
  message: string;
  code: string;
}

export default axiosInstance;

import axios, { type AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
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
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
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

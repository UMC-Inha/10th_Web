import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../utils/authToken';
import type { ApiResponse, SigninResponseData } from '../types/auth';

export const API_BASE_URL = 'http://localhost:8000/v1';

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

const shouldSkipRefresh = (url?: string) => {
  if (!url) return false;
  return url.includes('/auth/signin') || url.includes('/auth/signup') || url.includes('/auth/refresh');
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const isUnauthorized = error.response?.status === 401;
    const refreshToken = getRefreshToken();

    if (!originalRequest || !isUnauthorized || originalRequest._retry || shouldSkipRefresh(originalRequest.url) || !refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = axios
        .post<ApiResponse<SigninResponseData>>(`${API_BASE_URL}/auth/refresh`, { refresh: refreshToken })
        .then((response) => {
          if (!response.data.status || !response.data.data?.accessToken) return null;
          const newAccessToken = response.data.data.accessToken;
          setAccessToken(newAccessToken);
          if (response.data.data.refreshToken) {
            setRefreshToken(response.data.data.refreshToken);
          }
          return newAccessToken;
        })
        .catch(() => {
          clearAuthTokens();
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return apiClient(originalRequest);
  },
);

export default apiClient;

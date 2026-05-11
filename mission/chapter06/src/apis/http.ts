import axios, {
  AxiosError,
  type AxiosRequestConfig,
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
import { ApiError } from '../utils/apiError';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/v1';
export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type RequestOptions = {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: AxiosRequestConfig['params'];
};

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

const SKIP_REFRESH_URLS = ['/auth/signin', '/auth/signup', '/auth/refresh'] as const;

const shouldSkipRefresh = (url?: string) => {
  if (!url) return false;
  return SKIP_REFRESH_URLS.some((path) => url.includes(path));
};

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    const status = error.response?.status ?? 0;
    const message = error.response?.data?.message || error.message || '요청에 실패했습니다.';
    return new ApiError(message, status);
  }

  if (error instanceof Error) return new ApiError(error.message, 0);
  return new ApiError('요청에 실패했습니다.', 0);
}

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
          window.location.href = '/auth/signin';
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

export async function request<T>({ method, url, data, params }: RequestOptions): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      method,
      url,
      data,
      params,
    });

    if (!response.data.status) {
      const status = response.status ?? 0;
      throw new ApiError(response.data.message || '요청에 실패했습니다.', status);
    }

    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function requestData<T>(options: RequestOptions): Promise<T | null> {
  const response = await request<T>(options);
  return response.data;
}

export default apiClient;

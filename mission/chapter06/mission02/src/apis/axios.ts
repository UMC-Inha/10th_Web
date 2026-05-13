// src/apis/axios.ts

import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustominternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const parsed = accessToken ? JSON.parse(accessToken) : null;
    if (parsed) {
      config.headers.Authorization = `Bearer ${parsed}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustominternalAxiosRequestConfig = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/v1/auth/refresh') {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
            const parsed = refreshToken ? JSON.parse(refreshToken) : null;

            const { data } = await axios.post(
              `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
              { refresh: parsed }
            );

            localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(data.data.accessToken));
            localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(data.data.refreshToken));

            return data.data.accessToken;
          } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            return Promise.reject(error);
          } finally {
            refreshPromise = null;
          }
        })();
      }

      return refreshPromise!.then((newAccessToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);
// src/apis/axios.ts

import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustominternalAxiosRequestConfig extends InternalAxiosRequestConfig{
  _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지한다
let refreshPromise : Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터 : 모든 요청 전에 accessToken을 Authorization 헤더에 추가한다
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken); // 로컬 스토리지에서 accessToken을 가져온다
  const parsed = accessToken ? JSON.parse(accessToken) : null; // accessToken이 존재하면 JSON 파싱을 한다
  if (parsed) {
    config.headers.Authorization = `Bearer ${parsed}`; // Authorization 헤더에 accessToken을 추가한다
  }
  // 수정된 요청 설정을 반환한다.
  return config;
},
  // 요청 인터셉터가 실패하면 에러를 반환한다
  (error) => Promise.reject(error),
  );

  // 응답 인터셉터 : 401 에러 발생 -> refreshToken을 통한 토큰 갱신을 처리한다.
  axiosInstance.interceptors.response.use(
    // 정상 응답 그대로 반환 
    (response) => response,

    async (error) => {
      const originalRequest : CustominternalAxiosRequestConfig = error.config;

      // 401 에러면서, 아직 재시도 하지 않은 요청일 경우 처리
      // 서버에 따른 케이스 추가 해줘야함
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) { 
        // refresh 엔드포인트 401 에러가 발생한 경우 (Unauthorized), 중복 재시도 방지를 위해 로그아웃 처리
        if (originalRequest.url === '/v1/auth/refresh') {
          // useLocalStorage 훅 대신 localStorage 직접 사용하여 토큰 삭제 
          localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
          localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // 재시도 플래그 설정
        originalRequest._retry = true;

      // 이미 refresh 요청이 진행중이면, 그 Promise를 재사용한다.
      if (!refreshPromise) {
        // refresh 요청 실행 후, Promise를 전역 변수에 할당
        refreshPromise = (async () => {
          try {
            const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
            const parsed = refreshToken ? JSON.parse(refreshToken) : null;
            const { data } = await axiosInstance.post('/v1/auth/refresh', {
              refresh: parsed,
            });

            // 새 토큰 저장
            localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(data.data.accessToken));
            localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(data.data.refreshToken));

            return data.data.accessToken;
          } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);

            // 에러 발생 시 Promise를 실패 상태로 만듭니다.
            return Promise.reject(error);
          } finally {
            refreshPromise = null; // 요청이 끝났으므로 초기화
          }
        })(); // 즉시 실행 함수 호출
      }

      // 진행중인 refreshPromise가 해결될 때까지 기다림
      return refreshPromise!.then((newAccessToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }
    // 401에러가 아닌 경우에 그대로 오류를 반환
    return Promise.reject(error);
  }
  );
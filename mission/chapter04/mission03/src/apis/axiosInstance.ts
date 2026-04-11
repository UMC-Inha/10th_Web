import axios from "axios";
import { refresh } from "./auth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

// accessToken 만료 시 재발급 인터셉터 등록
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 공통 에러 처리 인터셉터 등록
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401) {
      const isLoginRequest = error.config?.url?.includes("signin");
      if (isLoginRequest) return Promise.reject(error);

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const response = await refresh({ refresh: refreshToken });
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return axiosInstance(error.config);
      }
      window.location.href = "/login";
    } else if (status === 500) {
      // 서버 에러
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }

    return Promise.reject(error);
  },
);
export default axiosInstance;

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/v1',
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  // 성공 응답은 그냥 통과
  (response) => response,

  // 실패 응답(에러)은 여기서 처리
  async (error) => {
    const originalRequest = error.config;

    // 401 = 토큰 만료
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 재시도 표시 → 한 번만 재시도하도록 기록
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await axios.post(
          'http://localhost:8000/v1/auth/refresh',
          {
            refresh: refreshToken,
          },
        );

        // 새로 받은 accessToken 저장
        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // 실패했던 요청 헤더도 새 토큰으로 교체
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 실패했던 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refreshToken도 만료 → 강제 로그아웃
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

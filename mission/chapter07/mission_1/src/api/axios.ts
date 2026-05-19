import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 토큰 갱신 중복 방지용 변수
let isRefreshing = false; // 현재 갱신 중인지
let refreshSubscribers: ((token: string) => void)[] = []; // 대기 중인 요청들

//갱신 완료 후 대기 중인 요청들한테 새 토큰 전달
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 대기열에 요청 추가
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

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

      // 이미 갱신 중이면 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true; // 갱신 시작

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`, // env로 변경
          {
            refresh: refreshToken,
          },
        );

        // 새로 받은 accessToken 저장
        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        isRefreshing = false;
        onRefreshed(newAccessToken); // 대기 중인 요청들 처리

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

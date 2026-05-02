import axios from "axios";

// _retry: 이미 재시도한 요청인지 표시 → 무한 재시도 루프 방지용
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({ baseURL: BASE_URL });

// 모든 요청에 accessToken을 자동으로 Authorization 헤더에 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 여러 요청이 동시에 401을 받았을 때 단 한 번의 refresh만 실행되도록 단일 인스턴스로 공유해야 하기 때문에 전역 상태로 관리
let isRefreshing = false;

// refresh 완료를 기다리는 요청들의 콜백 목록으로, 성공 시 새 토큰(string), 실패 시 null을 받아 각자 resolve/reject 처리
let refreshSubscribers: ((token: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

// refresh 성공: 대기 중인 모든 요청에 새 토큰을 전달해 재시도
function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// refresh 실패: null을 전달해 대기 중인 요청들이 즉시 reject될 수 있게 함
// 초기화하지 않으면 구독자 Promise가 영원히 pending 상태(좀비)로 남음
function onRefreshFailed() {
  refreshSubscribers.forEach((cb) => cb(null));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 로그인·회원가입·refresh 엔드포인트에서 발생한 401은 토큰 만료가 아닌 자격증명 오류이므로 refresh를 시도하면 안 됨
    // (특히 /auth/refresh가 없으면 무한 루프 발생)
    const AUTH_ENDPOINTS = ["/auth/signin", "/auth/signup", "/auth/refresh"];
    const isAuthEndpoint = AUTH_ENDPOINTS.some((url) =>
      originalRequest.url?.includes(url),
    );

    if (
      error.response?.status !== 401 || // 401 외의 에러는 그대로 전파
      originalRequest._retry || // 이미 재시도한 요청이면 무한 루프 차단
      isAuthEndpoint // 인증 엔드포인트는 refresh 불필요
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // 다른 요청이 이미 refresh 중이면 대기열에 등록, refresh 완료 후 새 토큰을 받아 자동으로 재시도됨
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (!token) return reject(error); // refresh 실패 시 이 요청도 에러로 처리
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    // 현재 요청이 refresh를 처음 시작하는 요청
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");

      // api 인스턴스를 쓰면 이 인터셉터가 다시 실행되어 무한 루프 발생
      const { data } = await axios.post(`${BASE_URL}/v1/auth/refresh`, {
        refresh: refreshToken,
      });

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // 대기 중이던 모든 요청에 새 토큰을 전달해 일괄 재시도
      onRefreshed(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch {
      // refresh 토큰 만료
      onRefreshFailed();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

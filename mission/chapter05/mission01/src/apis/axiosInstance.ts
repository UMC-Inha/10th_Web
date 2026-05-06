import axios from 'axios';

const axiosInstance = axios.create({
  // [1] 백엔드 서버 주소 (아까 켠 NestJS 서버 주소!)
  baseURL: 'http://localhost:8000', 
  // [2] 요청이 너무 오래 걸리면 끊기 (5초)
  timeout: 5000,
  // [3] 쿠키나 인증 헤더를 같이 보낼지 설정 (CORS 관련)
  withCredentials: true,
});

// [4] 요청 인터셉터 (예: 모든 요청에 토큰 자동으로 끼워넣기)
axiosInstance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지 등에서 토큰을 가져와서 헤더에 넣어줄 수 있어요!
    const token = localStorage.getItem('accessToken');
    if (token) {
      const accessToken = JSON.parse(token);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
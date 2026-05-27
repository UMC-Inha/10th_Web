import axiosInstance from './axios';

// 로그인
export const signin = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/signin', { email, password });
  return response.data;
};

// 로그아웃
export const signout = async () => {
  const response = await axiosInstance.post('/auth/signout');
  return response.data;
};
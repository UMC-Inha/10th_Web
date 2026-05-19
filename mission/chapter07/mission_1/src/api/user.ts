import axiosInstance from './axios';

// 내 프로필 조회
export const getMyProfile = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

// 프로필 수정
export const updateMyProfile = async (formData: FormData) => {
  const response = await axiosInstance.patch('/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 회원 탈퇴
export const deleteMyAccount = async () => {
  const response = await axiosInstance.delete('/users');
  return response.data;
};

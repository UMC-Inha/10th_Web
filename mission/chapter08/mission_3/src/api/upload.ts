import axiosInstance from './axios';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // 응답에서 imageUrl 반환
  return response.data.data.imageUrl;
};
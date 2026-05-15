import apiClient from './http';
import { getAccessToken } from '../utils/authToken';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const accessToken = getAccessToken();
  const response = await apiClient.post<{ url: string } | { data: { url: string } }>(
    '/uploads',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    },
  );

  const resData = response.data as { url?: string; data?: { url: string } };
  const url = resData.url ?? resData.data?.url;
  if (!url) throw new Error('이미지 업로드에 실패했습니다.');
  return url;
}

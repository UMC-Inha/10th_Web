import type { ApiResponse } from '../types/auth';
import apiClient from './http';

/**
 * 이미지 파일을 서버에 업로드하고 URL을 반환합니다.
 * - Content-Type은 axios가 FormData를 감지해 boundary를 포함한 값으로 자동 설정합니다.
 * - Authorization 헤더는 apiClient 인터셉터가 자동으로 처리합니다.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ApiResponse<{ url: string }>>('/uploads', formData);

  const url = response.data.data?.url;
  if (!url) throw new Error('이미지 업로드에 실패했습니다.');
  return url;
}

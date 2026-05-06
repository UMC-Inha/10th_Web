import axiosInstance from './axios';
import type { LpDetailResponse, LpListResponse } from '../types/lp';

// LP 목록 조회
export const getLps = async (
  order: 'asc' | 'desc' = 'desc',
): Promise<LpListResponse> => {
  const response = await axiosInstance.get('/lps', {
    params: { order, limit: 10, cursor: 0 },
  });
  return response.data;
};

// LP 상세 조회
export const getLpDetail = async (lpId: number): Promise<LpDetailResponse> => {
  const response = await axiosInstance.get(`/lps/${lpId}`);
  return response.data;
};

// LP 좋아요
export const likeLp = async (lpId: number) => {
  const response = await axiosInstance.post(`/lps/${lpId}/likes`);
  return response.data;
};

// LP 삭제
export const deleteLp = async (lpId: number) => {
  const response = await axiosInstance.delete(`/lps/${lpId}`);
  return response.data;
};

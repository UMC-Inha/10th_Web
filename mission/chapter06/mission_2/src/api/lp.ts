import axiosInstance from './axios';
import type { CommentListResponse, LpDetailResponse, LpListResponse } from '../types/lp';

// LP 목록 조회
export const getLps = async (
  order: 'asc' | 'desc' = 'desc',
  cursor: number = 0,
): Promise<LpListResponse> => {
  const response = await axiosInstance.get('/lps', {
    params: { order, limit: 10, cursor },
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

// 댓글 목록 조회
export const getComments = async (
  lpId: number,
  order: 'asc' | 'desc' = 'asc',
  cursor: number = 0,
): Promise<CommentListResponse> => {
  const response = await axiosInstance.get(`/lps/${lpId}/comments`, {
    params: { order, limit: 10, cursor },
  });
  return response.data;
};

// 댓글 작성
export const createComment = async (lpId: number, content: string) => {
  const response = await axiosInstance.post(`/lps/${lpId}/comments`, { content });
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (lpId: number, commentId: number) => {
  const response = await axiosInstance.delete(`/lps/${lpId}/comments/${commentId}`);
  return response.data;
};
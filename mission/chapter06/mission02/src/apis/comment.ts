// src/apis/comment.ts

import { axiosInstance } from "./axios";

export type CommentOrder = "asc" | "desc";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  lpId: number;
  authorId: number;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface CommentListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: Comment[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export const getComments = async (
  lpId: string,
  order: CommentOrder = "desc",
  cursor: number = 0,
  limit: number = 10
): Promise<CommentListResponse> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order, cursor, limit },
  });
  return data;
};

export const postComment = async (lpId: string, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
  return data;
};

export const deleteComment = async (lpId: string, commentId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
  return data;
};
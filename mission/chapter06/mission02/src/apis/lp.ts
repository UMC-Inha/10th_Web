// src/apis/lp.ts

import { axiosInstance } from "./axios";

export type SortOrder = "asc" | "desc";

export interface Tag {
  id: number;
  name: string;
}

export interface Lp {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  tags: Tag[];
  likes: { userId: number }[];
}

export interface LpListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: Lp[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export interface LpDetailResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: Lp;
}

export const getLpList = async (
  order: SortOrder = "desc",
  cursor: number = 0,
  limit: number = 20
): Promise<LpListResponse> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: { order, cursor, limit },
  });
  return data;
};

export const getLpDetail = async (lpId: string): Promise<LpDetailResponse> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

export const postLike = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};
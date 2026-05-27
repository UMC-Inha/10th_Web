// src/apis/myLp.ts

import { axiosInstance } from "./axios";
import type { SortOrder } from "./lp";

export interface MyLpListResponse {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    data: {
      id: number;
      title: string;
      thumbnail: string;
      createdAt: string;
    }[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

// 내가 좋아요한 LP
export const getMyLikedLps = async (
  order: SortOrder = "desc",
  cursor: number = 0,
  limit: number = 20
): Promise<MyLpListResponse> => {
  const { data } = await axiosInstance.get("/v1/lps/likes/me", {
    params: { order, cursor, limit },
  });
  return data;
};

// 내가 작성한 LP
export const getMyLps = async (
  order: SortOrder = "desc",
  cursor: number = 0,
  limit: number = 20
): Promise<MyLpListResponse> => {
  const { data } = await axiosInstance.get("/v1/lps/user", {
    params: { order, cursor, limit },
  });
  return data;
};
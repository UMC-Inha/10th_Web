import axios from 'axios';
import type { ApiResponse } from '../types/auth';
import type { UserInfo } from '../types/user';
import apiClient from './http';

function toApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message || '요청에 실패했습니다.';
  }
  if (error instanceof Error) return error.message;
  return '요청에 실패했습니다.';
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(path);
    if (!response.data.status) {
      throw new Error(response.data.message || '요청에 실패했습니다.');
    }
    return response.data.data;
  } catch (error) {
    throw new Error(toApiErrorMessage(error));
  }
}

export function getMyInfo() {
  return getJson<UserInfo>('/users/me');
}

export function getUserInfo(userId: string) {
  return getJson<UserInfo>(`/users/${userId}`);
}

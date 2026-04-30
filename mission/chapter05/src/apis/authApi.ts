import axios from 'axios';
import type {
  ApiResponse,
  SigninRequest,
  SigninResponseData,
  SignupRequest,
  SignupResponseData,
} from '../types/auth';
import apiClient from './http';

function toApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message || '요청에 실패했습니다.';
  }
  if (error instanceof Error) return error.message;
  return '요청에 실패했습니다.';
}

async function postJson<T>(path: string, payload: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(path, payload);

    if (!response.data.status) {
      throw new Error(response.data.message || '요청에 실패했습니다.');
    }

    return response.data;
  } catch (error) {
    throw new Error(toApiErrorMessage(error));
  }
}

export function signup(payload: SignupRequest) {
  return postJson<SignupResponseData>('/auth/signup', payload);
}

export function signin(payload: SigninRequest) {
  return postJson<SigninResponseData>('/auth/signin', payload);
}

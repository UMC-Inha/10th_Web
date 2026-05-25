import { ApiError } from './apiError';

export function getApiErrorStatus(error: unknown): number | null {
  if (error instanceof ApiError) return error.status;
  return null;
}

export function getApiErrorMessage(error: unknown, fallback = '요청에 실패했습니다.'): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return '로그인이 필요합니다.';
    if (error.status === 404) return '요청한 리소스를 찾을 수 없습니다.';
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

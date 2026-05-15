import type {
  CommentDto,
  CommentListData,
  CreateLpRequest,
  GetCommentsParams,
  GetLpsParams,
  LpDetailDto,
  LpDto,
  LpListData,
  UpdateLpRequest,
} from '../types/lp';
import { request, requestData } from './http';

export function getLps(params?: GetLpsParams) {
  return requestData<LpListData>({
    method: 'get',
    url: '/lps',
    params,
  });
}

export function getLpById(lpId: number) {
  return requestData<LpDetailDto>({
    method: 'get',
    url: `/lps/${lpId}`,
  });
}

export function createLp(data: CreateLpRequest) {
  return request<LpDto>({
    method: 'post',
    url: '/lps',
    data,
  });
}

export function updateLp(lpId: number, data: UpdateLpRequest) {
  return request<LpDto>({
    method: 'patch',
    url: `/lps/${lpId}`,
    data,
  });
}

export function deleteLp(lpId: number) {
  return request<null>({
    method: 'delete',
    url: `/lps/${lpId}`,
  });
}

export function toggleLike(lpId: number) {
  return request<LpDto>({
    method: 'post',
    url: `/lps/${lpId}/likes`,
    data: {},
  });
}

export function getComments(lpId: number, params?: GetCommentsParams) {
  return requestData<CommentListData>({
    method: 'get',
    url: `/lps/${lpId}/comments`,
    params,
  });
}

export function createComment(lpId: number, content: string) {
  return request<CommentDto>({
    method: 'post',
    url: `/lps/${lpId}/comments`,
    data: { content },
  });
}

export function updateComment(lpId: number, commentId: number, content: string) {
  return request<CommentDto>({
    method: 'patch',
    url: `/lps/${lpId}/comments/${commentId}`,
    data: { content },
  });
}

export function deleteComment(lpId: number, commentId: number) {
  return request<null>({
    method: 'delete',
    url: `/lps/${lpId}/comments/${commentId}`,
  });
}

import { API_LP_PATHS } from '../constants/paths';
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
    url: API_LP_PATHS.list,
    params,
  });
}

export function getLpById(lpId: number) {
  return requestData<LpDetailDto>({
    method: 'get',
    url: API_LP_PATHS.detail(lpId),
  });
}

export function createLp(data: CreateLpRequest) {
  return request<LpDto>({
    method: 'post',
    url: API_LP_PATHS.list,
    data,
  });
}

export function updateLp(lpId: number, data: UpdateLpRequest) {
  return request<LpDto>({
    method: 'patch',
    url: API_LP_PATHS.detail(lpId),
    data,
  });
}

export function deleteLp(lpId: number) {
  return request<null>({
    method: 'delete',
    url: API_LP_PATHS.detail(lpId),
  });
}

export function toggleLike(lpId: number) {
  return request<LpDto>({
    method: 'post',
    url: API_LP_PATHS.likes(lpId),
    data: {},
  });
}

export function getComments(lpId: number, params?: GetCommentsParams) {
  return requestData<CommentListData>({
    method: 'get',
    url: API_LP_PATHS.comments(lpId),
    params,
  });
}

export function createComment(lpId: number, content: string) {
  return request<CommentDto>({
    method: 'post',
    url: API_LP_PATHS.comments(lpId),
    data: { content },
  });
}

export function updateComment(lpId: number, commentId: number, content: string) {
  return request<CommentDto>({
    method: 'patch',
    url: API_LP_PATHS.comment(lpId, commentId),
    data: { content },
  });
}

export function deleteComment(lpId: number, commentId: number) {
  return request<null>({
    method: 'delete',
    url: API_LP_PATHS.comment(lpId, commentId),
  });
}

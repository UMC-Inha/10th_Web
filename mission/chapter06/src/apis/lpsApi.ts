import type { GetLpsParams, LpDetailDto, LpDto, LpListData } from '../types/lp';
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

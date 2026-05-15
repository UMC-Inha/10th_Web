import type { UserInfo } from '../types/user';
import { request, requestData } from './http';

export type UpdateUserRequest = {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
};

export function getMyInfo() {
  return requestData<UserInfo>({
    method: 'get',
    url: '/users/me',
  });
}

export function getUserInfo(userId: string) {
  return requestData<UserInfo>({
    method: 'get',
    url: `/users/${userId}`,
  });
}

export function updateMyInfo(data: UpdateUserRequest) {
  return requestData<UserInfo>({
    method: 'patch',
    url: '/users/me',
    data,
  });
}

export function deleteMyAccount() {
  return request<null>({
    method: 'delete',
    url: '/users/me',
  });
}

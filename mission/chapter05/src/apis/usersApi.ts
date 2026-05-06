import type { UserInfo } from '../types/user';
import { requestData } from './http';

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

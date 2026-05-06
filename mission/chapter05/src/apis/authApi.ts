import type {
  SigninRequest,
  SigninResponseData,
  SignupRequest,
  SignupResponseData,
} from '../types/auth';
import { request } from './http';

export function signup(payload: SignupRequest) {
  return request<SignupResponseData>({
    method: 'post',
    url: '/auth/signup',
    data: payload,
  });
}

export function signin(payload: SigninRequest) {
  return request<SigninResponseData>({
    method: 'post',
    url: '/auth/signin',
    data: payload,
  });
}

export function signout() {
  return request<null>({
    method: 'post',
    url: '/auth/signout',
    data: {},
  });
}

import { API_AUTH_PATHS } from '../constants/paths';
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
    url: API_AUTH_PATHS.signup,
    data: payload,
  });
}

export function signin(payload: SigninRequest) {
  return request<SigninResponseData>({
    method: 'post',
    url: API_AUTH_PATHS.signin,
    data: payload,
  });
}

export function signout() {
  return request<null>({
    method: 'post',
    url: API_AUTH_PATHS.signout,
    data: {},
  });
}

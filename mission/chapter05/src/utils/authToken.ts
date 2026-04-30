import { ACCESS_TOKEN_KEY } from '../constants/auth';

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

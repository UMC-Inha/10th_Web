import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_NAME_KEY } from '../constants/auth';

export const AUTH_SESSION_INVALIDATED_EVENT = 'auth:session-invalidated';

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

export function setRefreshToken(token: string) {
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearRefreshToken() {
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getUserName() {
  return window.localStorage.getItem(USER_NAME_KEY);
}

export function setUserName(name: string) {
  window.localStorage.setItem(USER_NAME_KEY, name);
}

export function clearUserName() {
  window.localStorage.removeItem(USER_NAME_KEY);
}

export function clearAuthTokens() {
  clearAccessToken();
  clearRefreshToken();
  clearUserName();
}

/** localStorage 정리 후 AuthContext 등에 세션 무효화를 알림 */
export function invalidateAuthSession() {
  clearAuthTokens();
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_INVALIDATED_EVENT));
}

export function setAuthTokens(accessToken: string, refreshToken?: string | null, userName?: string | null) {
  setAccessToken(accessToken);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
  if (userName) {
    setUserName(userName);
  }
}

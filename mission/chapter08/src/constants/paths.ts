export const ROUTES = {
  home: '/',
  authSignin: '/auth/signin',
  authSignup: '/auth/signup',
  authGoogleCallback: '/auth/google/callback',
  usersMe: '/users/me',
  usersDetail: (userId: string) => `/users/${userId}`,
  lpDetail: (lpId: number) => `/lp/${lpId}`,
} as const;

export const API_AUTH_PATHS = {
  signin: '/auth/signin',
  signup: '/auth/signup',
  signout: '/auth/signout',
  refresh: '/auth/refresh',
  googleLogin: '/auth/google/login',
} as const;

export const SKIP_TOKEN_REFRESH_PATHS = [
  API_AUTH_PATHS.signin,
  API_AUTH_PATHS.signup,
  API_AUTH_PATHS.refresh,
] as const;

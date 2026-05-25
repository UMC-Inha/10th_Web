export const ROUTES = {
  home: '/',
  authSignin: '/auth/signin',
  authSignup: '/auth/signup',
  authGoogleCallback: '/auth/google/callback',
  usersMe: '/users/me',
  usersDetail: (userId: string) => `/users/${userId}`,
  lpDetail: (lpId: number) => `/lp/${lpId}`,
} as const;

export const ROUTE_PATTERNS = {
  lpDetail: '/lp/:lpId',
  usersDetail: '/users/:userId',
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

export const API_LP_PATHS = {
  list: '/lps',
  detail: (lpId: number) => `/lps/${lpId}`,
  likes: (lpId: number) => `/lps/${lpId}/likes`,
  comments: (lpId: number) => `/lps/${lpId}/comments`,
  comment: (lpId: number, commentId: number) => `/lps/${lpId}/comments/${commentId}`,
} as const;

export const API_UPLOAD_PATHS = {
  upload: '/uploads',
} as const;

export type ApiResponse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T | null;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
};

export type SignupResponseData = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SigninRequest = {
  email: string;
  password: string;
};

export type SigninResponseData = {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
};

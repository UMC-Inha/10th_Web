export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

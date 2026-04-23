import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (body: LoginRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/v1/auth/login', body);
  return data;
};

export const signup = async (body: SignupRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/v1/auth/signup', body);
  return data;
};